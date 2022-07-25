const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const PaymentDetailsSchema = mongoose.Schema({
  razorpayDetails: {
    orderId: String,
    paymentId: String,
    signature: String
  },
  success: Boolean
});

const PaymentDetails = mongoose.model('PatmentDetail', PaymentDetailsSchema);

router.post('/orders', async (req, res) => {
  if (!req.body.amount) {
    return res.status(422).json({ error: 'amount is missing in Request parameter' });
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const options = {
      amount: req.body.amount + '00',
      currency: 'INR',
      receipt: getRandomNo()
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).json({ msg: 'Some error occured' });

    res.status(200).json({
      order,
      razorpayPaymentKey: process.env.RAZORPAY_KEY_ID,
      serverdate: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

function getRandomNo() {
  const min = 1000;
  const max = 9999;
  const date = new Date();

  return date.toISOString() + '_' + Math.floor(Math.random() * (max - min) + min);
}

router.post('/success', async (req, res) => {
  try {
    const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Creating our own digest format should be like this:
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    const newPayment = PaymentDetails({
      razorpayDetails: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature
      },
      success: true
    });

    await newPayment.save();

    savePayment(req.body);

    res.json({
      msg: 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

const savePayment = function (body) {
  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      const db = client.db(process.env.mongoDB);
      db.collection('orders').insertOne(body, function (findErr, result) {
        if (!findErr) {
          // console.log(result);
        } else {
          console.log({
            error: 'Collection Error',
            error_message: findErr
          });
        }
        client.close();
      });
    } else {
      console.log({
        error: 'Database Connection Error',
        error_message: err
      });
    }
  });
};

module.exports = router;

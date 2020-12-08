const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const PaymentDetailsSchema = mongoose.Schema({
  razorpayDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  success: Boolean,
});

const PaymentDetails = mongoose.model("PatmentDetail", PaymentDetailsSchema);

router.post("/orders", async (req, res) => {
  if (!req.body.amount) {
    return res
      .status(422)
      .json({ error: "amount is missing in Request parameter" });
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: getRandomNo(),
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).json({ msg: "Some error occured" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error });
  }
});

function getRandomNo() {
  var min = 1000;
  var max = 9999;
  var date = new Date();

  return (
    date.toISOString() + "_" + Math.floor(Math.random() * (max - min) + min)
  );
}

router.post("/success", async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest format should be like this:
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    const newPayment = PaymentDetails({
      razorpayDetails: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      success: true,
    });

    await newPayment.save();

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

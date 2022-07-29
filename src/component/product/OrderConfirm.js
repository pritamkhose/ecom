import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBasketTotal } from '../../Reducer';
import { useStateValue } from '../../StateProvider';
import logo from './../../image/logo.svg';
import CartEmpty from './CartEmpty';
import OrderItem from './OrderItem';

const OrderConfirm = () => {
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useStateValue();
  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState([]);
  const [choiceAddress, setChoiceAddress] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      const baseURL =
        (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
        '/api/';
      axios
        .post(baseURL + 'mongoclient/id?collection=cart&id=' + localStorage.getItem('uid'), {})
        .then(
          (response) => {
            localStorage.setItem('cart', JSON.stringify(response.data.data));
            setCart(response.data.data);
          },
          (error) => {
            console.log(error);
            setCart([]);
          }
        );
      setLoading(true);
      axios
        .post(baseURL + 'mongoclient?collection=address', {
          search: {
            uid: localStorage.getItem('uid')
          }
        })
        .then(
          (response) => {
            setLoading(false);
            if (response.data !== undefined && response.data !== null && response.data !== '') {
              setAddress(response.data);
            }
          },
          (error) => {
            console.error('-->', JSON.stringify(error));
            setLoading(false);
            setAddress([]);
          }
        );
    } else {
      navigate('/login');
    }
  }, []);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const sendEmail = (email, username, orderId) => {
    const mailbody =
      '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8">   <meta name="viewport" content="width=device-width, initial-scale=1">   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>  </head> <body>' +
      ' <h4 class="text-center">Hi ' +
      username +
      ',</h4><br/> <p class="text-center">Thank you!,<br/> Your order id - ' +
      orderId +
      ' is successful put with us!</p><br/> <br/><span class="badge badge-primary">Order Items</span> <br/><br/>' +
      // document.getElementById("ProductList").innerHTML +
      // '<br/> <span class="badge badge-primary">Total Price</span> <br/>' +
      // document.getElementById("TotalPrice").innerHTML +
      // '<span class="badge badge-primary">Delivery Address</span> <br/>' +
      // document.getElementById("AddressSelect").innerHTML +
      // "<br/>" +
      // document.getElementById("Footer").innerHTML +
      '</body> </html>';
    const mailObj = {
      to: email,
      subject: 'Ecom Order - ' + orderId,
      html: mailbody
    };
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
      '/api/email/send';
    console.log(mailObj);
    axios.post(baseURL, mailObj);
  };

  async function displayRazorpay() {
    const delAddr = address.find((element) => {
      return element.addrid === choiceAddress;
    });

    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
      '/api/razorpay/';

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await axios.post(baseURL + 'payment/orders', {
      amount: getBasketTotal(basket)
    });

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    ReactGA.event({
      category: 'Payment initiated',
      action: JSON.stringify(result.data.order)
    });
    ReactGA.plugin.execute('ecommerce', 'addTransaction', result.data.order);

    const { amount, id: order_id, currency, receipt } = result.data.order;
    const razorpayPaymentKey = result.data.razorpayPaymentKey;
    const serverdate = result.data.serverdate;

    const options = {
      key: razorpayPaymentKey, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency,
      name: 'Pritam Ecom',
      description: 'Pay-' + serverdate,
      image: { logo },
      order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          receipt,
          amount: amount.toString(),
          currency,
          serverdate,
          userdate: new Date().toISOString(),
          uid: localStorage.getItem('uid'),
          name: delAddr.firstName + ' ' + delAddr.lastName,
          email: localStorage.getItem('email'),
          contact: delAddr.mobileno,
          address: delAddr,
          product: cart
        };

        const result = await axios.post(baseURL + 'payment/success', data);

        if (result.data.msg === 'success') {
          setCart([]);
          dispatch({
            type: 'EMPTY_BASKET'
          });
          toast('🚀 Your order ' + result.data.orderId + ' is successful put with us!', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          sendEmail(
            localStorage.getItem('email'),
            delAddr.firstName + ' ' + delAddr.lastName,
            result.data.orderId
          );
          const item = {
            id: result.data.orderId,
            revenue: amount.toString()
          };
          ReactGA.event({
            category: 'Payment Done',
            action: JSON.stringify(item)
          });
          ReactGA.plugin.execute('ec', 'setAction', 'purchase', item);
          ReactGA.plugin.execute('ecommerce', 'send');
          ReactGA.plugin.execute('ecommerce', 'clear');
          navigate('/orders/' + result.data.orderId);
          alert('🚀 Your order ' + result.data.orderId + ' is successful put with us!');
        } else {
          alert(result.data.msg);
        }
      },
      prefill: {
        name: delAddr.firstName + ' ' + delAddr.lastName,
        email: localStorage.getItem('email'),
        contact: delAddr.mobileno
      },
      notes: {
        order_id,
        receipt,
        uid: localStorage.getItem('uid')
      },
      theme: {
        color: '#61dafb'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  async function selectAddress(item) {
    setChoiceAddress(item.addrid);
  }

  function showAddress() {
    return (
      <div>
        {address.length !== 0 ? (
          <Badge className="badge bg-success">Select a delivery address</Badge>
        ) : null}
        {address?.map((item, i) => (
          <Card
            className="CardAddress"
            key={i}
            style={{
              background: choiceAddress === item.addrid ? '#8bf1de' : 'none'
            }}
            onClick={() => selectAddress(item)}>
            <div className="row">
              <div id={choiceAddress === item.addrid ? 'AddressSelect' : i} className="col-sm-11">
                <h5 className="AddrLineText">{item.firstName + ' ' + item.lastName}</h5>
                <p className="AddrLineText">
                  <b>Mobile No : </b>
                  {item.mobileno}
                </p>
                <p className="AddrLineText">{item.atype !== undefined ? item.atype : null}</p>
                <p className="AddrLineText">{item.address}</p>
                <p className="AddrLineText">{item.landmark !== undefined ? item.landmark : null}</p>
                <p className="AddrLineText">{item.area}</p>
                <p className="AddrLineText">{item.city + ' - ' + item.pincode}</p>
                <p className="AddrLineText">{item.state + ', ' + item.country}</p>
              </div>
              <div className="col-sm-1">
                <input
                  type="radio"
                  id={i}
                  name="select"
                  onChange={() => selectAddress(item)}
                  checked={choiceAddress === item.addrid}></input>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Badge variant="primary">Order Review</Badge>
      {isLoading ? (
        showLoading()
      ) : (
        <>
          {basket === null || basket === undefined || basket.length === 0 ? (
            <>
              <Card className="Card" key="empty">
                <br />
                <h5 style={{ textAlign: 'center' }}>
                  We are looking forward to receive your order.
                </h5>
                <br />
              </Card>
              <CartEmpty />
            </>
          ) : (
            <>
              <div id="ProductList">
                {basket?.map((item) => (
                  <OrderItem value={item} key={item._id} />
                ))}
              </div>
              {showAddress()}
              <Card className="Card" style={{ padding: '10px' }}>
                <Row style={{ margin: '0px' }}>
                  <Col id="TotalItems">
                    <h5 style={{ textAlign: 'center' }}>{basket.length} Items</h5>
                  </Col>
                  <Col id="TotalPrice">
                    <h5 style={{ textAlign: 'center' }}>{getBasketTotal(basket)} ₹ </h5>
                  </Col>
                  <Col>
                    {address.length === 0 ? (
                      <Button
                        style={{
                          width: '100%',
                          background: '#dc3545',
                          border: '#dc3545'
                        }}
                        onClick={() => navigate('/address')}>
                        Add Delivery Address
                      </Button>
                    ) : choiceAddress !== undefined && choiceAddress.length > 2 ? (
                      <Button style={{ width: '100%' }} onClick={displayRazorpay}>
                        Pay with RAZORPAY
                      </Button>
                    ) : (
                      <Button
                        style={{
                          width: '100%',
                          background: '#28a745',
                          border: '#28a745'
                        }}>
                        Select a delivery address
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

const showLoading = () => {
  return (
    <div className="text-center py-3">
      <Spinner animation="border" role="status" variant="primary" />
    </div>
  );
};

export default OrderConfirm;

import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../Reducer";

import axios from "axios";

import { Button, Card, Row, Col } from "react-bootstrap";
import OrderItem from "./OrderItem";
import logo from "./../../image/logo.svg";

const OrderConfirm = (props) => {
  const [{ basket }] = useStateValue();

  const [cart, setCart] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("uid")) {
      var baseURL =
        (process.env.REACT_APP_API_URL !== undefined
          ? process.env.REACT_APP_API_URL
          : "") + "/api/";
      axios
        .post(
          baseURL +
            "mongoclient/id?collection=cart&id=" +
            localStorage.getItem("uid"),
          {}
        )
        .then(
          (response) => {
            localStorage.setItem("cart", JSON.stringify(response.data.cart));
            setCart(response.data.cart);
          },
          (error) => {
            console.log(error);
            setCart([]);
          }
        );
    } else {
      props.history.push("/login");
    }
  }, []);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
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

  async function displayRazorpay() {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/razorpay/";

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(baseURL + "payment/orders", {
      amount: getBasketTotal(basket) //+ "00",
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency, receipt } = result.data;

    const options = {
      key: "rzp_test_piBaUtLnjBNwoK", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Pritam Ecom",
      description: "Pay-" + new Date(),
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(baseURL + "payment/success", data);

        if (result.data.msg === "success") {
          setCart([]);
          localStorage.setItem("cart", JSON.stringify([]));
          props.history.push("/orders");
          alert("Your order " + result.data.orderId + " is successful put with us!");
        } else {
          alert(result.data.msg);
        }
      },
      prefill: {
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        contact: "9999999999",
      },
      notes: {
        order_id: order_id,
        receipt: receipt,
        date: new Date().toISOString(),
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      {basket === null || basket === undefined || basket.length === 0 ? (
        <div className="center">
          <h3>Your cart is Empty!</h3>
          <img src={logo} alt={logo} height="200" className="center"></img>
          <br />
          <Link
            to="/"
            className="btn btn-primary"
            style={{ color: "rgba(0,0,0,.5)" }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {basket?.map((item) => (
            <OrderItem value={item} key={item._id} />
          ))}
          <Card className="Card" style={{ padding: "10px" }}>
            <Row style={{ margin: "0px" }}>
              <Col>
                <h5 style={{ textAlign: "center" }}>{basket.length} Items</h5>
              </Col>
              <Col>
                <h5 style={{ textAlign: "center" }}>
                  {getBasketTotal(basket)} ₹{" "}
                </h5>
              </Col>
              <Col>
                <Button style={{ width: "100%" }} onClick={displayRazorpay}>
                  PAY WITH RAZORPAY
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
};

export default withRouter(OrderConfirm);

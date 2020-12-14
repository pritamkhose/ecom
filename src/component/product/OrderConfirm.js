import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../Reducer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import { Button, Card, Spinner, Badge, Row, Col } from "react-bootstrap";
import OrderItem from "./OrderItem";
import CartEmpty from "./CartEmpty";
import logo from "./../../image/logo.svg";

const OrderConfirm = (props) => {
  const [{ basket }, dispatch] = useStateValue();
  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState([]);
  const [choiceAddress, setChoiceAddress] = useState("");
  const [isLoading, setLoading] = useState(false);

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
            localStorage.setItem("cart", JSON.stringify(response.data.data));
            setCart(response.data.data);
          },
          (error) => {
            console.log(error);
            setCart([]);
          }
        );
      setLoading(true);
      axios
        .post(baseURL + "mongoclient?collection=address", {
          search: {
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          (response) => {
            setLoading(false);
            if (
              response.data !== undefined &&
              response.data !== null &&
              response.data !== ""
            ) {
              setAddress(response.data);
            }
          },
          (error) => {
            setLoading(false);
            setAddress([]);
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
    var delAddr = address.find((element) => {
      return element.addrid === choiceAddress;
    });

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
      amount: getBasketTotal(basket),
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency, receipt } = result.data.order;
    const razorpayPaymentKey = result.data.razorpayPaymentKey;
    const serverdate = result.data.serverdate;

    const options = {
      key: razorpayPaymentKey, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Pritam Ecom",
      description: "Pay-" + serverdate,
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          receipt: receipt,
          amount: amount.toString(),
          currency: currency,
          serverdate,
          userdate: new Date().toISOString(),
          uid: localStorage.getItem("uid"),
          name: delAddr.firstName + " " + delAddr.lastName,
          email: localStorage.getItem("email"),
          contact: delAddr.mobileno,
          address: delAddr,
          product: cart,
        };

        const result = await axios.post(baseURL + "payment/success", data);

        if (result.data.msg === "success") {
          setCart([]);
          dispatch({
            type: "EMPTY_BASKET",
          });
          toast("🚀 Your order " + result.data.orderId + " is successful put with us!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            props.history.push("/orders");
            alert("🚀 Your order " + result.data.orderId + " is successful put with us!");
        } else {
          alert(result.data.msg);
        }
      },
      prefill: {
        name: delAddr.firstName + " " + delAddr.lastName,
        email: localStorage.getItem("email"),
        contact: delAddr.mobileno,
      },
      notes: {
        order_id: order_id,
        receipt: receipt,
        uid: localStorage.getItem("uid"),
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  async function selectAddress(item) {
    setChoiceAddress(item.addrid, () => {
      showAddress();
    });
  }

  function showAddress() {
    return (
      <div>
        {address.length !== 0 ? (
          <Badge variant="success">Select a delivery address</Badge>
        ) : null}
        {address?.map((item, i) => (
          <Card
            className="CardAddress"
            key={i}
            style={{
              background: choiceAddress === item["addrid"] ? "#8bf1de" : "none",
            }}
            onClick={() => selectAddress(item)}
          >
            <h5 className="AddrLineText">
              {item["firstName"] + " " + item["lastName"]}
            </h5>
            <p className="AddrLineText">
              <b>Mobile No : </b>
              {item["mobileno"]}
            </p>
            <p className="AddrLineText">
              {item["atype"] !== undefined ? item["atype"] : null}
            </p>
            <p className="AddrLineText">{item["address"]}</p>
            <p className="AddrLineText">
              {item["landmark"] !== undefined ? item["landmark"] : null}
            </p>
            <p className="AddrLineText">{item["area"]}</p>
            <p className="AddrLineText">
              {item["city"] + " - " + item["pincode"]}
            </p>
            <p className="AddrLineText">
              {item["state"] + ", " + item["country"]}
            </p>
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
                <h5 style={{ textAlign: "center" }}>
                  We are looking forward to receive your order.
                </h5>
                <br />
              </Card>
              <CartEmpty />
            </>
          ) : (
            <>
              {basket?.map((item) => (
                <OrderItem value={item} key={item._id} />
              ))}
              {showAddress()}
              <Card className="Card" style={{ padding: "10px" }}>
                <Row style={{ margin: "0px" }}>
                  <Col>
                    <h5 style={{ textAlign: "center" }}>
                      {basket.length} Items
                    </h5>
                  </Col>
                  <Col>
                    <h5 style={{ textAlign: "center" }}>
                      {getBasketTotal(basket)} ₹{" "}
                    </h5>
                  </Col>
                  <Col>
                    {address.length === 0 ? (
                      <Button
                        style={{
                          width: "100%",
                          background: "#dc3545",
                          border: "#dc3545",
                        }}
                        onClick={() => props.history.push("/address")}
                      >
                        Add Delivery Address
                      </Button>
                    ) : choiceAddress !== undefined &&
                      choiceAddress.length > 2 ? (
                      <Button
                        style={{ width: "100%" }}
                        onClick={displayRazorpay}
                      >
                        Pay with RAZORPAY
                      </Button>
                    ) : (
                      <Button
                        style={{
                          width: "100%",
                          background: "#28a745",
                          border: "#28a745",
                        }}
                      >
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

export default withRouter(OrderConfirm);

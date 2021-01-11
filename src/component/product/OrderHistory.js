import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import "./ProductItem.css";
import { Card, Spinner, Badge, Button } from "reactstrap";
import axios from "axios";

import OrderItem from "./OrderItem";
import CartEmpty from "./CartEmpty";

const OrderHistory = (props) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("uid")) {
      var baseURL =
        (process.env.REACT_APP_API_URL !== undefined
          ? process.env.REACT_APP_API_URL
          : "") + "/api/";
      setLoading(true);
      axios
        .post(baseURL + "mongoclient?collection=orders", {
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
              setOrders(response.data);
            }
          },
          (error) => {
            setLoading(false);
            setOrders([]);
          }
        );
    } else {
      props.history.push("/login");
    }
  }, []);

  return (
    <div>
      <Badge variant="primary">Order History</Badge>
      {isLoading ? (
        showLoading()
      ) : (
        <div className="text-center py-3">
          {orders?.map((item, i) => (
            <Card className="CardAddress" key={i} id={item["orderCreationId"]}>
              <h5 className="AddrLineText">
                {item["orderCreationId"].toUpperCase()}
              </h5>
              <hr />
              <p className="AddrLineText">
                <b>Date : </b>
                {item["serverdate"]}
              </p>
              <p className="AddrLineText">
                <b>Amount : </b>
                {item["amount"].slice(0, -2) + ".00 " + item["currency"]}
              </p>
              <Card className="CardAddress">
                <h5 className="AddrLineText">Order Product</h5>
                <hr />
                {item["product"]?.map((item) => (
                  <OrderItem value={item} key={item._id} />
                ))}
              </Card>
              <Card className="CardAddress">
                <h5 className="AddrLineText">Delivery Address</h5>
                <hr />
                <p className="AddrLineText">
                  <b>
                    {item["address"]["firstName"] +
                      " " +
                      item["address"]["lastName"]}
                  </b>
                </p>
                <p className="AddrLineText">
                  Mobile No :{item["address"]["mobileno"]}
                </p>
                <p className="AddrLineText">
                  {item["address"]["atype"] !== undefined
                    ? item["address"]["atype"]
                    : null}
                </p>
                <p className="AddrLineText">{item["address"]["address"]}</p>
                <p className="AddrLineText">
                  {item["address"]["landmark"] !== undefined
                    ? item["address"]["landmark"]
                    : null}
                </p>
                <p className="AddrLineText">{item["address"]["area"]}</p>
                <p className="AddrLineText">
                  {item["address"]["city"] + " - " + item["address"]["pincode"]}
                </p>
                <p className="AddrLineText">
                  {item["address"]["state"] + ", " + item["address"]["country"]}
                </p>
              </Card>
              <Button
                color="danger"
                type="button"
                onClick={() =>
                  sendPDF(
                    document.querySelector("#" + item["orderCreationId"])
                      .innerHTML
                  )
                }
              >
                PDF
              </Button>
            </Card>
          ))}
          {orders.length === 0 ? (
            <>
              <Card className="Card" key="empty">
                <br />
                <h5>We are looking forward to receive your order.</h5>
                <br />
              </Card>
              <CartEmpty />
            </>
          ) : null}
        </div>
      )}
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

const sendPDF = (htmltxt) => {
  var baseURL =
    (process.env.REACT_APP_API_URL !== undefined
      ? process.env.REACT_APP_API_URL
      : "") + "/api/";

  axios.post(baseURL + "sendPDF", { html: htmltxt }).then(
    (response) => {
      var win = window.open(
        baseURL + "sendPDF/file?file=" + response.data.filename,
        "_blank"
      );
      win.focus();
    },
    (error) => {
      console.log(error);
      alert("Something went Wrong! Try again...");
    }
  );
};

export default withRouter(OrderHistory);

import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import "./ProductItem.css";
import { Card, Spinner, Badge } from "reactstrap";
import axios from "axios";
import OrderItem from "./OrderItem";

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
            setOrders(response.data);
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
            <Card className="CardAddress" key={i}>
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
            </Card>
          ))}
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

const openLink = (props, id) => {
  props.history.push("/address/" + id);
};

export default withRouter(OrderHistory);

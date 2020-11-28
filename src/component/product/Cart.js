import React from "react";
import { Link, withRouter } from "react-router-dom";

import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../Reducer";

import { Button, Card, Row, Col } from "react-bootstrap";
import CartItem from "./CartItem";
import logo from "./../../image/logo.svg";

const Cart = (props) => {
  const [{ basket }] = useStateValue();

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
            <CartItem value={item} key={item._id} />
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
                <Button style={{ width: "100%" }}>Buy Now</Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
};

export default withRouter(Cart);

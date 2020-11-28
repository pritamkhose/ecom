import React from "react";
import { Link, withRouter } from "react-router-dom";

import { useStateValue } from "../../StateProvider";

import { Card, Row, Col, Button } from "react-bootstrap";

const CartItem = (aObj) => {
  const [{ basket }, dispatch] = useStateValue();

  const removeFromBasket = () => {
    // remove the item from the basket
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: aObj.value._id,
    });
  };

  return (
    <Card className="Card">
      <Row>
        <Col className="col-3">
          <Link to={`${"/pid"}/${aObj.value._id}`}>
            <img
              height="220rem"
              alt={aObj.value.product}
              src={aObj.value.searchImage}
            />
          </Link>
        </Col>
        <Col>
          <br />
          <Link
            to={`${"/pid"}/${aObj.value._id}`}
            style={{ color: "rgba(0,0,0,.5)" }}
          >
            <h5>{aObj.value.product}</h5>
          </Link>
          <p style={{ marginBottom: "4px" }}>{aObj.value.brand}</p>
          <p style={{ marginBottom: "4px" }}>
            Rating : <b> {aObj.value.rating}</b> / 5 🌟
          </p>
          <p className="PriceCancel">MRP : ₹ {aObj.value.mrp}</p>
          <p style={{ fontWeight: "bold", padding: "0px" }} className="Price">
            Price : ₹ {aObj.value.price}
          </p>
          <Row>
            <Col>
              <Button
                className="btn-danger"
                onClick={removeFromBasket}
                style={{ padding: "2px", margin: "0px" }}
              >
                Remove
              </Button>
            </Col>
            <Col>
              Qty :{" "}
              <select name="qty" id="qty">
                {Array.apply(1, Array(10)).map(function (x, i) {
                  return (
                    <option value={i + 1} key={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </select>
            </Col>

            <Col>
              <p
                style={{
                  fontWeight: "bold",
                  padding: "0px",
                  textAlign: "end",
                  marginRight: "8px",
                }}
                className="Price"
              >
                ₹ {aObj.value.price}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default withRouter(CartItem);

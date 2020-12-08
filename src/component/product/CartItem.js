import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { useStateValue } from "../../StateProvider";

import { Card, Row, Col, Button } from "react-bootstrap";

const CartItem = (aObj, isEdit) => {
  const [{}, dispatch] = useStateValue();

  var [qty, setQty] = useState(aObj.value.qty);
  const [showItemPrice, setItemPrice] = useState(
    aObj.value.price * aObj.value.qty
  );

  const removeFromBasket = () => {
    // remove the item from the basket
    dispatch({
      type: "REMOVE_FROM_BASKET",
      _id: aObj.value._id,
    });
  };

  const handleChange = (event) => {
    setItemPrice(aObj.value.price * event.target.value);
    setQty(event.target.value);
    var temp = aObj.value;
    temp.qty = Number(event.target.value);
    dispatch({
      type: "UPDATE_FROM_BASKET",
      item: temp,
    });
  };

  return (
    <Card className="Card">
      <Row>
        <Col className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <Link to={`${"/pid"}/${aObj.value._id}`}>
            <img
              height="220rem"
              alt={aObj.value.product}
              src={aObj.value.searchImage}
            />
          </Link>
        </Col>
        <Col>
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
              {isEdit ? (
                <select name="qty" id="qty" onChange={handleChange} value={qty}>
                  {Array.apply(1, Array(10)).map(function (x, i) {
                    return (
                      <option value={i + 1} key={i + 1}>
                        {i + 1}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <b>{qty}</b>
              )}
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
                ₹ {showItemPrice}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default withRouter(CartItem);

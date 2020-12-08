import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { Card, Row, Col } from "react-bootstrap";

const OrderItem = (aObj) => {
  const [showItemPrice] = useState(aObj.value.price * aObj.value.qty);

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
          <p
            style={{ fontWeight: "bold", padding: "0px", marginBottom: "4px" }}
            className="itemPrice"
          >
            ₹ {aObj.value.price}
          </p>
          <p
            style={{ fontWeight: "bold", padding: "0px", marginBottom: "4px" }}
            className="qty"
          >
            Qty : {aObj.value.qty}
          </p>
          <p
            style={{
              fontWeight: "bold",
              padding: "0px",
              textAlign: "end",
              marginRight: "8px",
            }}
            className="Price"
          >
            Price : ₹ {showItemPrice}
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default withRouter(OrderItem);

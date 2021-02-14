import React from "react";

import { useStateValue } from "../../StateProvider";
import cartcount from "../../image/cartcount.svg";

import { Row } from "react-bootstrap";
import "./ProductItem.css";

const CartCount = (props) => {
  const [{ basket }] = useStateValue();

  return (
    <Row style={{margin: "0px"}}>
      <img src={cartcount} alt="Cart" height="35"></img>
      <p
        className="CartText"
        style={{ margin: "0px", padding: "0px", paddingTop: "3px" }}
      >
        {basket.length}
      </p>
    </Row>
  );
};

export default CartCount;

import React from "react";

import { Button } from "react-bootstrap";
import { useStateValue } from "../../StateProvider";

const AddCartBtn = (props) => {
  const [{}, dispatch] = useStateValue();

  const addCart = (obj) => {
    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: obj,
    });
  };

  return (
    <Button
      className="btn btn-primary"
      style={{ width: "-webkit-fill-available" }}
      onClick={() => addCart(props.aObj)}
    >
      Add to Cart
    </Button>
  );
};

export default AddCartBtn;

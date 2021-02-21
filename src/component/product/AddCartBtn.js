import React from "react";

import { Button } from "react-bootstrap";
import { useStateValue } from "../../StateProvider";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga";

const AddCartBtn = (props) => {
  const [{}, dispatch] = useStateValue();

  const addCart = (obj) => {
    var item = {
      id: obj.productId,
      name: obj.product,
      price: obj.price,
      category: obj.brand,
      quantity: obj.qty,
    };
    ReactGA.event({
      category: "Add to Cart",
      action: JSON.stringify(item),
    });
    ReactGA.plugin.execute("ecommerce", "addItem", item);
    ReactGA.plugin.execute("ecommerce", "send");
    ReactGA.plugin.execute("ecommerce", "clear");

    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: obj,
    });
    toast.success("🛒 " + obj.product, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <Button
        className="btn btn-primary"
        style={{ width: "-webkit-fill-available" }}
        onClick={() => addCart(props.aObj)}
      >
        Add to Cart
      </Button>
      <ToastContainer />
    </>
  );
};

export default AddCartBtn;

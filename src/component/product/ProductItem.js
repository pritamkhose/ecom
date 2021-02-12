import React from "react";
import { useStateValue } from "../../StateProvider";

import { Card, Badge, Table, Col } from "react-bootstrap";
import "./ProductItem.css";
import logo from "../../image/logo.svg";
import { withRouter } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_LENGTH = 36;

const ProductItem = (props) => {
  const [{}, dispatch] = useStateValue();

  // const [isLogined] = useState(localStorage.getItem("name") ? true : false);

  const addCart = (obj) => {
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

  function openLink(id) {
    props.history.push("/pid/" + id);
  }

  return (
    <Col>
      <Card className="Card">
        <img
          height="220rem"
          alt={props.value.product}
          src={props.value.searchImage}
          onClick={() => openLink(props.value._id)}
        />
        <Badge className="Overlap" variant="primary">
          {props.value.brand}
        </Badge>
        {props.value.rating === 0 ? null : (
          <Badge className="OverlapRating" variant="success">
            {Number(props.value.rating).toFixed(2)}
          </Badge>
        )}

        <Table style={{ margin: 0, padding: 0 }}>
          <tbody>
            <tr>
              <td
                style={{ margin: 0, padding: 0 }}
                colSpan="3"
                className="Title"
                onClick={() => openLink(props.value._id)}
              >
                {props.value.product.substring(0, MAX_LENGTH)}
              </td>
            </tr>
            <tr>
              <td
                style={{ margin: 0, padding: 0, border: "none" }}
                className="Price"
                onClick={() => openLink(props.value._id)}
              >
                ₹ {props.value.price}
              </td>
              <td
                style={{ margin: 0, padding: 0, border: "none" }}
                className="PriceCancel"
              >
                ₹ {props.value.mrp}
              </td>
              <td style={{ margin: 0, padding: 0, border: "none" }}>
                <img
                  src={logo}
                  alt={logo}
                  height="30"
                  onClick={() => addCart(props.value)}
                ></img>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
};

export default withRouter(ProductItem);

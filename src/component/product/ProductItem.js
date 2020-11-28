import React from "react";
import { useStateValue } from "../../StateProvider";

import { Card, Badge, Table, Col } from "react-bootstrap";
import "./ProductItem.css";
import logo from "../../image/logo.svg";
import { withRouter } from "react-router-dom";

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
            {props.value.rating}
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

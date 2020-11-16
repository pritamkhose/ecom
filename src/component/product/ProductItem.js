import React, { Component } from "react";
import { Card, Badge, Table } from "react-bootstrap";
import "./ProductItem.css";
import logo from "../../image/logo.svg";
import { Link } from "react-router-dom";

export default class ProductItem extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <Link to={"/productDetails/" + this.props.value._id} className="link">
        <Card className="Card">
          <img
            height="220rem"
            alt={this.props.value.product}
            src={this.props.value.searchImage}
          />
          <Badge className="Overlap" variant="primary">
            {this.props.value.brand}
          </Badge>
          {this.props.value.rating === 0 ? null : (
            <Badge className="OverlapRating" variant="success">
              {this.props.value.rating}
            </Badge>
          )}
          <Table style={{ margin: 0, padding: 0 }}>
            <tbody>
              <tr>
                <td
                  style={{ margin: 0, padding: 0 }}
                  colSpan="3"
                  className="Title"
                >
                  {this.props.value.product}
                </td>
              </tr>
              <tr>
                <td
                  style={{ margin: 0, padding: 0, border: "none" }}
                  className="Price"
                >
                  ₹ {this.props.value.price}
                </td>
                <td
                  style={{ margin: 0, padding: 0, border: "none" }}
                  className="PriceCancel"
                >
                  ₹ {this.props.value.mrp}
                </td>
                <td style={{ margin: 0, padding: 0, border: "none" }}>
                  <Link to={"/cart/" + this.props.value._id}>
                    <img src={logo} alt={logo} height="30"></img>
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
        <br />
      </Link>
    );
  }
}

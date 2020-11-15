import React, { Component } from "react";
import { Card, Badge, Table } from "react-bootstrap";
import "./ProductItem.css";
import logo from "../../image/logo.svg";
import { Link } from "react-router-dom";

export default class ProductItem extends Component {
  render() {
    return (
      <Link to={"/productDetails/" + this.props.index} className="link">
        <Card className="Card">
          <img
            height="220rem"
            alt={this.props.value}
            src="https://images.bewakoof.com/original/high-colors-half-sleeve-t-shirt-black-men-s-printed-t-shirts-297481-1604906907.jpg?tr=q-100"
          />
          <Badge className="Overlap" variant="primary">
            New
          </Badge>
          <Badge className="OverlapRating" variant="success">
            {this.props.index} *
          </Badge>
          <Table style={{ margin: 0, padding: 0 }}>
            <tbody>
              <tr>
                <td
                  style={{ margin: 0, padding: 0 }}
                  colSpan="3"
                  className="Title"
                >
                  {this.props.value}
                </td>
              </tr>
              <tr>
                <td
                  style={{ margin: 0, padding: 0, border: "none" }}
                  className="Price"
                >
                  ₹ {this.props.index}00
                </td>
                <td
                  style={{ margin: 0, padding: 0, border: "none" }}
                  className="PriceCancel"
                >
                  ₹ {this.props.index}50
                </td>
                <td style={{ margin: 0, padding: 0, border: "none" }}>
                  <Link to={"/cart/" + this.props.index}>
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

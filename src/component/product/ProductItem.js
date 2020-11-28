import React, { Component } from "react";
import { Card, Badge, Table, Button } from "react-bootstrap";
import "./ProductItem.css";
import logo from "../../image/logo.svg";
import { Link, withRouter } from "react-router-dom";

const MAX_LENGTH = 36;

class ProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      isLogined: localStorage.getItem("name") ? true : false,
    };
  }

  addCart(obj) {
    let cart = [...this.state.cart];
    console.log(cart.length);
    if (cart.length === 0) {
      obj.qty = 1;
      cart.push(obj);
      this.setState({ cart }, () => {
        console.log(this.state.cart);
      });
    } else {
      for (var i = 0; i < cart.length; i++) {
        var obj = cart[i];
        console.log(obj);
        //   if (obj._id === cart._id) {
        //     obj.qty = cart.qty + 1;
        //     cart.slice(i);
        //     cart.push(obj);
        //     this.setState({ cart }, () => {
        //       console.log(this.state.cart);
        //     });
        //   } else {
        //     obj.qty = 1;
        //     cart.push(obj);
        //     this.setState({ cart }, () => {
        //       console.log(this.state.cart);
        //     });
        //   }
      }
    }
  }

  openLink(id) {
    this.props.history.push("/pid/" + id);
  }

  render() {
    return (
      <Card className="Card">
        <img
          height="220rem"
          alt={this.props.value.product}
          src={this.props.value.searchImage}
          onClick={() => this.openLink(this.props.value._id)}
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
                onClick={() => this.openLink(this.props.value._id)}
              >
                {this.props.value.product.substring(0, MAX_LENGTH)}
              </td>
            </tr>
            <tr>
              <td
                style={{ margin: 0, padding: 0, border: "none" }}
                className="Price"
                onClick={() => this.openLink(this.props.value._id)}
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
                <img
                  src={logo}
                  alt={logo}
                  height="30"
                  onClick={() => this.addCart(this.props.value)}
                ></img>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    );
  }
}

export default withRouter(ProductItem);

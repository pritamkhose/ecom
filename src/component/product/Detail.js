import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  Col,
  Row,
  Spinner,
  Badge,
  Carousel
} from "react-bootstrap";
import "./ProductItem.css";
import axios from "axios";
import AddCartBtn from "./AddCartBtn";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      aObj: {},
      isEdit: props.match.params.id ? true : false,
      isLogined: localStorage.getItem("name") ? true : false,
    };
    this.getData(props.match.params.id);
  }

  getData(id) {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";
    axios
      .post(baseURL + "mongoclient/id?collection=productmyntra&id=" + id, {})
      .then(
        (response) => {
          this.setState({ aObj: response.data });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    return (
      <div>
        <Badge variant="primary">
          Product {this.state.isEdit ? "Deails" : "Add"}
        </Badge>
        {Object.keys(this.state.aObj).length === 0
          ? this.showLoading()
          : this.showData(this.state.aObj)}
      </div>
    );
  }

  showLoading() {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  isMobile() {
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match() remember str.test is case sensitive
    var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    // console.log(navigator.userAgent.toLowerCase());
    // console.log(isMobile);
    return isMobile;
  }

  showData(aObj) {
    return (
      <>
        {this.isMobile() ? (
          <>
            <h3>{aObj.product}</h3>
            <hr />
            <p>{aObj.additionalInfo}</p>
            <table className="table table-stripe">
              <tbody>
                <tr key="price">
                  <td className="Price">
                    <b>Price : {aObj.price} ₹</b>
                  </td>
                  <td className="PriceCancel">MRP : {aObj.mrp} ₹</td>
                  <td>
                    {aObj.discount} ₹ / <b>{aObj.discountDisplayLabel}</b>
                  </td>
                </tr>
                <tr key="images">
                  <td colSpan="3">{this.showImages(aObj.images)}</td>
                </tr>
                <tr key="cart">
                  <td colSpan="3">
                    <AddCartBtn aObj={aObj} />
                  </td>
                </tr>
                <tr key="rating">
                  <td>Rating</td>
                  <td>
                    <b> {aObj.rating}</b> / 5 🌟
                  </td>
                  <td>Total Rating: {aObj.ratingCount}</td>
                </tr>
                <tr key="brand">
                  <td>Brand</td>
                  <td colSpan="2">{aObj.brand}</td>
                </tr>
                <tr key="style">
                  <td>Style</td>
                  <td colSpan="2">
                    {aObj.gender} - {aObj.category}
                  </td>
                </tr>
                <tr key="primaryColour">
                  <td>Color</td>
                  <td colSpan="2">{aObj.primaryColour}</td>
                </tr>
                <tr key="season">
                  <td>Season</td>
                  <td colSpan="2">{aObj.season}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3>{aObj.product}</h3>
            <hr />
            <p>{aObj.additionalInfo}</p>
            <hr />
            <Row>
              <Col>{this.showImages(aObj.images)}</Col>
              <Col>
                <table className="table table-stripe">
                  <tbody>
                    <tr key="price">
                      <td className="Price" style={{ borderTop: "0px" }}>
                        <b>Price : {aObj.price} ₹</b>
                      </td>
                      <td className="PriceCancel" style={{ borderTop: "0px" }}>
                        MRP : {aObj.mrp} ₹
                      </td>
                      <td style={{ borderTop: "0px" }}>
                        {aObj.discount} ₹ / <b>{aObj.discountDisplayLabel}</b>
                      </td>
                    </tr>
                    <tr key="cart">
                      <td colSpan="3">
                        <AddCartBtn aObj={aObj} />
                      </td>
                    </tr>
                    <tr key="rating">
                      <td>Rating</td>
                      <td>
                        <b> {aObj.rating}</b> / 5 🌟
                      </td>
                      <td>Total Rating: {aObj.ratingCount}</td>
                    </tr>
                    <tr key="brand">
                      <td>Brand</td>
                      <td colSpan="2">{aObj.brand}</td>
                    </tr>
                    <tr key="style">
                      <td>Style</td>
                      <td colSpan="2">
                        {aObj.gender} - {aObj.category}
                      </td>
                    </tr>
                    <tr key="primaryColour">
                      <td>Color</td>
                      <td colSpan="2">{aObj.primaryColour}</td>
                    </tr>
                    <tr key="season">
                      <td>Season</td>
                      <td colSpan="2">{aObj.season}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }

  showImages(arr) {
    return (
      <Container>
        <Carousel>
          {arr.map(function (x, i) {
            return x.src != null && x.src.length > 0 ? (
              <Carousel.Item key={i} interval={2000}>
                <img
                  height="450rem"
                  className="d-block w-100"
                  alt={x.view}
                  src={x.src}
                />
                <Carousel.Caption>
                  <h3>{x.view}</h3>
                  <p>
                    {i + 1} / {arr.length}
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            ) : null;
          })}
        </Carousel>
      </Container>
    );
  }
}

export default withRouter(Details);

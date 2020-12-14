import React, { Component } from "react";
import ProductItem from "./ProductItem";
import { Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";

export default class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aList: [],
    };

    this.getData();
  }

  getData() {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";
    axios
      .post(baseURL + "mongoclient?collection=productmyntra", {
        projection: {
          productId: 1,
          product: 1,
          searchImage: 1,
          brand: 1,
          rating: 1,
          price: 1,
          mrp: 1,
        },
      })
      .then(
        (response) => {
          this.setState({ aList: response.data });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    const items = [];
    for (const [index, value] of Object.entries(this.state.aList)) {
      items.push(<ProductItem key={index} index={index} value={value} />);
    }

    return (
      <>
        {this.state.aList.length === 0 ? (
          this.showLoading()
        ) : (
          <Row xs="2" sm="2" md="4" lg="6" xl="8" style={{ margin: "0px" }}>
            {items}
          </Row>
        )}
        <ToastContainer />
      </>
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
}

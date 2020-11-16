import React, { Component } from "react";
import Product from "./ProductItem";
import { Container, Row } from "react-bootstrap";
import axios from "axios";

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
    axios.post(baseURL + "mongoclient?collection=productmyntra", {}).then(
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
      items.push(
        <Product key={index} index={index} value={value}>
          {value}
        </Product>
      );
    }

    return (
      <Container>
        <Row xs="2" sm="2" md="4" lg="6" xl="8">
          {items}
        </Row>
      </Container>
    );
  }
}

import React, { Component } from "react";
import Product from "./ProductItem";
import { Container, Row } from "react-bootstrap";

export default class List extends Component {
  render() {
    const elements = [
      "one",
      "two",
      "three",
      "one",
      "two",
      "three",
      "one",
      "two",
      "three",
    ];

    const items = [];
    for (const [index, value] of elements.entries()) {
      items.push(<Product key={index} index={index} value={value}>{value}</Product>);
    }

    return (
      <Container>
        <Row xs="2" sm="2" md="4" lg="6" xl="8" >
          {items}
        </Row>
      </Container>
    );
  }
}

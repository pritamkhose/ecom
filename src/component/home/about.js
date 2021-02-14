import React, { Component } from "react";
import { Tab, Row, Nav, Col } from "react-bootstrap";

export default class About extends Component {
  render() {
    return (
      <>
        <Tab.Container id="left-tabs-example" defaultActiveKey="about">
          <Row style={{ margin: "0px" }}>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="about">About Us</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="social">Social Media</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="shipping">Shipping</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contact">Contact Us</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="about">
                  <p>About</p>
                </Tab.Pane>
                <Tab.Pane eventKey="social">
                  <ol>
                    <li>Facebook</li>
                    <li>Twitter</li>
                    <li>YouTube</li>
                  </ol>
                </Tab.Pane>
                <Tab.Pane eventKey="shipping">
                  <p>Shipping</p>
                </Tab.Pane>
                <Tab.Pane eventKey="contact">
                  <p>Contact</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </>
    );
  }
}

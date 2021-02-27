import React, { Component } from "react";
import { Tab, Row, Nav, Col, Card, Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import facebook from "./../../image/facebook.svg";
import instagram from "./../../image/instagram.svg";
import twitter from "./../../image/twitter.svg";
import youtube from "./../../image/youtube.svg";

class About extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.REACT_APP_GOOGLE_MAP +
      "&callback=myMap";
    script.async = true;
    document.body.appendChild(script);

    const scriptFunction = document.createElement("script");
    scriptFunction.type = "text/javascript";
    scriptFunction.async = true;
    scriptFunction.innerHTML = `function myMap() {
      var mapCanvas = document.getElementById("map");
      var mapOptions = {
        center: new google.maps.LatLng(18.5560644,73.8629752), zoom: 12
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);
    }`;
    document.body.appendChild(scriptFunction);
  }

  openLink(url) {
    window.open(url, "_blank");
  }

  render() {
    return (
      <>
        <Tab.Container id="left-tabs-example" defaultActiveKey="about">
          <Row style={{ margin: "0px" }}>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="about">About us</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="faq">FAQ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="social">Social Media</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contact">Contact Us</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="about">
                  <h3>About us</h3>
                  <hr />
                  <p>
                    Welcome to Ecom, your number one source for lot of things.
                    We're dedicated to giving you the very best of product, with
                    a focus on dependability, customer service and uniqueness.
                    Founded in 2020 by Pritam, Ecom has come a long way from its
                    beginnings in a Pune. <br />
                    <br /> When Ecom Team first started out, our passion for
                    eco-friendly, providing the best equipment for users drove
                    him to do intense research, and gave him the impetus to turn
                    hard work and inspiration into to a booming online store.{" "}
                    <br />
                    <br /> We now serve customers all over India, and are
                    thrilled to be a part of the quirky, eco-friendly wing of
                    the fashion, goods, watches. We hope you enjoy our products
                    as much as we enjoy offering them to you. If you have any
                    questions or comments, please don't hesitate to contact us.
                  </p>
                  <p>Sincerely,</p>
                  <p>
                    <i>Ecom Team</i>
                  </p>
                </Tab.Pane>
                <Tab.Pane eventKey="social">
                  <h3>Social Media</h3>
                  <hr />
                  <Container>
                    <Row xs="2" sm="2" md="2" lg="4" xl="4">
                      <Col>
                        <Card
                          onClick={() =>
                            this.openLink("https://www.facebook.com/")
                          }
                        >
                          <img height="150rem" src={facebook} alt={facebook} />
                          <h3 className="text-center"> Facebook</h3>
                        </Card>
                      </Col>
                      <Col>
                        <Card
                          onClick={() =>
                            this.openLink("https://www.facebook.com/")
                          }
                        >
                          <img
                            height="150rem"
                            src={instagram}
                            alt={instagram}
                          />
                          <h3 className="text-center">Instagram</h3>
                        </Card>
                      </Col>
                      <Col>
                        <Card
                          onClick={() =>
                            this.openLink("https://www.twitter.com/")
                          }
                        >
                          <img height="150rem" src={twitter} alt={twitter} />
                          <h3 className="text-center"> Twitter</h3>
                        </Card>
                      </Col>
                      <Col>
                        <Card
                          onClick={() =>
                            this.openLink("https://www.youtube.com/")
                          }
                        >
                          <img height="150rem" src={youtube} alt={youtube} />
                          <h3 className="text-center">YouTube</h3>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="faq">
                  <h3>FAQ (Frequently Asked Questions)</h3>
                  <hr />
                  <h5>Is it necessary to have an account to shop on Ecom?</h5>
                  <p>
                    Yes, it's necessary to log into your Ecom account to shop.
                    Shopping as a logged-in user is fast & convenient and also
                    provides extra security. <br />
                    You'll have access to a personalised shopping experience
                    including recommendations and quicker check-out.
                  </p>
                  <hr />
                  <h5>Do we ship internationally?</h5>
                  <p>Currently, wet only ship within India.</p>
                  <hr />
                  <h5> Are there any hidden charges when I shop on Ecom?</h5>
                  <p>
                    There are NO hidden charges when you shop. The price you see
                    on the product page is final and it's exactly what you pay.
                    <br />
                    Note: There can be additional delivery charges based on the
                    delivery's policy.
                  </p>
                  <hr />
                </Tab.Pane>
                <Tab.Pane eventKey="contact">
                  <h3>Contact Us</h3>
                  <hr />
                  <h5>Pritam Ecom</h5>
                  <p>Pune, 411001</p>
                  <p>Maharashtra, India</p>
                  <p>Telephone: 1800 XXX XXXX</p>
                  <hr />
                  <div
                    id="map"
                    style={{ width: "100%", height: "300px" }}
                  ></div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <br />
      </>
    );
  }
}

export default withRouter(About);

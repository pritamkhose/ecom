import React, { Component } from "react";
import { Badge, Card, Row, Container, Carousel } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataObj: {},
      showLoadMore: true,
    };
    this.getData();
  }

  getData() {
    axios.get("https://node-pritam.firebaseio.com/ecom/hompage.json").then(
      (response) => {
        this.setState({
          dataObj: response.data,
          showLoadMore: false,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    return (
      <div>
        {this.state.showLoadMore ? null : (
          <>
            {this.state.dataObj.banner !== undefined ? (
              <Container style={{ width: "100%" }}>
                <Row style={{ margin: "0px" }}>
                  <Carousel name="banner">
                    {this.state.dataObj.banner.map((val) =>
                      this.showCarousel(
                        val,
                        this.state.dataObj.bannerURL,
                        "220rem",
                        3000,
                        1
                      )
                    )}
                  </Carousel>
                </Row>
              </Container>
            ) : null}
            {this.state.dataObj.category !== undefined ? (
              <>
                <Badge variant="danger">Category</Badge>
                <Row
                  xs="2"
                  sm="2"
                  md="4"
                  lg="6"
                  xl="8"
                  style={{ margin: "0px" }}
                >
                  {this.state.dataObj.category.map((val) =>
                    val !== null && val.enable
                      ? this.getCategory(val, this.state.dataObj.categoryURL)
                      : null
                  )}
                </Row>
              </>
            ) : null}
            {this.state.dataObj.offers !== undefined ? (
              <Container style={{ width: "100%" }}>
                <Row style={{ margin: "0px" }}>
                  <Carousel name="offers">
                    {this.state.dataObj.offers.map((val) =>
                      this.showCarousel(
                        val,
                        this.state.dataObj.offersURL,
                        "80rem",
                        2000,
                        0
                      )
                    )}
                  </Carousel>
                </Row>
              </Container>
            ) : null}
            {this.state.dataObj.brand !== undefined ? (
              <>
                <Badge variant="danger">Brand</Badge>
                <Row
                  xs="2"
                  sm="2"
                  md="4"
                  lg="6"
                  xl="8"
                  style={{ margin: "0px" }}
                >
                  {this.state.dataObj.brand.map((val) =>
                    val != null ? this.getBrand(val) : null
                  )}
                </Row>
              </>
            ) : null}
          </>
        )}
      </div>
    );
  }

  showCarousel(val, url, height, interval, control) {
    return (
      <Carousel.Item
        key={val}
        interval={interval}
        indicators={control === 1 ? 1 : 0}
        controls={control ? 1 : 0}
      >
        <img
          width="100%"
          height={height}
          alt={val}
          src={url + val + "?alt=media"}
        />
      </Carousel.Item>
    );
  }

  getCategory(val, url) {
    return (
      <Link key={val.name} to={"/products?category=" + val.name}>
        <Card className="Card">
          <img
            height="220rem"
            alt={val.name}
            src={url + val.image + "?alt=media"}
          />
          <p style={{ textAlign: "center", margin: "0px" }}>
            <b>{val.name}</b>
          </p>
        </Card>
      </Link>
    );
  }

  getBrand(val) {
    return (
      <Link key={val} to={"/products?brand=" + val}>
        <Card className="Card">
          <p style={{ textAlign: "center", margin: "4px" }}>
            <b>{val}</b>
          </p>
        </Card>
      </Link>
    );
  }
}

export default withRouter(Home);

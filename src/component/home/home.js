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
            {this.state.dataObj.banner !== null ? (
              <Container style={{ width: "100%" }}>
                <Row style={{ margin: "0px" }}>
                  <Carousel>
                    {this.state.dataObj.banner.map((val) =>
                      this.getBanner(val, this.state.dataObj.bannerURL)
                    )}
                  </Carousel>
                </Row>
              </Container>
            ) : null}
            {this.state.dataObj.category !== null ? (
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
                    this.getCategory(val, this.state.dataObj.categoryURL)
                  )}
                </Row>
              </>
            ) : null}
            {this.state.dataObj.brand !== null ? (
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
                  {this.state.dataObj.brand.map((val) => this.getBrand(val))}
                </Row>
              </>
            ) : null}
          </>
        )}
      </div>
    );
  }

  getBanner(val, url) {
    return (
      <Carousel.Item key={val} interval={3000}>
        <img
          width="100%"
          height="250rem"
          alt={val}
          src={url + val + "?alt=media"}
        />
      </Carousel.Item>
    );
  }

  getCategory(val, url) {
    return (
      <Link key={val} to={"/products?category=" + val}>
        <Card className="Card">
          <img height="220rem" alt={val} src={url + val + ".webp?alt=media"} />
          <p style={{ textAlign: "center", margin: "0px" }}>
            <b>{val}</b>
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

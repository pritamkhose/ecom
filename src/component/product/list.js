import React, { Component } from "react";
import ProductItem from "./ProductItem";
import { Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";

export default class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curPage: 1,
      prevY: 0,
      aList: [],
      showLoadMore: true,
    };
  }

  componentDidMount() {
    this.getData();
    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      this.getData();
    }
    this.setState({ prevY: y });
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
        sort: {
          _id: 1,
          // price : -1
        },
        limit: 12,
        skip: 12 * (this.state.curPage - 1),
      })
      .then(
        (response) => {
          if (response.status === 200) {
            if (this.state.curPage === 1) {
              this.setState({
                aList: response.data,
                curPage: this.state.curPage + 1,
              });
            } else {
              this.setState(
                {
                  aList: [...this.state.aList, ...response.data],
                  curPage: this.state.curPage + 1,
                },
                () => {
                  // console.log(this.state.aList);
                }
              );
            }
          } else if (response.status === 204) {
            this.setState({
              showLoadMore: false,
            });
          }
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
        {this.state.aList.length === 0 ? null : (
          <Row xs="2" sm="2" md="4" lg="6" xl="8" style={{ margin: "0px" }}>
            {items}
          </Row>
        )}
        <div ref={(loadingRef) => (this.loadingRef = loadingRef)}>
          {this.state.showLoadMore ? this.showLoading() : null}
        </div>
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

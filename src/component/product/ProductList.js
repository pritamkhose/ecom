import React, { Component } from "react";
import ProductItem from "./ProductItem";
import { Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";

class ProductList extends Component {
  constructor(props) {
    super(props);

    const query = new URLSearchParams(this.props.location.search);
    this.state = {
      curPage: 1,
      prevY: 0,
      aList: [],
      showLoadMore: true,
      brand: query.get("brand"),
      category: query.get("category"),
      sort: query.get("sort"),
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

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const query = new URLSearchParams(this.props.location.search);
      this.setState(
        {
          curPage: 1,
          prevY: 0,
          aList: [],
          showLoadMore: true,
          showNoContent: false,
          brand: query.get("brand"),
          category: query.get("category"),
          sort: query.get("sort"),
        },
        () => {
          this.getData();
        }
      );
    }
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

    var searchObj = {};
    if (this.state.brand !== null && this.state.category !== null) {
      searchObj = {
        brand: this.state.brand,
        category: this.state.category,
      };
    } else if (this.state.brand !== null) {
      searchObj = { brand: this.state.brand };
    } else if (this.state.category !== null) {
      searchObj = { category: this.state.category };
    }

    var sortObj = {};
    switch (this.state.sort) {
      case "price":
        sortObj = { price: 1 };
        break;
      case "pricedesc":
        sortObj = { price: -1 };
        break;
      case "rating":
        sortObj = { rating: 1 };
        break;
      case "ratingdesc":
        sortObj = { rating: -1 };
        break;
      case "name":
        sortObj = { product: 1 };
        break;
      case "namedesc":
        sortObj = { product: -1 };
        break;
      default:
        // sortObj = { _id: 1 };
        sortObj = { rating: -1 };
        break;
    }

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
        search: searchObj,
        sort: sortObj,
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
              showNoContent: this.state.curPage === 1 ? true : false,
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
          {this.state.showNoContent ? (
            <h2 style={{ textAlign: "center", paddingTop: "150px" }}>No Result Found!</h2>
          ) : null}
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

export default withRouter(ProductList);

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class ProductFilters extends Component {
  constructor(props) {
    super(props);
    const query = new URLSearchParams(this.props.location.search);
    this.state = {
      brand: query.get("brand"),
      category: query.get("category"),
      sort: query.get("sort"),
      brandList: JSON.parse(localStorage.getItem("brandList")),
      categoryList: JSON.parse(localStorage.getItem("categoryList")),
    };
    this.handleChange = this.handleChange.bind(this);
    if (this.state.brandList == null) {
      this.getData("brand");
    }
    if (this.state.categoryList == null) {
      this.getData("category");
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.redirectURL();
    });
  }

  redirectURL() {
    var url = window.location.pathname + "?";
    if (this.state.category !== null && this.state.category !== "") {
      url = url + "&category=" + this.state.category;
    }
    if (this.state.brand !== null && this.state.brand !== "") {
      url = url + "&brand=" + this.state.brand;
    }
    if (this.state.sort !== null && this.state.sort !== "") {
      url = url + "&sort=" + this.state.sort;
    }
    this.props.history.push(url);
  }

  getData(type) {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";
    axios
      .post(
        baseURL + "mongoclient/distinct?collection=productmyntra&id=" + type,
        {}
      )
      .then(
        (response) => {
          if (type === "brand") {
            localStorage.setItem("brandList", JSON.stringify(response.data));
            this.setState({ brandList: response.data });
          } else if (type === "category") {
            localStorage.setItem("categoryList", JSON.stringify(response.data));
            this.setState({ categoryList: response.data });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    return (
      <div className="container" style={{ paddingBottom: "8px" }}>
        <div className="row">
          <div name="sort" className="col-4">
            <label>Sort :</label>
            <select
              className="custom-select"
              name="sort"
              id="sort"
              value={this.state.sort !== null ? this.state.sort : ""}
              onChange={this.handleChange}
            >
              <option value="">All</option>
              <option value="price">Price ↑</option>
              <option value="pricedesc">Price ↓</option>
              <option value="rating">Rating ↑</option>
              <option value="ratingdesc">Rating ↓</option>
              <option value="name">Name ↑</option>
              <option value="namedesc">Name ↓</option>
            </select>
          </div>
          {this.state.brandList !== null ? (
            <div name="brand" className="col-4">
              <label>Brand :</label>
              <select
                className="custom-select"
                name="brand"
                id="brand"
                defaultValue={this.state.brand !== null ? this.state.brand : ""}
                onChange={this.handleChange}
              >
                <option key="NA" value="">
                  All
                </option>
                {this.state.brandList.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {this.state.categoryList !== null ? (
            <div name="category" className="col-4">
              <label>Category :</label>
              <select
                className="custom-select"
                name="category"
                id="category"
                defaultValue={this.state.category}
                onChange={this.handleChange}
              >
                <option key="NA" value="">
                  All
                </option>
                {this.state.categoryList.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(ProductFilters);

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Spinner, Badge } from "reactstrap";
import axios from "axios";
// import OrderItem from "./OrderItem";

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aObj: {},
      isLogined: localStorage.getItem("uid") ? true : false,
    };
    if (localStorage.getItem("uid")) {
      this.getData(localStorage.getItem("uid"));
    } else {
      this.props.history.push("/login");
    }
  }

  getData(id) {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";
    axios.post(baseURL + "mongoclient/id?collection=orders&id=" + id, {}).then(
      (response) => {
        this.setState({ aObj: response.data });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    return (
      <div>
        <Badge variant="primary">Orders</Badge>
        {this.state.aObj === undefined
          ? this.showLoading()
          : this.showData(this.state.aObj)}
      </div>
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

  isMobile() {
    var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    return isMobile;
  }

  showData(data) {
    <p>{data}</p>;
  }
}

export default withRouter(OrderHistory);

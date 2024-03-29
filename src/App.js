import React, { Component } from "react";
import logo from "./image/logo.svg";
import icsearch from "./image/search.svg";
import { Navbar, Nav, Badge, Modal } from "react-bootstrap";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import Home from "./component/home/home";
import About from "./component/home/about";
import NotFound from "./component/home/notfound";
import Login from "./component/home/login";

import PostHome from "./component/post/PostHome";
import CustomersHome from "./component/customers/Home";
import CustomersEdit from "./component/customers/Edit";

import ProductSearch from "./component/product/ProductSearch";
import ProductList from "./component/product/ProductList";
import ProductFilters from "./component/product/ProductFilters";
import ProductDetails from "./component/product/Detail";
import ProductEdit from "./component/product/ProductEdit";
import Cart from "./component/product/Cart";
import CartCount from "./component/product/CartCount";
import Address from "./component/product/Address";
import AddressEdit from "./component/product/AddressEdit";
import OrderHistory from "./component/product/OrderHistory";
import OrderConfirm from "./component/product/OrderConfirm";
import AnalyticsManager from "./component/analytics/AnalyticsManager";

import LogRocket from 'logrocket';
import ReactGA from "react-ga";
// Initialize google analytics page view tracking
ReactGA.initialize(process.env.REACT_APP_GOOGLE_MEASUREMENT_ID);
LogRocket.init('clsfru/ecom');

class App extends Component {
  state = {
    navExpanded: false,
    minHight: window.innerHeight - 160 + "px",
    minHightFilter: window.innerHeight - 260 + "px",
    isLogin: localStorage.getItem("name") ? true : false,
    name: localStorage.getItem("name"),
    imageUrl: localStorage.getItem("imageUrl"),
    show: false,
  };

  constructor(props) {
    super(props);
    // Bind the this context to the handler function
    this.updateLogin = this.updateLogin.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {
    this.setState((state) => ({
      show: !state.show,
      navExpanded: false,
    }));
  }

  updateLogin = () => {
    this.setState({
      isLogin: localStorage.getItem("name") ? true : false,
      name: localStorage.getItem("name"),
      imageUrl: localStorage.getItem("imageUrl"),
    });
  };

  setNavExpanded = (expanded) => {
    this.setState({ navExpanded: expanded });
  };

  setNavClose = () => {
    this.setState({ navExpanded: false });
  };

  render() {
    return (
      <Router>
        <Navbar
          bg="light"
          variant="light"
          expand="lg"
          fixed="top"
          style={{ position: "sticky", top: 0, zIndex: 1 }}
          onToggle={this.setNavExpanded}
          expanded={this.state.navExpanded}
        >
          <span style={{ margin: "0px", width: "100%", display: "contents" }}>
            <Navbar.Brand>
              <Link
                to={"/"}
                onClick={this.setNavClose}
                className="navbar-brand"
              >
                <img src={logo} alt={logo} height="30"></img> Pritam Ecom
              </Link>
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav onClick={this.setNavClose}>
                <li className="nav-item active">
                  <Link to={"/"} className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link to={"/products"} className="nav-link">
                    Products
                  </Link>
                </li>
                {this.state.isLogin ? (
                  <li className="nav-item active">
                    <Link to={"/orders"} className="nav-link">
                      Orders
                    </Link>
                  </li>
                ) : null}
                <li className="nav-item active">
                  <Link to={"/about"} className="nav-link">
                    About
                  </Link>
                </li>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav onClick={this.setNavClose} className="ml-auto">
                {this.state.isLogin ? (
                  <li className="nav-item active">
                    <Link
                      to={"/profile"}
                      onClick={this.setNavClose}
                      className="nav-link"
                      style={{ float: "end", color: "rgba(0,0,0,.5)" }}
                    >
                      <img src={this.state.imageUrl} alt="" height="30"></img>
                      {" " + this.state.name}
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item active">
                    <Link
                      to={"/login"}
                      onClick={this.setNavClose}
                      className="nav-link"
                      style={{ float: "end" }}
                    >
                      <i className="fa fa-sign-in" aria-hidden="true">
                        {" "}
                        Login
                      </i>
                    </Link>
                  </li>
                )}
              </Nav>
            </Navbar.Collapse>
            <div className="navbar-link" onClick={this.setNavClose}>
              <img
                onClick={this.handleSearch}
                src={icsearch}
                alt="Search"
                height="35"
              ></img>
            </div>
            <div className="navbar-link">
              <Link
                to={"/cart"}
                onClick={this.setNavClose}
                style={{ float: "end", color: "rgba(0,0,0,.5)" }}
              >
                <CartCount />
              </Link>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </span>
        </Navbar>
        <div>
          <Switch>
            <Route exact path="/">
              <div style={{ minHeight: this.state.minHight }}>
                <Home />
                <Badge variant="primary">Products</Badge>
                <ProductList />
              </div>
            </Route>
            <Route path="/products">
              <div style={{ background: "#e5faf4" }}>
                <Badge variant="success">Products Filters</Badge>
                <ProductFilters />
              </div>
              <Badge variant="primary">Products</Badge>
              <div style={{ minHeight: this.state.minHightFilter }}>
                <ProductList />
              </div>
            </Route>
            <Route exact path="/pid/:id">
              <ProductDetails />
            </Route>
            <Route exact path="/prodedit/:id">
              <ProductEdit />
            </Route>
            <Route exact path={["/login", "/profile"]}>
              <div style={{ minHeight: this.state.minHight }}>
                <Login updateLogin={this.updateLogin} />
              </div>
            </Route>
            <Route exact path="/post">
              <Badge variant="primary">Posts</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <PostHome />
              </div>
            </Route>
            <Route path="/about">
              <Badge variant="primary">About</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <About />
              </div>
            </Route>
            <Route exact path="/cart">
              <Badge variant="primary">Cart</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <Cart />
              </div>
            </Route>
            <Route exact path="/address">
              <Badge variant="primary">Address</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <Address />
              </div>
            </Route>
            <Route exact path="/address/:id">
              <div style={{ minHeight: this.state.minHight }}>
                <AddressEdit />
              </div>
            </Route>
            <Route path={["/orders/:id", "/orders"]}>
              <Badge variant="primary">Order History</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <OrderHistory />
              </div>
            </Route>
            <Route path="/confirm">
              <div style={{ minHeight: this.state.minHight }}>
                <OrderConfirm />
              </div>
            </Route>
            <Route exact path="/customers">
              <Badge variant="primary">List of Customers</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <CustomersHome />
              </div>
            </Route>
            <Route path={["/customer/edit/:id", "/customers/edit"]}>
              <CustomersEdit />
            </Route>
            <Route path="/notfound">
              <div style={{ minHeight: this.state.minHight }}>
                <NotFound />
              </div>
            </Route>
            <Redirect to="/notfound" />
          </Switch>
        </div>
        {this.showSearch()}
        <footer
          id="Footer"
          className="border-top footer"
          bg="light"
          variant="light"
        >
          <div className="footer-copyright text-center py-3">
            <p style={{ margin: 0 }}>
              © 2020-21 :{" "}
              <Link
                to={"/"}
                className="nav-link"
                style={{ display: "contents", padding: 0 }}
              >
                Pritam Ecom
              </Link>
            </p>
          </div>
        </footer>
        <AnalyticsManager />
      </Router>
    );
  }

  showSearch() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleSearch}
        style={{ maxWidth: "100%" }}
      >
        <div style={{ width: "100%", marginTop: "12px", paddingRight: "12px" }}>
          <button onClick={this.handleSearch} className="CloseBtn">
            X
          </button>
          <br />
          <ProductSearch handleSearch={this.handleSearch} />
        </div>
      </Modal>
    );
  }
}

export default App;

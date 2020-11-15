import React, { Component } from "react";
import logo from "./image/logo.svg";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
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

import Product from "./component/product/list";

class App extends Component {
  state = {
    navExpanded: false,
    minHight: "450px",
    isLogin: localStorage.getItem("name") ? true : false,
    name: localStorage.getItem("name"),
    imageUrl: localStorage.getItem("imageUrl"),
  };

  constructor(props) {
    super(props);
    // Bind the this context to the handler function
    this.updateLogin = this.updateLogin.bind(this);
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
          onToggle={this.setNavExpanded}
          expanded={this.state.navExpanded}
        >
          <Container style={{ margin: "0px", width: "100%" }}>
            <Navbar.Brand>
              <Link to={"/"} className="navbar-brand row">
                <img src={logo} alt={logo} height="30"></img> Pritam Ecom
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" onClick={this.setNavClose}>
                <Link to={"/"} className="nav-link">
                  Home
                </Link>
                <Link to={"/post"} className="nav-link">
                  Posts
                </Link>
                <Link to={"/customers"} className="nav-link">
                  Customers
                </Link>
                <Link to={"/about"} className="nav-link">
                  About
                </Link>
              </Nav>
              {this.state.isLogin ? (
                <Link
                  to={"/profile"}
                  className="nav-link"
                  style={{ float: "end" }}
                >
                  <img
                    src={this.state.imageUrl}
                    alt={this.state.name}
                    height="30"
                  ></img>
                  {" " + this.state.name}
                </Link>
              ) : (
                <Link
                  to={"/login"}
                  className="nav-link"
                  style={{ float: "end" }}
                >
                  <i className="fa fa-sign-in" aria-hidden="true">
                    {" "}
                    Login
                  </i>
                </Link>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          <Switch>
            <Route exact path="/">
              <Badge variant="primary">Home</Badge>
              <div style={{ minHeight: this.state.minHight }}>
                <Home />
                <Product />
              </div>
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
        <footer className="border-top footer" bg="light" variant="light">
          <div className="footer-copyright text-center py-3">
            © 2020 Copyright :{" "}
            <Link to={"/"} className="nav-link">
              {" "}
              Pritam Ecom
            </Link>
          </div>
        </footer>
      </Router>
    );
  }
}

export default App;

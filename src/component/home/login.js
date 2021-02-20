import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import ReactGA from "react-ga";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin, GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

class Login extends Component {
  constructor(props) {
    super(props);

    if (process.env.NODE_ENV === "development") {
      console.log(process.env);
    }

    this.state = {
      isLogined: localStorage.getItem("name") ? true : false,
      accessToken: "",
    };

    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    this.handleLoginFacebook = this.handleLoginFacebook.bind(this);
  }

  login(response) {
    if (response.accessToken) {
      ReactGA.event({
        category: "Google Login",
        action: response.profileObj.email,
      });
      this.setState((state) => ({
        isLogined: true,
        accessToken: response.accessToken,
      }));
      localStorage.clear();
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("email", response.profileObj.email);
      localStorage.setItem("name", response.profileObj.name);
      // localStorage.setItem("googleId", response.profileObj.googleId);
      localStorage.setItem("imageUrl", response.profileObj.imageUrl);
      localStorage.setItem("loginTime", new Date().toISOString());
      this.updateInfo(
        response.profileObj.email,
        response.profileObj.name,
        response
      );
    } else {
      ReactGA.event({
        category: "Google Login Failed",
        action: JSON.stringify(response),
      });
    }
  }

  updateInfo(email, name, info) {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";
    axios
      .post(baseURL + "auth/social", {
        email,
        name,
        date: Date.now(),
        info,
      })
      .then(
        (response) => {
          localStorage.setItem("token", response.data.user.token);
          localStorage.setItem("uid", response.data.user.id);
          this.updateCart(response.data.user.id);
        },
        (error) => {
          console.log(error);
          localStorage.clear();
          alert("Something went Wrong! Try again...");
        }
      );
  }

  updateCart(uid) {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";
    axios.post(baseURL + "mongoclient/id?collection=cart&id=" + uid, {}).then(
      (response) => {
        var data = response.data.data;
        data !== undefined && data !== null
          ? localStorage.setItem("cart", JSON.stringify(response.data.data))
          : localStorage.setItem("cart", []);
        this.props.updateLogin();
        this.props.history.push("/");
      },
      (error) => {
        console.log(error);
        localStorage.setItem("cart", []);
      }
    );
  }

  logout(response) {
    ReactGA.event({
      category: "Sign Out",
      action: "logout",
    });
    this.setState((state) => ({
      isLogined: false,
      accessToken: "",
    }));
    localStorage.clear();
    toast.warn("Logout", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    this.props.updateLogin();
    this.props.history.push("/");
  }

  handleLoginFailure(response) {
    alert("Google - Failed to log in");
    ReactGA.event({
      category: "Google Login Failure",
      action: JSON.stringify(response),
    });
  }

  handleLogoutFailure(response) {
    alert("Google - Failed to log out");
    ReactGA.event({
      category: "Google Logout Failure",
      action: JSON.stringify(response),
    });
  }

  handleLoginFacebook(response) {
    if (response.accessToken) {
      this.setState({ isLogined: true, accessToken: response.accessToken });
      ReactGA.event({
        category: "Facebook Login",
        action: response.email,
      });
      localStorage.clear();
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("email", response.email);
      localStorage.setItem("name", response.name);
      localStorage.setItem("facebookId", response.userID);
      localStorage.setItem("imageUrl", response.picture.data.url);
      localStorage.setItem("loginTime", new Date().toISOString());
      this.updateInfo(response.email, response.name, response);
    } else {
      alert("Facebook - Failed to log in");
      ReactGA.event({
        category: "Facebook Login Failure",
        action: JSON.stringify(response),
      });
    }
  }

  getProfile() {
    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan="2">
              <img
                src={localStorage.getItem("imageUrl")}
                alt=""
                height="150"
                width="150"
              ></img>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <h3>{localStorage.getItem("name")}</h3>
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{localStorage.getItem("email")}</td>
          </tr>
          <tr>
            <td>Last Login Time</td>
            <td>{localStorage.getItem("loginTime")}</td>
          </tr>
          <tr>
            <td>
              <Link to="/address" className="btn btn-primary">
                My Address
              </Link>
            </td>
            <td>
              <Link to="/orders" className="btn btn-primary">
                Order History
              </Link>
            </td>
          </tr>
          <tr>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <Container fluid className="center">
        <div>
          {this.state.isLogined ? (
            <>
              {this.getProfile()}
              <GoogleLogout
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.logout}
                onFailure={this.handleLogoutFailure}
              ></GoogleLogout>
              <ToastContainer />
            </>
          ) : (
            <div>
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Sign in with Google"
                onSuccess={this.login}
                onFailure={this.handleLoginFailure}
                cookiePolicy={"single_host_origin"}
                responseType="code,token"
              />
              <br />
              <br />
              <br />
              <FacebookLogin
                appId="396350414949326"
                autoLoad={false}
                fields="name,email,picture"
                // onClick={this.componentClicked}
                icon="fa-facebook"
                callback={this.handleLoginFacebook}
              />
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default withRouter(Login);

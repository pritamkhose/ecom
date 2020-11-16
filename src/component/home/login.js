import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";

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
  }

  login(response) {
    // console.log(response);
    if (response.accessToken) {
      this.setState((state) => ({
        isLogined: true,
        accessToken: response.accessToken,
      }));
      localStorage.clear();
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("email", response.profileObj.email);
      localStorage.setItem("name", response.profileObj.name);
      localStorage.setItem("givenName", response.profileObj.givenName);
      localStorage.setItem("familyName", response.profileObj.familyName);
      localStorage.setItem("googleId", response.profileObj.googleId);
      localStorage.setItem("imageUrl", response.profileObj.imageUrl);
      localStorage.setItem("loginTime", Date.now());
      this.props.updateLogin();
      this.props.history.push("/");
    }
  }

  logout(response) {
    this.setState((state) => ({
      isLogined: false,
      accessToken: "",
    }));
    localStorage.clear();
    this.props.updateLogin();
    this.props.history.push("/");
  }

  handleLoginFailure(response) {
    alert("Failed to log in");
  }

  handleLogoutFailure(response) {
    alert("Failed to log out");
  }

  getProfile() {
    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan="2">
              <img
                src={localStorage.getItem("imageUrl")}
                alt={this.state.name}
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
            <td>First Name</td>
            <td>{localStorage.getItem("givenName")}</td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>{localStorage.getItem("familyName")}</td>
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
            </>
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Sign in with Google"
              onSuccess={this.login}
              onFailure={this.handleLoginFailure}
              cookiePolicy={"single_host_origin"}
              responseType="code,token"
            />
          )}
        </div>
      </Container>
    );
  }
}

export default withRouter(Login);

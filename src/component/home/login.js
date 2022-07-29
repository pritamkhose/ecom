import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';
import ReactGA from 'react-ga';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = (props) => {
  const navigate = useNavigate();
  const [isLogined, setLogined] = useState(!!localStorage.getItem('name'));
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(process.env);
    }
  }, []);

  const login = (response) => {
    if (response.accessToken) {
      ReactGA.event({
        category: 'Google Login',
        action: response.profileObj.name
      });
      setLogined(true);
      setAccessToken(response.accessToken);
      localStorage.clear();
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('email', response.profileObj.email);
      localStorage.setItem('name', response.profileObj.name);
      // localStorage.setItem("googleId", response.profileObj.googleId);
      localStorage.setItem('imageUrl', response.profileObj.imageUrl);
      localStorage.setItem('loginTime', new Date().toISOString());
      updateInfo(response.profileObj.email, response.profileObj.name, response);
    } else {
      ReactGA.event({
        category: 'Google Login Failed',
        action: JSON.stringify(response)
      });
    }
  };

  const updateInfo = (email, name, info) => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';
    axios
      .post(baseURL + 'auth/social', {
        email,
        name,
        date: Date.now(),
        info
      })
      .then(
        (response) => {
          localStorage.setItem('token', response.data.user.token);
          localStorage.setItem('uid', response.data.user.id);
          updateCart(response.data.user.id);
        },
        (error) => {
          console.log(error);
          localStorage.clear();
          alert('Something went Wrong! Try again...');
        }
      );
  };

  const updateCart = (uid) => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';
    axios.post(baseURL + 'mongoclient/id?collection=cart&id=' + uid, {}).then(
      (response) => {
        const data = response.data.data;
        data !== undefined && data !== null
          ? localStorage.setItem('cart', JSON.stringify(response.data.data))
          : localStorage.setItem('cart', []);
        props.updateLogin();
        navigate('/');
      },
      (error) => {
        console.log(error);
        localStorage.setItem('cart', []);
      }
    );
  };

  const logout = (response) => {
    ReactGA.event({
      category: 'Sign Out',
      action: 'logout'
    });
    setLogined(false);
    setAccessToken('');
    localStorage.clear();
    toast.warn('Logout', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
    props.updateLogin();
    navigate('/');
  };

  const handleLoginFailure = (response) => {
    alert('Google - Failed to log in');
    ReactGA.event({
      category: 'Google Login Failure',
      action: JSON.stringify(response)
    });
  };

  const handleLogoutFailure = (response) => {
    alert('Google - Failed to log out');
    ReactGA.event({
      category: 'Google Logout Failure',
      action: JSON.stringify(response)
    });
  };

  const handleLoginFacebook = (response) => {
    if (response.accessToken) {
      setLogined(true);
      setAccessToken(response.accessToken);
      ReactGA.event({
        category: 'Facebook Login',
        action: response.name
      });
      localStorage.clear();
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('email', response.email);
      localStorage.setItem('name', response.name);
      localStorage.setItem('facebookId', response.userID);
      localStorage.setItem('imageUrl', response.picture.data.url);
      localStorage.setItem('loginTime', new Date().toISOString());
      updateInfo(response.email, response.name, response);
    } else {
      alert('Facebook - Failed to log in');
      ReactGA.event({
        category: 'Facebook Login Failure',
        action: JSON.stringify(response)
      });
    }
  };

  const getProfile = () => {
    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan="2">
              <img src={localStorage.getItem('imageUrl')} alt="" height="150" width="150"></img>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <h3>{localStorage.getItem('name')}</h3>
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{localStorage.getItem('email')}</td>
          </tr>
          <tr>
            <td>Last Login Time</td>
            <td>{localStorage.getItem('loginTime')}</td>
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
  };

  return (
    <Container fluid className="center">
      <div>
        {isLogined ? (
          <>
            {getProfile()}
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={logout}
              onFailure={handleLogoutFailure}></GoogleLogout>
            <ToastContainer />
          </>
        ) : (
          <div>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Sign in with Google"
              onSuccess={login}
              onFailure={handleLoginFailure}
              cookiePolicy={'single_host_origin'}
              responseType="code,token"
            />
            <br />
            <br />
            <br />
            <FacebookLogin
              appId="396350414949326"
              autoLoad={false}
              fields="name,email,picture"
              // onClick={componentClicked}
              icon="fa-facebook"
              callback={handleLoginFacebook}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Login;

import React, { useState } from 'react';
import { Badge, Modal, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import logo from './image/logo.svg';
import icsearch from './image/search.svg';

import About from './component/home/about';
import Home from './component/home/home';
import Login from './component/home/login';
import NotFound from './component/home/notfound';

import CustomersEdit from './component/customers/Edit';
import CustomersHome from './component/customers/Home';
import PostHome from './component/post/PostHome';

import AnalyticsManager from './component/analytics/AnalyticsManager';
import Address from './component/product/Address';
import AddressEdit from './component/product/AddressEdit';
import Cart from './component/product/Cart';
import CartCount from './component/product/CartCount';
import ProductDetails from './component/product/Detail';
import OrderConfirm from './component/product/OrderConfirm';
import OrderHistory from './component/product/OrderHistory';
import ProductEdit from './component/product/ProductEdit';
import ProductFilters from './component/product/ProductFilters';
import ProductList from './component/product/ProductList';
import ProductSearch from './component/product/ProductSearch';

import LogRocket from 'logrocket';
import ReactGA from 'react-ga';
// Initialize google analytics page view tracking
ReactGA.initialize(process.env.REACT_APP_GOOGLE_MEASUREMENT_ID);
LogRocket.init('clsfru/ecom');

const App = () => {
  const [navExpanded, setNavExpanded] = useState(false);
  const [minHight, setMinHight] = useState(window.innerHeight - 160 + 'px');
  const [minHightFilter, setMinHightFilter] = useState(window.innerHeight - 260 + 'px');
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('name'));
  const [name, setName] = useState(localStorage.getItem('name'));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem('imageUrl'));
  const [show, setShow] = useState(false);

  const handleSearch = () => {
    setShow(!show);
    setNavExpanded(false);
  };

  const updateLogin = () => {
    setIsLogin(!!localStorage.getItem('name'));
    setName(localStorage.getItem('name'));
    setImageUrl(localStorage.getItem('imageUrl'));
  };

  const setNavExpandedView = (expanded) => {
    setNavExpanded(expanded);
  };

  const setNavClose = () => {
    setNavExpanded(false);
  };

  const showSearch = () => {
    return (
      <Modal show={show} onHide={handleSearch} style={{ maxWidth: '100%' }}>
        <div style={{ width: '100%', marginTop: '12px', paddingRight: '12px' }}>
          <button onClick={handleSearch} className="CloseBtn">
            X
          </button>
          <br />
          <ProductSearch handleSearch={handleSearch} />
        </div>
      </Modal>
    );
  };

  return (
    <BrowserRouter>
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        fixed="top"
        style={{ position: 'sticky', top: 0, zIndex: 1 }}
        onToggle={setNavExpandedView}
        expanded={navExpanded}>
        <span style={{ margin: '0px', width: '100%', display: 'contents' }}>
          <Navbar.Brand>
            <Link to={'/'} onClick={setNavClose} className="navbar-brand">
              <img src={logo} alt={logo} height="30"></img> Pritam Ecom
            </Link>
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav onClick={setNavClose}>
              <li className="nav-item active">
                <Link to={'/'} className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item active">
                <Link to={'/products'} className="nav-link">
                  Products
                </Link>
              </li>
              {isLogin ? (
                <li className="nav-item active">
                  <Link to={'/orders'} className="nav-link">
                    Orders
                  </Link>
                </li>
              ) : null}
              <li className="nav-item active">
                <Link to={'/about'} className="nav-link">
                  About
                </Link>
              </li>
            </Nav>
          </Navbar.Collapse>
          <div id="basic-navbar-nav">
            <Nav onClick={setNavClose} className="ml-auto">
              {isLogin ? (
                <li className="nav-item active">
                  <Link
                    to={'/profile'}
                    onClick={setNavClose}
                    className="nav-link"
                    style={{ float: 'end', color: 'rgba(0,0,0,.5)' }}>
                    <img src={imageUrl} alt="" height="30"></img>
                    {' ' + name}
                  </Link>
                </li>
              ) : (
                <li className="nav-item active">
                  <Link
                    to={'/login'}
                    onClick={setNavClose}
                    className="nav-link"
                    style={{ float: 'end' }}>
                    <i className="fa fa-sign-in" aria-hidden="true">
                      {' '}
                      Login
                    </i>
                  </Link>
                </li>
              )}
            </Nav>
          </div>
          <div className="navbar-link" onClick={setNavClose}>
            <img onClick={handleSearch} src={icsearch} alt="Search" height="35"></img>
          </div>
          <div className="navbar-link">
            <Link
              to={'/cart'}
              onClick={setNavClose}
              style={{ float: 'end', color: 'rgba(0,0,0,.5)' }}>
              <CartCount />
            </Link>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </span>
      </Navbar>
      <div>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <div style={{ minHeight: minHight }}>
                <Home />
                <Badge variant="primary">Products</Badge>
                <ProductList />
              </div>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <div style={{ background: '#e5faf4' }}>
                  <Badge className="badge bg-success">Products Filters</Badge>
                  <ProductFilters />
                </div>
                <Badge variant="primary">Products</Badge>
                <div style={{ minHeight: minHightFilter }}>
                  <ProductList />
                </div>
              </>
            }
          />
          <Route exact path="/pid/:id" element={<ProductDetails />} />
          <Route exact path="/prodedit/:id" element={<ProductEdit />} />
          <Route
            exact
            path="/login"
            element={
              <div style={{ minHeight: minHight }}>
                <Login updateLogin={updateLogin} />
              </div>
            }
          />
          <Route
            exact
            path="/profile"
            element={
              <div style={{ minHeight: minHight }}>
                <Login updateLogin={updateLogin} />
              </div>
            }
          />
          <Route
            exact
            path="/post"
            element={
              <>
                <Badge variant="primary">Posts</Badge>
                <div style={{ minHeight: minHight }}>
                  <PostHome />
                </div>
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Badge variant="primary">About</Badge>
                <div style={{ minHeight: minHight }}>
                  <About />
                </div>
              </>
            }
          />
          <Route
            exact
            path="/cart"
            element={
              <>
                <Badge variant="primary">Cart</Badge>
                <div style={{ minHeight: minHight }}>
                  <Cart />
                </div>
              </>
            }
          />
          <Route
            exact
            path="/address"
            element={
              <>
                <Badge variant="primary">Address</Badge>
                <div style={{ minHeight: minHight }}>
                  <Address />
                </div>
              </>
            }
          />
          <Route
            exact
            path="/address/:id"
            element={
              <div style={{ minHeight: minHight }}>
                <AddressEdit />
              </div>
            }
          />
          <Route
            path={'/orders'}
            element={
              <>
                <Badge variant="primary">Order History</Badge>
                <div style={{ minHeight: minHight }}>
                  <OrderHistory />
                </div>
              </>
            }
          />
          <Route
            path={'/orders/:id'}
            element={
              <>
                <Badge variant="primary">Order History</Badge>
                <div style={{ minHeight: minHight }}>
                  <OrderHistory />
                </div>
              </>
            }
          />
          <Route
            path="/confirm"
            element={
              <div style={{ minHeight: minHight }}>
                <OrderConfirm />
              </div>
            }
          />
          <Route
            exact
            path="/customers"
            element={
              <>
                <Badge variant="primary">List of Customers</Badge>
                <div style={{ minHeight: minHight }}>
                  <CustomersHome />
                </div>
              </>
            }
          />
          <Route path={'/customer/edit/:id'} element={<CustomersEdit />} />
          <Route path={'/customers/edit'} element={<CustomersEdit />} />
          <Route
            path="/notfound"
            element={
              <div style={{ minHeight: minHight }}>
                <NotFound />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <div style={{ minHeight: minHight }}>
                <NotFound />
              </div>
            }
          />
        </Routes>
      </div>
      {showSearch()}
      <footer id="Footer" className="border-top footer" bg="light" variant="light">
        <div className="footer-copyright text-center py-3">
          <p style={{ margin: 0 }}>
            ©2020-{' ' + new Date().getFullYear() - 2000} :
            <Link to={'/'} className="nav-link" style={{ display: 'contents', padding: 0 }}>
              Pritam Ecom
            </Link>
          </p>
        </div>
      </footer>
      <AnalyticsManager />
    </BrowserRouter>
  );
};

export default App;

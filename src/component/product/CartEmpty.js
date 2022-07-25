import React from 'react';

import { Link } from 'react-router-dom';
import logo from './../../image/logo.svg';

const CartEmpty = () => {
  return (
    <div className="center">
      <h3>Your cart is Empty!</h3>
      <img src={logo} alt={logo} height="200" className="center"></img>
      <br />
      <Link to="/" className="btn btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
};

export default CartEmpty;

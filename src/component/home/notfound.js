import React from 'react';
import { Link } from 'react-router-dom';
import notfound from './../../image/notfound.svg';
import './notfound.css';

const NotFound = () => {
  return (
    <div className="center">
      <img src={notfound} alt={notfound} height="300" className="center"></img>
      <br />
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

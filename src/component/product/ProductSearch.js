import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../image/logo.svg';

const ProductSearch = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-center py-3">
        <img src={logo} alt="Search" height="90"></img>
      </div>
      <br />
      <div style={{ margin: '12px' }}>
        <form
          className="searchinput"
          onSubmit={(e) => {
            e.preventDefault();
            props.handleSearch();
            navigate('/products?search=' + e.target.search.value);
          }}>
          <input type="text" placeholder="Search ..." name="search" id="search" />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
      <br />
    </>
  );
};

export default ProductSearch;

import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import { debounce } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ProductFilters = () => {
  const navigate = useNavigate();
  const { search, brand, category, sort } = useParams();

  const [brandList, setBrandList] = useState(JSON.parse(localStorage.getItem('brandList')));
  const [categoryList, setCategoryList] = useState(
    JSON.parse(localStorage.getItem('categoryList'))
  );

  useEffect(() => {
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSearchInputThrottled = debounce(this.handleChange, 1500);
    if (brandList == null) {
      getData('brand');
    }
    if (categoryList == null) {
      getData('category');
    }
  }, []);

  const handleChange = (e) => {
    // this.setState({ [e.target.name]: e.target.value }, () => {
    //   redirectURL();
    // });
  };

  const redirectURL = () => {
    let url = window.location.pathname + '?';
    if (search !== null && search !== '') {
      url = url + 'search=' + search;
    }
    if (category !== null && category !== '') {
      url = url + '&category=' + category;
    }
    if (brand !== null && brand !== '') {
      url = url + '&brand=' + brand;
    }
    if (sort !== null && sort !== '') {
      url = url + '&sort=' + sort;
    }
    navigate(url);
  };

  const getData = (type) => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';
    axios.post(baseURL + 'mongoclient/distinct?collection=productmyntra&id=' + type, {}).then(
      (response) => {
        if (type === 'brand') {
          localStorage.setItem('brandList', JSON.stringify(response.data));
          setBrandList(response.data);
        } else if (type === 'category') {
          localStorage.setItem('categoryList', JSON.stringify(response.data));
          setCategoryList(response.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="container" style={{ paddingBottom: '8px' }}>
      <div className="row">
        <div name="search" className="col-3">
          <label>Search :</label>
          <br />
          <input
            className="form-control"
            name="search"
            id="search"
            defaultValue={search !== null ? search : ''}
            // onChange={handleSearchInputThrottled} temp
            onChange={handleChange}
          />
        </div>
        <div name="sort" className="col-3">
          <label>Sort :</label>
          <select
            className="custom-select"
            name="sort"
            id="sort"
            value={sort !== null ? sort : ''}
            onChange={handleChange}>
            <option value="">All</option>
            <option value="price">Price ↑</option>
            <option value="pricedesc">Price ↓</option>
            <option value="rating">Rating ↑</option>
            <option value="ratingdesc">Rating ↓</option>
            <option value="name">Name ↑</option>
            <option value="namedesc">Name ↓</option>
          </select>
        </div>
        {brandList !== null ? (
          <div name="brand" className="col-3">
            <label>Brand :</label>
            <select
              className="custom-select"
              name="brand"
              id="brand"
              defaultValue={brand !== null ? brand : ''}
              onChange={handleChange}>
              <option key="NA" value="">
                All
              </option>
              {brandList.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {categoryList !== null ? (
          <div name="category" className="col-3">
            <label>Category :</label>
            <select
              className="custom-select"
              name="category"
              id="category"
              defaultValue={category}
              onChange={handleChange}>
              <option key="NA" value="">
                All
              </option>
              {categoryList.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductFilters;

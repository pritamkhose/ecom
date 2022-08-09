import React, { useState, useEffect, useRef } from 'react';

import notfound from './../../image/notfound.svg';
import '../home/notfound.css';

import ProductItem from './ProductItem';
import { Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
const queryString = require('query-string');

const ProductList = () => {
  const loadingRef = useRef();
  const { searchNav, brandNav, categoryNav, sortNav } = useParams();
  const [search, setSearch] = useState(searchNav);
  const [brand, setBrand] = useState(brandNav);
  const [category, setCategory] = useState(categoryNav);
  const [sort, setSort] = useState(sortNav);
  const [curPage, setCurPage] = useState(1);
  const [aList, setaList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query?.search?.length > 0) {
      setSearch(query?.search);
    }
    if (query?.category?.length > 0) {
      setCategory(query?.category);
    }
    if (query?.brand?.length > 0) {
      setBrand(query?.brand);
    }
    if (query?.sort?.length > 0) {
      setSort(query?.sort);
    }
  }, [location]);

  useEffect(() => {
    console.log('-->', 'Nav change');
    setCurPage(0);
    const query = queryString.parse(location.search);
    const search = query?.search;
    const category = query?.category;
    const brand = query?.brand;
    const sort = query?.sort;
    if (search?.length > 0) {
      setSearch(search);
    }
    if (category?.length > 0) {
      setCategory(category);
    }
    if (brand?.length > 0) {
      setBrand(brand);
    }
    if (sort?.length > 0) {
      setSort(sort);
    }
    // getData(0);
    // let url = window.location.pathname + '?';
    // if (search !== undefined && search !== null && search !== '') {
    //   url += 'search=' + search;
    // }
    // if (category !== undefined && category !== null && category !== '') {
    //   url += '&category=' + category;
    // }
    // if (brand !== undefined && brand !== null && brand !== '') {
    //   url += '&brand=' + brand;
    // }
    // if (sort !== undefined && sort !== null && sort !== '') {
    //   url += '&sort=' + sort;
    // }
    // navigate(url);
  }, [search, category, brand, sort]);

  const [data, setData] = useState({
    prevY: 0,
    showLoadMore: true,
    showNoContent: false,
    continueIncrement: true
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const y = entry?.boundingClientRect.y;
          // console.log('y-->', data.continueIncrement, data.prevY, y, data.prevY < y);
          if (data.continueIncrement && data.prevY < y) {
            console.log('y curPage-->', curPage);
            setData({
              prevY: y,
              showLoadMore: data.showLoadMore,
              showNoContent: data.showNoContent,
              continueIncrement: data.continueIncrement
            });
            getData(curPage);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
  }, [loadingRef]);

  const getData = (currentPage) => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    let searchObj = {};
    if (search !== null) {
      searchObj = {
        $or: [
          { product: { $regex: search, $options: 'i' } },
          { additionalInfo: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    if (brand !== null && category !== null) {
      searchObj.brand = brand;
      searchObj.category = category;
    }
    if (brand !== null) {
      searchObj.brand = brand;
    }
    if (category !== null) {
      searchObj.category = category;
    }
    // console.log('searchObj -->', searchObj);

    let sortObj = {};
    switch (sort) {
      case 'price':
        sortObj = { price: 1 };
        break;
      case 'pricedesc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { rating: 1 };
        break;
      case 'ratingdesc':
        sortObj = { rating: -1 };
        break;
      case 'name':
        sortObj = { product: 1 };
        break;
      case 'namedesc':
        sortObj = { product: -1 };
        break;
      case 'id':
        sortObj = { _id: -1 };
        break;
      case 'iddesc':
        sortObj = { _id: 1 };
        break;
      default:
        sortObj = { rating: -1 };
        break;
    }

    axios
      .post(baseURL + 'mongoclient?collection=productmyntra', {
        projection: {
          productId: 1,
          product: 1,
          searchImage: 1,
          brand: 1,
          rating: 1,
          price: 1,
          mrp: 1
        },
        search: {}, // searchObj,
        sort: sortObj,
        limit: 12,
        skip: 12 * (currentPage - 1)
      })
      .then(
        (response) => {
          if (response.status === 200) {
            const tempPage = 1 + currentPage;
            if (curPage === 1) {
              setData({
                prevY: data.prevY,
                showLoadMore: !(response.data.length < 12),
                showNoContent: data.showNoContent,
                continueIncrement: !(response.data.length < 12)
              });
              setaList(response.data);
              setCurPage(tempPage);
            } else {
              setaList([...aList, ...response.data]);
              setCurPage(tempPage + 1);
            }
            console.log('tempPage set -->', tempPage);
          } else if (response.status === 204) {
            setData({
              prevY: data.prevY,
              showLoadMore: false,
              showNoContent: curPage === 1,
              continueIncrement: false
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const showLoading = () => {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  };

  const getItems = () => {
    const items = [];
    for (const [index, value] of Object.entries(aList)) {
      items.push(<ProductItem key={index} index={index} value={value} />);
    }
    return items;
  };

  return (
    <>
      {aList.length === 0 ? null : (
        <Row xs="2" sm="2" md="4" lg="6" xl="8" style={{ margin: '0px' }}>
          {getItems()}
        </Row>
      )}
      <div ref={loadingRef}>
        {data.showLoadMore ? showLoading() : null}
        {data.showNoContent ? (
          <div className="center">
            <img src={notfound} alt={notfound} height="300" className="center"></img>
            <br />
            <Link to="/products" className="btn btn-primary">
              Explore more with us!
            </Link>
          </div>
        ) : null}
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductList;

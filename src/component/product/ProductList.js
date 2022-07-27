import React, { useState, useEffect, useRef } from 'react';

import notfound from './../../image/notfound.svg';
import '../home/notfound.css';

import ProductItem from './ProductItem';
import { Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { Link, useParams, useLocation } from 'react-router-dom';
const queryString = require('query-string');

const ProductList = () => {
  const loadingRef = useRef();
  const { searchNav, brandNav, categoryNav, sortNav } = useParams();
  const [search, setSearch] = useState(searchNav);
  const [brand, setBrand] = useState(brandNav);
  const [category, setCategory] = useState(categoryNav);
  const [sort, setSort] = useState(sortNav);

  const location = useLocation();
  useEffect(() => {
    const query = queryString.parse(location.search);
    // console.log('Location changed', query);
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
    getData();
  }, [search, category, brand, sort]);

  const [data, setData] = useState({
    curPage: 1,
    prevY: 0,
    aList: [],
    showLoadMore: true,
    showNoContent: false,
    continueIncrement: true
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const y = entry?.boundingClientRect.y;
          console.log('y-->', data.continueIncrement, data.prevY, y, data.prevY > data.y);
          if (data.continueIncrement && data.prevY < y) {
            setData(
              {
                ...data,
                curPage: 1,
                prevY: y,
                // aList: [],
                showLoadMore: true,
                showNoContent: false,
                continueIncrement: true
              },
              () => {
                console.log('curPage-->', data.curPage);
                getData();
              }
            );
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

  const getData = () => {
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
    console.log('searchObj -->', searchObj);

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
        skip: 12 * (data.curPage - 1)
      })
      .then(
        (response) => {
          if (response.status === 200) {
            if (data.curPage === 1) {
              // setaList(response.data);
              // setCurPage(curPage + 1);
              // setContinueIncrement(!(response.data.length < 12));
              // setShowLoadMore(!(response.data.length < 12));
              setData({
                ...data,
                aList: response.data,
                curPage: data.curPage + 1,
                continueIncrement: !(response.data.length < 12),
                showLoadMore: !(response.data.length < 12)
              });
            } else {
              // setaList([...aList, ...response.data]);
              // setCurPage(curPage + 1);
              setData({
                ...data,
                aList: [...data.aList, ...response.data],
                curPage: data.curPage + 1
              });
            }
          } else if (response.status === 204) {
            // setShowLoadMore(false);
            // setShowNoContent(curPage === 1);
            // setContinueIncrement(false);
            setData({
              ...data,
              showLoadMore: false,
              showNoContent: data.curPage === 1,
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
    for (const [index, value] of Object.entries(data.aList)) {
      items.push(<ProductItem key={index} index={index} value={value} />);
    }
    return items;
  };

  return (
    <>
      {data.aList.length === 0 ? null : (
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

import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Spinner, Badge, Carousel, Button } from 'react-bootstrap';
import './ProductItem.css';
import axios from 'axios';
import AddCartBtn from './AddCartBtn';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [obj, setObj] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isLogined, setLogined] = useState(!!localStorage.getItem('name'));

  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = (id) => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';
    axios.post(baseURL + 'mongoclient/id?collection=productmyntra&id=' + id, {}).then(
      (response) => {
        if (response.status === 200) {
          setLoading(false);
          setObj(response.data);
        } else {
          setLoading(false);
          alert('Something went Wrong! Try again...');
          navigate('/products');
        }
      },
      (error) => {
        console.log(error);
        setLoading(false);
        alert('Invaild ID!');
        navigate('/products');
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

  const isMobile = () => {
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match() remember str.test is case sensitive
    const isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    // console.log(navigator.userAgent.toLowerCase());
    // console.log(isMobile);
    return isMobile;
  };

  const getTitleHeading = (aObj) => {
    return (
      <>
        <h3 style={{ marginLeft: '16px' }}>{aObj.product}</h3>
        <hr />
        <p style={{ marginLeft: '24px' }}>{aObj.additionalInfo}</p>
        {isLogined ? (
          <div>
            <hr />
            <Button
              style={{ marginLeft: '24px' }}
              className="btn btn-danger"
              onClick={() => navigate('/prodedit/' + id)}>
              Edit
            </Button>
            <Button
              style={{ marginLeft: '24px' }}
              className="btn btn-primary"
              onClick={() => navigate('/prodedit/new')}>
              New
            </Button>
          </div>
        ) : null}
      </>
    );
  };

  const showVarient = (aList) => {
    return (
      <>
        {aList !== undefined && aList !== null && aList.length > 1 ? (
          <tr key="varient">
            <td>Varient</td>
            <td colSpan="2">
              <select className="custom-select" name="varient" id="varient" defaultValue="">
                <option key="NA" value="">
                  Not Selected
                </option>
                {aList.map((val) =>
                  val.available ? (
                    val.inventory < 6 ? (
                      <option key={val.skuId} value={val.label}>
                        {val.label} - {val.inventory} Left
                      </option>
                    ) : (
                      <option key={val.skuId} value={val.label}>
                        {val.label}
                      </option>
                    )
                  ) : null
                )}
              </select>
            </td>
          </tr>
        ) : null}
      </>
    );
  };

  const showData = (aObj) => {
    return (
      <>
        {isMobile() ? (
          <>
            {getTitleHeading(aObj)}
            <table className="table table-stripe">
              <tbody>
                <tr key="price">
                  <td className="Price">
                    <b>Price : {aObj.price} ₹</b>
                  </td>
                  <td className="PriceCancel">MRP : {aObj.mrp} ₹</td>
                  <td>
                    {aObj.discount} ₹ / <b>{aObj.discountDisplayLabel}</b>
                  </td>
                </tr>
                <tr key="rating">
                  <td>Rating</td>
                  <td>
                    <b> {aObj.rating}</b> / 5 🌟
                  </td>
                  <td>Total Rating: {aObj.ratingCount}</td>
                </tr>
                <tr key="images">
                  <td colSpan="3">{showImages(aObj.images)}</td>
                </tr>
                {showVarient(aObj.inventoryInfo)}
                <tr key="cart">
                  <td colSpan="3">
                    <AddCartBtn aObj={aObj} />
                  </td>
                </tr>
                <tr key="brand">
                  <td>Brand</td>
                  <td colSpan="2">{aObj.brand}</td>
                </tr>
                <tr key="style">
                  <td>Style</td>
                  <td colSpan="2">
                    {aObj.gender} - {aObj.category}
                  </td>
                </tr>
                <tr key="primaryColour">
                  <td>Color</td>
                  <td colSpan="2">{aObj.primaryColour}</td>
                </tr>
                <tr key="season">
                  <td>Season</td>
                  <td colSpan="2">{aObj.season}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            {getTitleHeading(aObj)}
            <hr />
            <Row style={{ margin: '0px' }}>
              <Col>{showImages(aObj.images)}</Col>
              <Col>
                <table className="table table-stripe">
                  <tbody>
                    <tr key="price">
                      <td className="Price" style={{ borderTop: '0px' }}>
                        <b>Price : {aObj.price} ₹</b>
                      </td>
                      <td className="PriceCancel" style={{ borderTop: '0px' }}>
                        MRP : {aObj.mrp} ₹
                      </td>
                      <td style={{ borderTop: '0px' }}>
                        {aObj.discount} ₹ / <b>{aObj.discountDisplayLabel}</b>
                      </td>
                    </tr>
                    <tr key="rating">
                      <td>Rating</td>
                      <td>
                        <b> {Number(aObj.rating).toFixed(2)}</b> / 5 🌟
                      </td>
                      <td>Total Rating: {aObj.ratingCount}</td>
                    </tr>
                    {showVarient(aObj.inventoryInfo)}
                    <tr key="cart">
                      <td colSpan="3">
                        <AddCartBtn aObj={aObj} />
                      </td>
                    </tr>
                    <tr key="brand">
                      <td>Brand</td>
                      <td colSpan="2">{aObj.brand}</td>
                    </tr>
                    <tr key="style">
                      <td>Style</td>
                      <td colSpan="2">
                        {aObj.gender} - {aObj.category}
                      </td>
                    </tr>
                    <tr key="primaryColour">
                      <td>Color</td>
                      <td colSpan="2">{aObj.primaryColour}</td>
                    </tr>
                    <tr key="season">
                      <td>Season</td>
                      <td colSpan="2">{aObj.season}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  };

  const showImages = (arr) => {
    return (
      <Container>
        <Carousel>
          {arr !== undefined &&
            arr.map(function (x, i) {
              return x.src != null && x.src.length > 0 ? (
                <Carousel.Item key={i} interval={2000}>
                  <img height="450rem" className="d-block w-100" alt={x.view} src={x.src} />
                  <Carousel.Caption>
                    <p>
                      {i + 1} / {arr.length}
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              ) : null;
            })}
        </Carousel>
      </Container>
    );
  };

  return (
    <div>
      <Badge variant="primary">Product Deails</Badge>
      {isLoading ? showLoading() : showData(obj)}
    </div>
  );
};

export default ProductDetails;

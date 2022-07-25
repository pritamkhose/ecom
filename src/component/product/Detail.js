import React, { Component } from 'react';

import { Container, Col, Row, Spinner, Badge, Carousel, Button } from 'react-bootstrap';
import './ProductItem.css';
import axios from 'axios';
import AddCartBtn from './AddCartBtn';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      aObj: {},
      isLoading: true,
      isLogined: !!localStorage.getItem('name')
    };
    this.getData(props.match.params.id);
  }

  getData(id) {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';
    axios.post(baseURL + 'mongoclient/id?collection=productmyntra&id=' + id, {}).then(
      (response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false, aObj: response.data });
        } else {
          this.setState({ isLoading: false });
          alert('Something went Wrong! Try again...');
          this.props.history.push('/products');
        }
      },
      (error) => {
        console.log(error);
        this.setState({ isLoading: false });
        alert('Invaild ID!');
        this.props.history.push('/products');
      }
    );
  }

  render() {
    return (
      <div>
        <Badge variant="primary">Product Deails</Badge>
        {this.state.isLoading ? this.showLoading() : this.showData(this.state.aObj)}
      </div>
    );
  }

  showLoading() {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  isMobile() {
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match() remember str.test is case sensitive
    const isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    // console.log(navigator.userAgent.toLowerCase());
    // console.log(isMobile);
    return isMobile;
  }

  getTitleHeading(aObj) {
    return (
      <>
        <h3 style={{ marginLeft: '16px' }}>{aObj.product}</h3>
        <hr />
        <p style={{ marginLeft: '24px' }}>{aObj.additionalInfo}</p>
        {this.state.isLogined ? (
          <div>
            <hr />
            <Button
              style={{ marginLeft: '24px' }}
              className="btn btn-danger"
              onClick={() => this.props.history.push('/prodedit/' + this.state.id)}>
              Edit
            </Button>
            <Button
              style={{ marginLeft: '24px' }}
              className="btn btn-primary"
              onClick={() => this.props.history.push('/prodedit/new')}>
              New
            </Button>
          </div>
        ) : null}
      </>
    );
  }

  showVarient(aList) {
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
  }

  showData(aObj) {
    return (
      <>
        {this.isMobile() ? (
          <>
            {this.getTitleHeading(aObj)}
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
                  <td colSpan="3">{this.showImages(aObj.images)}</td>
                </tr>
                {this.showVarient(aObj.inventoryInfo)}
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
            {this.getTitleHeading(aObj)}
            <hr />
            <Row style={{ margin: '0px' }}>
              <Col>{this.showImages(aObj.images)}</Col>
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
                    {this.showVarient(aObj.inventoryInfo)}
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
  }

  showImages(arr) {
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
  }
}

export default ProductDetails;

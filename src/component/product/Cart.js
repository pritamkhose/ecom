import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStateValue } from '../../StateProvider';
import { getBasketTotal } from '../../Reducer';

import axios from 'axios';

import { Card, Row, Col } from 'react-bootstrap';
import CartItem from './CartItem';
import CartEmpty from './CartEmpty';

const Cart = (props) => {
  const [{ basket }] = useStateValue();

  const [cart, setCart] = useState([]);
  useEffect(() => {
    if (localStorage.getItem('uid')) {
      const baseURL =
        (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
        '/api/';
      axios
        .post(baseURL + 'mongoclient/id?collection=cart&id=' + localStorage.getItem('uid'), {})
        .then(
          (response) => {
            localStorage.setItem('cart', JSON.stringify(response.data.data));
            setCart(response.data.data);
          },
          (error) => {
            console.log(error);
            setCart([]);
          }
        );
    }
  }, []);

  return (
    <>
      {basket === null || basket === undefined || basket.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          {basket?.map((item) => (
            <CartItem value={item} key={item._id} />
          ))}
          <Card className="Card" style={{ padding: '10px' }}>
            <Row style={{ margin: '0px' }}>
              <Col>
                <h5 style={{ textAlign: 'center' }}>{basket.length} Items</h5>
              </Col>
              <Col>
                <h5 style={{ textAlign: 'center' }}>{getBasketTotal(basket)} ₹ </h5>
              </Col>
              <Col>
                <Link to="/confirm" className="btn btn-primary" style={{ width: '100%' }}>
                  Buy Now
                </Link>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
};

export default Cart;

import React, { useState, useEffect } from 'react';

import './ProductItem.css';
import { Card, Spinner } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import addaddress from '../../image/addaddress.svg';

const Address = (props) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      const baseURL =
        (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
        '/api/';
      setLoading(true);
      axios
        .post(baseURL + 'mongoclient?collection=address', {
          search: {
            uid: localStorage.getItem('uid')
          }
        })
        .then(
          (response) => {
            setLoading(false);
            if (response.data !== undefined && response.data !== null && response.data !== '') {
              setAddress(response.data);
            }
          },
          (error) => {
            console.error('-->', JSON.stringify(error));
            setLoading(false);
            setAddress([]);
          }
        );
    } else {
      navigate('/login');
    }
  }, []);

  const showLoading = () => {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  };

  const openLink = (props, id) => {
    navigate('/address/' + id);
  };

  const setEmptyAddress = (props) => {
    return (
      <Card className="Card" key="empty" onClick={() => openLink(props, 'new')}>
        <h5>
          <img src={addaddress} alt="Cart" height="50" width="50" style={{ margin: 20 }}></img>
          <br />
          Add Address
        </h5>
      </Card>
    );
  };

  return (
    <div>
      {isLoading ? (
        showLoading()
      ) : (
        <div className="text-center py-3">
          {setEmptyAddress(props)}
          {address?.map((item, i) => (
            <Card className="CardAddress" key={i} onClick={() => openLink(props, item.addrid)}>
              <h5 className="AddrLineText">{item.firstName + ' ' + item.lastName}</h5>
              <p className="AddrLineText">
                <b>Mobile No : </b>
                {item.mobileno}
              </p>
              <p className="AddrLineText">{item.atype !== undefined ? item.atype : null}</p>
              <p className="AddrLineText">{item.address}</p>
              <p className="AddrLineText">{item.landmark !== undefined ? item.landmark : null}</p>
              <p className="AddrLineText">{item.area}</p>
              <p className="AddrLineText">{item.city + ' - ' + item.pincode}</p>
              <p className="AddrLineText">{item.state + ', ' + item.country}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Address;

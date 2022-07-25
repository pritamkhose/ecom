import React from 'react';
import { useStateValue } from '../../StateProvider';

import { Card, Badge, Table, Col } from 'react-bootstrap';
import './ProductItem.css';
import logo from '../../image/logo.svg';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactGA from 'react-ga';

const MAX_LENGTH = 36;

const ProductItem = (props) => {
  const [{}, dispatch] = useStateValue();

  // const [isLogined] = useState(localStorage.getItem("name") ? true : false);

  const addCart = (obj) => {
    // dispatch the item into the data layer
    dispatch({
      type: 'ADD_TO_BASKET',
      item: obj
    });
    toast.success('🛒 ' + obj.product, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });

    const item = {
      id: obj.productId,
      name: obj.product,
      price: obj.price,
      category: obj.brand,
      quantity: obj.qty
    };
    ReactGA.event({
      category: 'Add to Cart',
      action: JSON.stringify(item)
    });
    ReactGA.plugin.execute('ecommerce', 'addItem', item);
    ReactGA.plugin.execute('ecommerce', 'send');
    ReactGA.plugin.execute('ecommerce', 'clear');
  };

  function openLink(id) {
    props.history.push('/pid/' + id);
  }

  function getURL(url) {
    const fname = url.substring(url.lastIndexOf('/') + 1);
    return process.env.REACT_APP_ASSET_URL + fname + '?alt=media';
  }

  function getImage(url) {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
      '/api/storage/getImage?id=' +
      url;
    return baseURL;
  }

  return (
    <Col>
      <Card className="Card">
        <img
          height="220rem"
          alt={props.value.product}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = props.value.searchImage;
            // e.target.src = getImage(props.value.searchImage);
          }}
          src={getURL(props.value.searchImage)}
          onClick={() => openLink(props.value._id)}
        />
        <Badge className="Overlap" variant="primary">
          {props.value.brand}
        </Badge>
        {props.value.rating === 0 ? null : (
          <Badge className="OverlapRating" variant="success">
            {Number(props.value.rating).toFixed(2)}
          </Badge>
        )}

        <Table style={{ margin: 0, padding: 0 }}>
          <tbody>
            <tr>
              <td
                style={{ margin: 0, padding: 0 }}
                colSpan="3"
                className="Title"
                onClick={() => openLink(props.value._id)}>
                {props.value.product.substring(0, MAX_LENGTH)}
              </td>
            </tr>
            <tr>
              <td
                style={{ margin: 0, padding: 0, border: 'none' }}
                className="Price"
                onClick={() => openLink(props.value._id)}>
                ₹ {props.value.price}
              </td>
              <td style={{ margin: 0, padding: 0, border: 'none' }} className="PriceCancel">
                ₹ {props.value.mrp}
              </td>
              <td
                style={{
                  margin: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingRight: 10,
                  border: 'none',
                  textAlign: 'right'
                }}>
                <img src={logo} alt={logo} height="30" onClick={() => addCart(props.value)}></img>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
};

export default ProductItem;

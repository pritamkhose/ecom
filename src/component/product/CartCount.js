import React from 'react';
import cartcount from '../../image/cartcount.svg';
import { useStateValue } from '../../StateProvider';
import './ProductItem.css';

const CartCount = () => {
  const [{ basket }] = useStateValue();

  return (
    <div style={{ marginRight: '4px' }}>
      <a className="CartText" style={{ margin: '0px', padding: '0px', paddingTop: '3px' }}>
        <img src={cartcount} alt="Cart" height="35" /> {basket.length}
      </a>
    </div>
  );
};

export default CartCount;

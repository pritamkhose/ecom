import React from 'react';
import cartcount from '../../image/cartcount.svg';
import { useStateValue } from '../../StateProvider';
import './ProductItem.css';

const CartCount = () => {
  const [{ basket }] = useStateValue();

  return (
    <div style={{ margin: '0px' }}>
      <p className="CartText" style={{ margin: '0px', padding: '0px', paddingTop: '3px' }}>
        <img src={cartcount} alt="Cart" height="35" /> {basket.length}
      </p>
    </div>
  );
};

export default CartCount;

import React from 'react';
import { Button } from 'react-bootstrap';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CART_CONSTANTS } from '../constants';

const EmptyCart = ({ onContinueShopping }) => {
  return (
    <div className="cart-empty">
      <ShoppingCartOutlinedIcon className="cart-empty-icon" />
      <h3 className="cart-empty-message">{CART_CONSTANTS.MESSAGES.EMPTY_CART}</h3>
      <p className="cart-empty-suggestion">
        {CART_CONSTANTS.MESSAGES.CART_EMPTY_SUGGESTION}
      </p>
      <Button 
        className="btn-shop-now" 
        onClick={onContinueShopping}
      >
        Tiếp tục mua sắm
      </Button>
    </div>
  );
};

export default EmptyCart; 
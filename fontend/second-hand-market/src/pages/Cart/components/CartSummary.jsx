import React from 'react';
import { Card, Button } from 'react-bootstrap';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CART_CONSTANTS } from '../constants';

const CartSummary = ({ 
  hasSelectedItems, 
  selectedCount, 
  totalAmount, 
  onDeleteSelected, 
  onCheckout 
}) => {
  const buttonStyle = {
    position: 'relative',
    overflow: 'hidden',
    transition: `all ${CART_CONSTANTS.STYLES.ANIMATION_DURATION} ease`,
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    paddingLeft: CART_CONSTANTS.STYLES.BUTTON_PADDING,
    paddingRight: CART_CONSTANTS.STYLES.BUTTON_PADDING,
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = CART_CONSTANTS.STYLES.HOVER_TRANSFORM;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const handleMouseDown = (e) => {
    e.currentTarget.style.transform = `scale(${CART_CONSTANTS.STYLES.TRANSFORM_SCALE})`;
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.transform = CART_CONSTANTS.STYLES.HOVER_TRANSFORM;
  };

  return (
    <Card
      className="shadow-sm sticky-bottom mt-4"
      style={{
        transition: 'none',
        transform: 'none !important',
        boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
        borderRadius: '8px',
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {hasSelectedItems && (
              <Button
                variant="link"
                className="d-flex font-monospace fs-5 align-items-center text-danger text-decoration-none"
                onClick={onDeleteSelected}
              >
                <DeleteOutlineIcon className="delete-icon" />
                <span>Xóa</span>
              </Button>
            )}
          </div>
          
          <div className="text-right">
            <p className="mb-0 font-weight-bold me-3">
              Tổng tiền ({selectedCount} Sản phẩm):{' '}
              <strong className="text-danger fs-5 ms-2">
                {totalAmount.toLocaleString()}₫
              </strong>
            </p>
            
            <Button
              className="mt-2 float-end btn-bg buy-now-btn"
              onClick={onCheckout}
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              disabled={!hasSelectedItems}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>
                Mua Hàng
              </span>
              <div
                className="btn-shine"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shine 2s infinite',
                  zIndex: 1,
                }}
              />
            </Button>
          </div>
        </div>
      </Card.Body>
      
      <style jsx>{`
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        .buy-now-btn:active {
          transform: scale(${CART_CONSTANTS.STYLES.TRANSFORM_SCALE}) !important;
          box-shadow: 0 2px 6px rgba(238, 77, 45, 0.3) !important;
        }
      `}</style>
    </Card>
  );
};

export default CartSummary; 
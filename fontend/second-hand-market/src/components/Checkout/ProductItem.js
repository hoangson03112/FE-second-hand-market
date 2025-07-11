import React from 'react';
import { formatPrice, renderCategory, calculateProductDiscount } from '../../utils/checkoutUtils';

const ProductItem = ({ product, showBorder = true }) => {
  // Calculate all discount information using utility function
  const discount = calculateProductDiscount(product);
  const {
    originalPrice,
    currentPrice,
    finalPrice,
    discountAmount,
    discountPercentage,
    additionalDiscount,
    userDiscount,
    totalDiscount,
    totalDiscountPercentage,
    hasDiscount,
    hasAnyDiscount,
    isPercentageDiscount
  } = discount;
  return (
    <tr className={showBorder ? 'border-bottom' : ''}>
      <td className="text-start py-3">
        <div className="d-flex align-items-center">
          <img
            src={product?.avatar?.url || '/default-product.png'}
            alt={product.name}
            className="img-fluid rounded me-3"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
          />
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-bold">{product.name}</h6>
            <div className="text-muted small">
              {product.category && (
                <span className="badge bg-light text-dark me-2">
                  {renderCategory(product.category)}
                </span>
              )}
              {product.condition && (
                <span className="text-muted me-2">
                  Tình trạng: {product.condition}%
                </span>
              )}
              {hasAnyDiscount && (
                <span className="badge bg-secondary text-white me-2">
                  -{totalDiscountPercentage}%
                </span>
              )}
            </div>
            
            {/* Discount Information */}
            {hasAnyDiscount && (
              <div className="discount-info mt-2">
                <div className="row g-1">
                  {hasDiscount && (
                    <div className="col-12">
                      <small className="text-muted">
                        <i className="bi bi-tag me-1"></i>
                        Giảm giá sản phẩm: -{discountPercentage}% 
                        ({formatPrice(discountAmount)}₫)
                      </small>
                    </div>
                  )}
                  {additionalDiscount > 0 && (
                    <div className="col-12">
                      <small className="text-muted">
                        <i className="bi bi-percent me-1"></i>
                        Giảm giá đặc biệt: {isPercentageDiscount ? `-${additionalDiscount}%` : `-${formatPrice(additionalDiscount)}₫`}
                      </small>
                    </div>
                  )}
                  {userDiscount > 0 && (
                    <div className="col-12">
                      <small className="text-muted">
                        <i className="bi bi-person-check me-1"></i>
                        Ưu đãi cá nhân: -{formatPrice(userDiscount)}₫
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {product.description && (
              <div className="text-muted small mt-1" style={{ fontSize: '0.8rem' }}>
                {product.description.length > 100 
                  ? `${product.description.substring(0, 100)}...` 
                  : product.description
                }
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="text-center">
        {hasAnyDiscount ? (
          <div>
            <div className="text-muted small text-decoration-line-through">
              {formatPrice(originalPrice)}₫
            </div>
            <div className="fw-bold text-primary">
              {formatPrice(finalPrice)}₫
            </div>
            <div className="small fw-bold text-muted">
              Tiết kiệm: {formatPrice(totalDiscount)}₫
            </div>
          </div>
        ) : (
          <div className="fw-bold">{formatPrice(currentPrice)}₫</div>
        )}
      </td>
      <td className="text-center">
        <div className="quantity-display">
          <span className="fw-bold fs-5">{product.quantity}</span>
        </div>
      </td>
      <td className="text-center">
        {hasAnyDiscount ? (
          <div>
            <div className="text-muted small text-decoration-line-through">
              {formatPrice(product.quantity * originalPrice)}₫
            </div>
            <div className="fw-bold text-primary fs-6">
              {formatPrice(product.quantity * finalPrice)}₫
            </div>
            <div className="small fw-bold text-muted">
              Tiết kiệm: {formatPrice(product.quantity * totalDiscount)}₫
            </div>
          </div>
        ) : (
          <div className="fw-bold text-primary fs-6">
            {formatPrice(product.quantity * currentPrice)}₫
          </div>
        )}
      </td>
    </tr>
  );
};

export default ProductItem; 
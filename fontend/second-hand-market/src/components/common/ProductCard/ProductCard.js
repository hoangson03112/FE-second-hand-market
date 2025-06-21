import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, isLoading = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoading && product?._id) {
      navigate(`/eco-market/product?productID=${product._id}`);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (isLoading) {
    return (
      <div className="product-card skeleton">
        <div className="skeleton-image"></div>
        <div className="card-body">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-price"></div>
          <div className="skeleton-text skeleton-location"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        <img
          src={product?.images?.[0] || '/images/placeholder.jpg'}
          className="product-image"
          alt={product?.title || 'Product'}
          loading="lazy"
        />
        <div className="product-overlay">
          <button className="view-btn">Xem chi tiết</button>
        </div>
      </div>
      <div className="card-body">
        <h6 className="product-title">{product?.title || 'Tên sản phẩm'}</h6>
        <p className="product-price">{formatPrice(product?.price)}</p>
        <p className="product-location">
          <i className="bi bi-geo-alt-fill text-danger"></i> 
          {product?.location || 'Chưa cập nhật'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard; 
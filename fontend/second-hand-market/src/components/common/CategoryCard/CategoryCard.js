import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="category-card skeleton">
        <div className="category-icon-skeleton"></div>
        <div className="category-name-skeleton"></div>
      </div>
    );
  }

  return (
    <Link 
      to={`/eco-market?categoryID=${category._id}`} 
      className="category-card-link"
    >
      <div className="category-card">
        <div className="category-icon">
          <img
            src={category.image}
            alt={category.name}
            className="category-image"
            loading="lazy"
          />
          <div className="category-overlay">
            <span className="explore-text">Khám phá</span>
          </div>
        </div>
        <span className="category-name">{category.name}</span>
      </div>
    </Link>
  );
};

export default CategoryCard; 
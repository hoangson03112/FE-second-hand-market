import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Home.css";
import axios from "axios";
import CheckInModal from "../../components/Checkin/CheckInModal";
import { useAuth } from "../../contexts/AuthContext";
import productService from "../../services/productService";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import CategoryCard from "../../components/common/CategoryCard/CategoryCard";

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

      const [showCheckInModal, setShowCheckInModal] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchLatestProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await axios.get("http://localhost:2000/eco-market/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Không thể tải danh mục. Vui lòng thử lại sau.");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchLatestProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productService.getAllProducts({ 
        limit: 12, 
        sort: 'createdAt', 
        order: 'desc' 
      });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchCategories();
    fetchLatestProducts();
  };

  const renderCategorySkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6">
        <CategoryCard isLoading={true} />
      </div>
    ));
  };

  const renderProductSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12">
        <ProductCard isLoading={true} />
      </div>
    ));
  };

  return (
    <div className="home-page">
           {isAuthenticated && (
         <button
    onClick={() => setShowCheckInModal(true)}
    style={{
      position: "fixed",
      top: "75%",
      right: "70px", 
      transform: "translateY(-50%)", 
      zIndex: 1000,
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      background: "linear-gradient(135deg, #FFD700, #FFA500)",
      color: "white",
      border: "none",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    }}
    title="Điểm danh nhận xu"
  >
    <i className="bi bi-coin" style={{ fontSize: "1.5rem" }}></i>
  </button>
      )}
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Hero Carousel */}
      <section className="hero-section">
        <div className="container-fluid p-0">
          <div
            id="carouselExampleRide"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
            data-bs-interval="5000"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleRide"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleRide"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="/images/slide1.jpg"
                  className="d-block w-100 carousel-image"
                  alt="Slide 1"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h2 className="carousel-title">Chợ Đồ Cũ Trực Tuyến</h2>
                  <p className="carousel-subtitle">
                    Mua bán đồ cũ chất lượng, giá tốt nhất
                  </p>
                  <Link to="/eco-market" className="btn btn-primary btn-lg me-3">
                    <i className="bi bi-compass me-2"></i>
                    Khám phá ngay
                  </Link>
                  <Link to="/eco-market/post-product" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-plus-circle me-2"></i>
                    Đăng tin
                  </Link>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="/images/slide2.jpg"
                  className="d-block w-100 carousel-image"
                  alt="Slide 2"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h2 className="carousel-title">Bán Đồ Cũ Dễ Dàng</h2>
                  <p className="carousel-subtitle">
                    Đăng tin miễn phí, bán nhanh chóng
                  </p>
                  <Link to="/eco-market/post-product" className="btn btn-success btn-lg me-3">
                    <i className="bi bi-camera me-2"></i>
                    Đăng tin ngay
                  </Link>
                  <Link to="/eco-market" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-search me-2"></i>
                    Tìm kiếm
                  </Link>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleRide"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleRide"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="container my-4">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
            <div className="flex-grow-1">
              <h6 className="mb-1">Đã xảy ra lỗi</h6>
              <div>{error}</div>
            </div>
            <button 
              className="btn btn-outline-danger btn-sm ms-3" 
              onClick={handleRetry}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <section className="categories-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Danh mục yêu thích</h2>
            <p className="section-subtitle">
              Khám phá hàng ngàn sản phẩm chất lượng được phân loại cẩn thận
            </p>
          </div>

          <div className="row justify-content-center">
            {/* Free Items Category */}
            <div className="col-lg-2 col-md-3 col-sm-4 col-6">
              <Link to="/eco-market?price=free" className="category-card-link">
                <div className="category-card">
                  <div className="category-icon">
                    <img
                      src="https://static.oreka.vn/d/_next/static/images/free-items-118b7d85f3dc69896f282b27ba4724a6.png"
                      alt="Đồ miễn phí"
                      className="category-image"
                    />
                    <div className="category-overlay">
                      <span className="explore-text">Khám phá</span>
                    </div>
                  </div>
                  <span className="category-name">Đồ miễn phí</span>
                </div>
              </Link>
            </div>

            {/* Dynamic Categories */}
            {categoriesLoading
              ? renderCategorySkeletons()
              : categories?.slice(0, 5).map((category, index) => (
                  <div key={category._id || index} className="col-lg-2 col-md-3 col-sm-4 col-6">
                    <CategoryCard category={category} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="products-section py-5">
        <div className="container">
          <div className="section-header d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="section-title mb-2">Sản phẩm mới đăng</h2>
              <p className="section-subtitle mb-0">Cập nhật liên tục mỗi ngày với những món đồ chất lượng</p>
            </div>
            <Link to="/eco-market" className="btn btn-outline-primary">
              <span>Xem tất cả</span>
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row">
            {productsLoading
              ? renderProductSkeletons()
              : products?.slice(0, 8).map((product, index) => (
                  <div key={product._id || index} className="col-lg-3 col-md-4 col-sm-6 col-12">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          {!productsLoading && products.length === 0 && (
            <div className="text-center py-5">
              <div className="empty-state">
                <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
                <h4 className="text-muted mb-2">Chưa có sản phẩm nào</h4>
                <p className="text-muted mb-4">Hãy quay lại sau để xem thêm sản phẩm mới!</p>
                <Link to="/eco-market/post-product" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đăng sản phẩm đầu tiên
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title text-white mb-3">Được tin tướng bởi hàng ngàn người dùng</h2>
            <p className="section-subtitle text-white opacity-75">Nền tảng mua bán đồ cũ hàng đầu Việt Nam</p>
          </div>
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-card">
                <i className="bi bi-people-fill stat-icon"></i>
                <h3 className="stat-number">10K+</h3>
                <p className="stat-label">Người dùng</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-card">
                <i className="bi bi-box-seam stat-icon"></i>
                <h3 className="stat-number">50K+</h3>
                <p className="stat-label">Sản phẩm</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-card">
                <i className="bi bi-check-circle-fill stat-icon"></i>
                <h3 className="stat-number">25K+</h3>
                <p className="stat-label">Đã bán</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-card">
                <i className="bi bi-star-fill stat-icon"></i>
                <h3 className="stat-number">4.8</h3>
                <p className="stat-label">Đánh giá</p>
              </div>
            </div>
          </div>
        </div>
                <CheckInModal
        show={showCheckInModal}
        onHide={() => setShowCheckInModal(false)}
      />
      </section>
    </div>
  );
};

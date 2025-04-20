import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import "./ProductList.css";
import FilterSidebar from "./FilterSidebar";
import SubCategoryContext from "../../contexts/SubCategoryContext";
import { useCategory } from "../../contexts/CategoryContext";
import { useProduct } from "../../contexts/ProductContext";
import { Skeleton, Empty } from "antd";
import {
  FaHome,
  FaChevronRight,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaEye,

} from "react-icons/fa";
import { BsFilterLeft } from "react-icons/bs";
import { formatPrice } from "../../utils/function";

function ProductList() {
  const { getCategory } = useCategory();
  const { getProductList } = useProduct();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [sortOption, setSortOption] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const categoryID = queryParams.get("categoryID");
  const subcategoryID = queryParams.get("subcategoryID");

  const sortProducts = useCallback((products, option) => {
    const sorted = [...products];
    switch (option) {
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return sorted;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (categoryID) {
          try {
            const categoryData = await getCategory(categoryID);
            setCategory(categoryData);
          } catch (catError) {
            console.error("Error fetching category:", catError);
          }
        }

        if (subcategoryID) {
          try {
            const subCategoryData = await SubCategoryContext.getSubCategory(
              subcategoryID
            );
            setSubCategory(subCategoryData.subcategory);
          } catch (subCatError) {
            console.error("Error fetching subcategory:", subCatError);
          }
        }

        try {
          const productsData = await getProductList(categoryID, subcategoryID);
          if (Array.isArray(productsData)) {
            setProducts(sortProducts(productsData, sortOption));
          } else {
            console.error("Expected array of products but got:", productsData);
            setProducts([]);
          }
        } catch (productError) {
          console.error("Error fetching products:", productError);
          setError("Không thể tải danh sách sản phẩm");
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    categoryID,
    subcategoryID,
    sortOption,
    getCategory,
    getProductList,
    sortProducts,
  ]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/eco-market/home" className="text-decoration-none">
                <FaHome className="me-1" />
                Trang chủ
              </Link>
            </li>
            <li className="breadcrumb-item">
              <FaChevronRight className="mx-1" size={12} />
              <Link to="/eco-market" className="text-decoration-none">
                Mua đồ cũ
              </Link>
            </li>
            {category?.name && (
              <li className="breadcrumb-item">
                <FaChevronRight className="mx-1" size={12} />
                <Link
                  to={`/eco-market?categoryID=${category._id}`}
                  className="text-decoration-none"
                >
                  {category.name}
                </Link>
              </li>
            )}
            {subCategory?.name && (
              <li className="breadcrumb-item active">
                <FaChevronRight className="mx-1" size={12} />
                {subCategory.name}
              </li>
            )}
          </ol>
        </nav>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="d-lg-none container mb-3">
        <button
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
          onClick={toggleMobileFilters}
        >
          <BsFilterLeft className="me-2" size={20} />
          Bộ lọc
        </button>
      </div>

      <div className="container pb-5">
        <div className="row">
          {/* Sidebar - Desktop */}
          <div
            className={`col-lg-3 d-none d-lg-block ${
              showMobileFilters ? "mobile-filter-show" : ""
            }`}
          >
            <FilterSidebar category={category} />
          </div>

          {/* Mobile Sidebar */}
          {showMobileFilters && (
            <div className="col-12 d-lg-none mb-4 mobile-filter-container">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Bộ lọc</h5>
                  <button
                    className="btn btn-sm btn-close"
                    onClick={toggleMobileFilters}
                  ></button>
                </div>
                <div className="card-body">
                  <FilterSidebar category={category} />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Page Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <h2 className="mb-3 mb-md-0">
                {subcategoryID ? (
                  <>
                    {subCategory?.name}{" "}
                    <span className="text-muted">(Đồ cũ)</span>
                  </>
                ) : (
                  <>
                    {category?.name} <span className="text-muted">(Đồ cũ)</span>
                  </>
                )}
              </h2>

              <div className="d-flex align-items-center">
                <span className="me-2 text-nowrap">Sắp xếp:</span>
                <select
                  className="form-select"
                  value={sortOption}
                  onChange={handleSortChange}
                  style={{ width: "auto" }}
                >
                  <option value="default">Mặc định</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="row">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-3 mb-4">
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <Empty
                  description="Không tìm thấy sản phẩm nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <div className="row">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="col-6 col-md-4 col-lg-3 mb-4"
                  >
                    <Link
                      to={{
                        pathname: `/eco-market/product`,
                        search: `?productID=${product._id}`,
                        state: { category },
                      }}
                      className="text-decoration-none text-dark h-100"
                    >
                      <div className="card product-card h-100">
                        <div className="product-image-container">
                          <img
                            src={
                              product.avatar || "/images/default-product.png"
                            }
                            className="card-img-top product-image"
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "/images/default-product.png";
                            }}
                            loading="lazy"
                          />
                          <div className="product-action">
                            <button className="btn btn-sm btn-light">
                              <FaShoppingCart />
                            </button>
                            <button className="btn btn-sm btn-light ms-2">
                              <FaEye />
                            </button>
                          </div>
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h5
                            className="card-title product-title"
                            title={product.name}
                          >
                            {product.name}
                          </h5>
                          <div className="mt-auto">
                            <div className="product-price text-danger fw-bold">
                              {formatPrice(product.price)}
                            </div>
                            <div className="product-location text-muted small mt-2 d-flex align-items-center">
                              <FaMapMarkerAlt className="me-1" />
                              {product.location || "Không xác định"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import "./ProductList";
import FilterSidebar from "./FilterSidebar";
import ProductContext from "../http/ProductContext";
import CategoryContext from "../http/CategoryContext";
import { Link } from "react-router-dom";
import SubCategoryContext from "../http/SubCategoryContext";

function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState({});
  const [subCategory, setSubCategory] = useState({});

  const [sortOption, setSortOption] = useState("Mặc định");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryID = queryParams.get("categoryID");
    const subcategoryID = queryParams.get("subcategoryID");

    const fetchCategory = async () => {
      try {
        const category = await CategoryContext.getCategory(categoryID);
        setCategory(category);
      } catch (err) {
        setError(err);
      }
    };

    const fetchSubCategory = async () => {
      try {
        const data = await SubCategoryContext.getSubCategory(subcategoryID);
        console.log(data);
        setCategory(data.category);

        setSubCategory(data.subcategory);
      } catch (err) {
        setError(err);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsData = await ProductContext.getProductList(
          categoryID,
          subcategoryID
        );

        setProducts(productsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (categoryID) {
      fetchCategory();
    }
    if (subcategoryID) {
      fetchSubCategory();
    }

    fetchProducts();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="h-100">
      <div className="container h-100">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb d-flex align-items-center mt-4">
            <li className="mx-1">
              <a
                href="/ecomarket/home"
                className="text-decoration-none text-black"
              >
                Trang chủ
              </a>
            </li>
            <li className="mx-1">
              <span>&nbsp;&gt;&nbsp;</span>
              <a href="#" className="text-decoration-none text-black">
                Mua đồ cũ
              </a>
            </li>
            <li className="breadcrumb-item  mx-1">
              <span>&nbsp;&gt;&nbsp;</span>
              <a
                href={`/ecomarket?categoryID=${category._id}`}
                className="text-decoration-none text-black"
              >
                {" "}
                {category?.name}
              </a>
            </li>
            {subCategory?.name && (
              <li className="mx-1 active" aria-current="page">
                <span>&nbsp;&gt;&nbsp;</span>

                {subCategory.name}
              </li>
            )}
          </ol>
        </nav>

        <div className="row mt-4">
          <div className="col-3">
            <FilterSidebar category={category} />
          </div>
          <div className="col-9 ">
            <div className="d-flex justify-content-between">
              {subCategory?.name ? (
                <h3>{subCategory?.name} cũ</h3>
              ) : (
                <h3>{category?.name} cũ</h3>
              )}

              <div className="d-flex align-items-center float-end">
                <span className="me-2">Lọc theo:</span>
                <select
                  className="form-select"
                  value={sortOption}
                  onChange={handleSortChange}
                  style={{ width: "auto" }}
                >
                  <option value="Mặc định">Mặc định</option>
                  <option value="Giá giảm dần">Giá giảm dần</option>
                  <option value="Giá tăng dần">Giá tăng dần</option>
                  <option value="Mới nhất">Mới nhất</option>
                </select>
              </div>
            </div>

            <div className="row mt-5">
              {products?.map((product, index) => (
                <div
                  key={index}
                  className="col-md-3 col-sm-6 col-12 card p-0 m-2"
                  style={{ width: "auto", height: "21rem" }}
                >
                  <Link
                    to={{
                      pathname: `/ecomarket/product`,
                      search: `?productID=${product._id}`,
                      state: { category },
                    }}
                    className="text-decoration-none text-dark"
                  >
                    <img
                      src={product?.avatar}
                      className="card-img-top"
                      alt={product?.name}
                      style={{
                        objectFit: "cover",
                        height: "200px",
                      }}
                    />
                    <div className="card-body">
                      <p className="card-text text-truncate mt-1">
                        {product?.name}
                      </p>
                      <h5 className="card-title">{product.price}đ</h5>
                      <p className="m-0 mt-3 text-end">
                        <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                        {product?.location}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductList;

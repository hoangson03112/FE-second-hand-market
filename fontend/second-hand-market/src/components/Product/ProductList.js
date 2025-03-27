import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./ProductList.css";
import FilterSidebar from "./FilterSidebar";
import ProductContext from "../../contexts/ProductContext";
import CategoryContext from "../../contexts/CategoryContext";
import { Link } from "react-router-dom";
import SubCategoryContext from "../../contexts/SubCategoryContext";

function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [sortOption, setSortOption] = useState("Mặc định");
  const queryParams = new URLSearchParams(location.search);
  const categoryID = queryParams.get("categoryID");
  const subcategoryID = queryParams.get("subcategoryID");
  useEffect(() => {
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
        // console.log(data);
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
  }, [categoryID, subcategoryID]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="h-100">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb d-flex align-items-center ">
            <li className="mx-1">
              <a
                href="/eco-market/home"
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
                href={`/eco-market?categoryID=${category._id}`}
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
              {subcategoryID ? (
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
                  style={{ width: "200px", height: "21rem" }}
                >
                  <Link
                    to={{
                      pathname: `/eco-market/product`,
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
                        objectFit: "object-cover",
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
    </div>
  );
}

export default ProductList;

import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import CategoryContext from "../DBContext/CategoryContext";
import "./Header.css";
const Header = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await CategoryContext.getCatgories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-while p-0">
        <div className="container d-flex justify-content-evenly h-25">
          <a className="navbar-brand" href="/">
            <Image
              src="/images/logi.png"
              alt="Logo"
              className="ms-5"
              height={"120px"}
              width={"170px"}
            />
          </a>
          <div className="input-group-password w-25">
            <input
              type="text"
              className="form-control bg-body-secondary border-end-0 rounded-5 border-danger"
              placeholder="Tìm Kiếm Sản Phẩm"
              aria-label="Tìm Kiếm Sản Phẩm"
              aria-describedby="basic-addon1"
            />
            <i className="bi bi-search input-icon" id="basic-addon1"></i>
          </div>

          <div id="navbarNav" className="ms-5">
            <nav className="nav nav-pills flex-column flex-sm-row ">
              <a
                id=""
                className="text-black flex-sm-fill text-sm-center nav-link ms-2"
                href="/ecomarket/register"
              >
                Đăng ký
              </a>
              <a
                className="flex-sm-fill text-sm-center nav-link text-black mx-2"
                href="/ecomarket/login"
              >
                Đăng nhập
              </a>
              <a
                className="gradient-custom-2 flex-sm-fill ms-3 text-sm-center nav-link active px-5"
                href="/"
              >
                Đăng Bán
              </a>
            </nav>
          </div>
        </div>
      </nav>
      <hr className="mt-0" />
      <div className="d-flex justify-content-center mb-1">
        <nav className="nav ">
          <div className="dropdown">
            <span className="nav-link pt-0">
              <i className="fs-4 bi bi-list text-black"></i>
            </span>
            <ul className="dropdown-menu">
              {categories?.map((category, index) => (
                <li key={index} className="dropdown-submenu">
                  <a
                    className="dropdown-item dropdown-toggle"
                    href={`/ecomarket?categoryID=${category._id}`}
                  >
                    {category.name}
                  </a>
                  <ul className="dropdown-menu">
                    {category.subcategories?.map((subcategory, index) => {
                      return (
                        <li key={index}>
                          <a
                            className="dropdown-item"
                            href={`?subcategoryID=${subcategory._id}`}
                          >
                            {subcategory?.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {categories?.map((category, index) => (
            <div key={index} className="dropdown">
              <a
                className="nav-link ps-2 text-black d-flex align-items-center"
                href={`/ecomarket?categoryID=${category._id}`}
              >
                {category.name}
              </a>
              <ul className="dropdown-menu ">
                {category.subcategories?.map((subcategory, index) => {
                  return (
                    <li key={index}>
                      <a
                        className="dropdown-item"
                        href={`?subcategoryID=${subcategory._id}`}
                      >
                        {subcategory?.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <hr className="m-0" />
    </div>
  );
};

export default Header;

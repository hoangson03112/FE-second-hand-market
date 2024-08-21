import axios from "axios";
import * as React from "react";
import { useEffect } from "react";
import { Image } from "react-bootstrap";

const Header = React.memo((props) => {
  useEffect(() => {
    axios
      .get("http://localhost:2000/ecomarket/categories")
      .then((response) => {
        console.log("Data received:", response.data.data);
        props.setCategories(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get("http://localhost:2000/ecomarket/subcategory")
      .then((response) => {
        console.log("Data received:", response.data.data);
        props.setSubcategory(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand-lg  navbar-light bg-while p-0">
        <div className="container d-flex justify-content-center h-25%">
          <a className="navbar-brand" href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="ms-5"
              height={"100px"}
              width={"140px"}
            />
          </a>
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control bg-body-secondary custom-focus border-end-0"
              placeholder="Tìm Kiếm Sản Phẩm"
              aria-label="Tìm Kiếm Sản Phẩm"
              aria-describedby="basic-addon1"
            />
            <span
              className="input-group-text bg-body-secondary border-start-0 pe-2"
              id="basic-addon1"
            >
              <i className="bi bi-search"></i>
            </span>
          </div>

          <div id="navbarNav" className="ms-5">
            <nav className="nav nav-pills flex-column flex-sm-row ">
              <a
                id=""
                className=" text-black flex-sm-fill text-sm-center nav-link"
                href="/"
              >
                Đăng ký
              </a>
              <a
                className="flex-sm-fill text-sm-center nav-link text-black"
                href="/"
              >
                Đăng nhập
              </a>
              <a
                className="forSale flex-sm-fill text-sm-center nav-link active px-5"
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
            <a className="nav-link pt-0" href="#">
              <i className="fs-4 bi bi-list text-black"></i>
            </a>
            <ul className="dropdown-menu">
              {props.categories.map((category, index) => (
                <li key={index} className="dropdown-submenu">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    {category.name}
                  </a>
                  <ul className="dropdown-menu">
                    {props.subcategory.map((subcategory, index) => {
                      if (subcategory.cateID === category?._id) {
                        return (
                          <li key={index}>
                            <a className="dropdown-item" href="#">
                              {subcategory?.name}
                            </a>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {props.categories.map((category, index) => (
            <div key={index} className="dropdown">
              <a
                className="nav-link  ps-2 text-black d-flex align-items-center"
                href="/"
              >
                {category.name}
              </a>
              <ul className="dropdown-menu ">
                {props.subcategory.map((subcategory, index) => {
                  if (subcategory.cateID === category?._id) {
                    return (
                      <li key={index}>
                        <a className="dropdown-item" href="#">
                          {subcategory?.name}
                        </a>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
});

export default Header;

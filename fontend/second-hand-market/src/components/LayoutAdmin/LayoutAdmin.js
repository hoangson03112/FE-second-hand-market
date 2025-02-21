import React, { useState, useEffect } from "react";
import "../../css/admin.css";
import "../../css/admin-responsive.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBandAid } from "@fortawesome/free-solid-svg-icons";
import { Image } from 'react-bootstrap';

const LayoutAdmin = ({ children }) => {
  const [showSideBar, setShowSideBar] = useState(false);
  const role = [
    {
      ROLE_USER: [
        "/clean-food/home",
        "/clean-food/products-list",
        "/clean-food/login",
        "/clean-food/register",
        "/clean-food/AccessInvalid",
      ],
      ROLE_ADMIN: [
        "/clean-food/home",
        "/clean-food/products-list",
        "/clean-food/login",
        "/clean-food/register",
        "/clean-food/AccessInvalid",
        "/clean-food/admin",
        "/clean-food/manager-products",
        "/clean-food/manager-customer",
        "/clean-food/manager-orders",
        "/clean-food/manager-brands",
        "/clean-food/manager-categories",
        "/clean-food/manager-images",
      ],
    },
  ];
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userID");
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const role = localStorage.getItem("role");
    if (role === "ROLE_USER") {
      window.location.href = "/clean-food/AccessInvalid";
    }

    if (token) {
      // localStorage.removeItem("role");
      if (!token) {
        return;
      }
    }
  }, []);


  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowSideBar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShowSideBar = () => setShowSideBar((prev) => !prev);

  return (
    <div>
      <header className="header-admin">
        <button className="menu-icon-btn" onClick={handleShowSideBar}>
          <div className="menu-icon">
            <i className="bi bi-list"></i>
          </div>
        </button>
      </header>
      <div className="d-flex">
        <aside className={`sidebar-admin ${showSideBar ? "show" : ""}`}>
          <div className="top-sidebar">
          <Image
              src="/images/logi.png"
              alt="Logo"
              className="ms-5"
              height={"120px"}
              width={"150px"}
            />
          </div>
          <div class="middle-sidebar">
            <ul class="sidebar-list">
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/admin" && "active"
                }`}
              >
                <Link to="/clean-food/admin" className="sidebar-link">
                  <div class="sidebar-icon">
                    <i class="bi bi-house-door"></i>
                  </div>
                  <div class="hidden-sidebar">Trang tổng quan</div>
                </Link>
              </li>
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/manager-brands" && "active"
                }`}
              >
                <Link to="/clean-food/manager-brands" className="sidebar-link">
                  <div class="sidebar-icon">
                    <FontAwesomeIcon icon={faBandAid} />
                  </div>
                  <div class="hidden-sidebar">Thương hiệu</div>
                </Link>
              </li>
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/manager-categories" &&
                  "active"
                }`}
              >
                <Link
                  to="/clean-food/manager-categories"
                  className="sidebar-link"
                >
                  <div class="sidebar-icon">
                    <i class="bi bi-card-list"></i>
                  </div>
                  <div class="hidden-sidebar">Doanh mục</div>
                </Link>
              </li>
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/manager-products" &&
                  "active"
                }`}
              >
                <Link
                  to="/clean-food/manager-products"
                  className="sidebar-link"
                >
                  <div className="sidebar-icon">
                    <i className="bi bi-cup-hot"></i>
                  </div>
                  <div className="hidden-sidebar">Sản phẩm</div>
                </Link>
              </li>
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/manager-customer" &&
                  "active"
                }`}
              >
                <Link
                  to="/clean-food/manager-customer"
                  className="sidebar-link"
                >
                  <div className="sidebar-icon">
                    <i class="bi bi-people"></i>
                  </div>
                  <div class="hidden-sidebar">Khách hàng</div>
                </Link>
              </li>
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/manager-orders" && "active"
                }`}
              >
                <Link to="/clean-food/manager-orders" className="sidebar-link">
                  <div className="sidebar-icon">
                    <i class="bi bi-basket2"></i>
                  </div>
                  <div class="hidden-sidebar">Đơn hàng</div>
                </Link>
              </li>
              <li
                className={`sidebar-list-item tab-content ${
                  location.pathname === "/clean-food/manager-images" && "active"
                }`}
              >
                <Link to="/clean-food/manager-images" className="sidebar-link">
                  <div className="sidebar-icon">
                    <i class="bi bi-card-image"></i>
                  </div>
                  <div class="hidden-sidebar">Hình ảnh</div>
                </Link>
              </li>
            </ul>
            <ul class="sidebar-list">
              <li class="sidebar-list-item user-logout">
                <Link to="/clean-food/home" className="sidebar-link">
                  <div className="sidebar-icon">
                    <i class="bi bi-arrow-left-circle"></i>
                  </div>
                  <div class="hidden-sidebar">Trang chủ</div>
                </Link>
              </li>

              <li class="sidebar-list-item user-logout">
                <span
                  class="sidebar-link"
                  id="logout-acc"
                  onClick={handleLogout}
                >
                  <div class="sidebar-icon">
                    <i class="bi bi-box-arrow-right"></i>
                  </div>
                  <div class="hidden-sidebar">Đăng xuất</div>
                </span>
              </li>
            </ul>
          </div>
          <div class="bottom-sidebar"></div>
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default LayoutAdmin;

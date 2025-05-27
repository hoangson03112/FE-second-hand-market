import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import AccountContext from "../../../contexts/AccountContext";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import emitter from "../../../utils/mitt";
import { useCategory } from "../../../contexts/CategoryContext";
const Header = () => {
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState([]);
  const [account, setAccount] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleDropdownToggle = () => setShowDropdown(!showDropdown);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/eco-market/home");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/eco-market?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data) {
          setAccount(data.data.account);
        }
      } catch (error) {
        localStorage.clear();
        console.error("Error fetching", error);
      }
    };
    checkAuthentication();
    emitter.on("CART_UPDATED", checkAuthentication);
    return () => {
      emitter.off("CART_UPDATED", checkAuthentication);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();

        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-while p-0">
        <div className="container d-flex justify-content-evenly h-25">
          <Link className="navbar-brand" to="/">
            <Image
              src="/images/logi.png"
              alt="Logo"
              className="ms-5"
              height={"120px"}
              width={"170px"}
            />
          </Link>
          <div className="modern-search-container w-25">
            <form onSubmit={handleSearch} className="modern-search-form">
              <div className="search-box">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="clear-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
                <button type="submit" className="search-submit-btn">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>

          <div id="navbarNav" className="ms-5 ">
            <nav className="nav nav-pills d-flex justify-content-evenly">
              <Link
                className="gradient-custom-2 flex-sm-fill  text-center nav-link active px-5"
                to="/eco-market/seller/products/new"
              >
                Đăng Bán
              </Link>
              {Object.keys(account).length > 0 ? (
                <div className="d-flex align-items-center  ">
                  {/* Notification Icon */}
                  <div
                    className="position-relative mx-3"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <button
                      className="notification-icon-btn"
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        border: "none",
                        background: "transparent",
                      }}
                    >
                      <i className="bi bi-bell-fill fs-4 text-dark"></i>
                    </button>

                    <sup
                      className="notification-badge"
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        backgroundColor: "#ff4757",
                        color: "white",
                        borderRadius: "50%",
                        padding: "0.3rem 0.4rem",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      3
                    </sup>
                  </div>

                  {/* Cart Icon */}
                  <div
                    className="position-relative mx-3"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <Link
                      to="/eco-market/my-cart"
                      style={{ textDecoration: "none" }}
                    >
                      <i
                        className="bi bi-bag-heart-fill fs-4 rounded-circle text-center cart shadow text-dark"
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </Link>

                    <sup
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "0.6rem 0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      {account.cart.length}
                    </sup>
                  </div>

                  <div className="d-inline-block ms-2">
                    <div
                      className="d-flex align-items-center text-decoration-none"
                      onClick={handleDropdownToggle}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          account?.avatar ||
                          "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                        }
                        alt="User"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                        className="me-2"
                      />
                      <span>{account?.fullName}</span>
                    </div>
                    {showDropdown && (
                      <div className="dropdown-menu show mt-2">
                        <Link
                          className="dropdown-item"
                          to="/eco-market/user/profile"
                        >
                          Hồ sơ
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="/eco-market/customer/orders"
                        >
                          Đơn Hàng
                        </Link>
                        {account?.role === "admin" && (
                          <Link
                            className="dropdown-item"
                            to="/eco-market/admin"
                          >
                            Admin
                          </Link>
                        )}
                        <span className="dropdown-item" onClick={handleLogout}>
                          Đăng xuất
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  className="flex-sm-fill text-sm-center shadow nav-link text-black mx-4"
                  to="/eco-market/login"
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
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
                  <Link
                    className="dropdown-item dropdown-toggle"
                    to={`/eco-market?categoryID=${category._id}`}
                  >
                    {category.name}
                  </Link>
                  <ul className="dropdown-menu">
                    {category.subcategories
                      .filter((subcate) => subcate.status === "active")
                      ?.map((subcategory, index) => {
                        return (
                          <li key={index}>
                            <Link
                              className="dropdown-item"
                              to={`/eco-market?subcategoryID=${subcategory._id}`}
                            >
                              {subcategory?.name}
                            </Link>
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
              <Link
                className="nav-link ps-2 text-black d-flex align-items-center"
                to={`/eco-market?categoryID=${category._id}`}
              >
                {category.name}
              </Link>
              <ul className="dropdown-menu ">
                {category.subcategories
                  .filter((subcate) => subcate.status === "active")
                  ?.map((subcategory, index) => {
                    return (
                      <li key={index}>
                        <Link
                          className="dropdown-item"
                          to={`/eco-market?subcategoryID=${subcategory._id}`}
                        >
                          {subcategory?.name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <hr className="m-0" />
    </>
  );
};

export default Header;

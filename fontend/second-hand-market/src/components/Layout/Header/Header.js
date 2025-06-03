import React, { useEffect, useState, useRef } from "react";
import { Image } from "react-bootstrap";
import AccountContext from "../../../contexts/AccountContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import emitter from "../../../utils/mitt";
import { useCategory } from "../../../contexts/CategoryContext";
import SearchBar from "../../common/Input";

const Header = () => {
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState([]);
  const [account, setAccount] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

          <div className={`${styles.modernSearchContainer} w-25`}>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div id="navbarNav" className="">
            <nav className="nav nav-pills d-flex justify-content-evenly align-items-center">

              <Link

                className={`${styles.sellButton} flex-sm-fill text-center nav-link px-4 py-2`}


                to="/eco-market/seller/products/new"
              >
                <i className="bi bi-plus-circle-fill me-2"></i>
                <span className={styles.sellText}>Đăng Bán</span>
              </Link>



              {Object.keys(account).length > 0 ? (
                <div className="d-flex align-items-center">
                  {/* Notification Icon */}
                  <div className={`${styles.iconContainer} position-relative`}>
                    <button className={styles.notificationBtn}>
                      <i className="bi bi-bell-fill"></i>
                      <span className={styles.badge}>3</span>
                    </button>
                  </div>

                  {/* Cart Icon */}
                  <div className={`${styles.iconContainer} position-relative`}>
                    <Link to="/eco-market/my-cart" className={styles.cartBtn}>
                      <i className="bi bi-bag-heart-fill"></i>
                      <span className={styles.badge}>{account.cart?.length || 0}</span>
                    </Link>
                  </div>

                  {/* User Profile */}
                  <div className={`${styles.userProfile} d-inline-block`} ref={dropdownRef}>
                    <div
                      className={styles.profileToggle}
                      onClick={handleDropdownToggle}
                    >
                      <img
                        src={
                          account?.avatar ||
                          "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                        }
                        alt="User"
                        className={styles.avatar}
                      />
                      <span className={styles.userName}>{account?.fullName}</span>
                      <i className={`bi bi-chevron-down ${styles.chevron}`}></i>
                    </div>

                    {showDropdown && (
                      <div className={`${styles.dropdownMenu} dropdown-menu show mt-2`}>
                        <Link className="dropdown-item" to="/eco-market/user/profile">
                          <i className="bi bi-person me-2"></i>Hồ sơ
                        </Link>
                        <Link className="dropdown-item" to="/eco-market/customer/orders">
                          <i className="bi bi-box-seam me-2"></i>Đơn Hàng
                        </Link>
                        {account?.role === "admin" && (
                          <Link className="dropdown-item" to="/eco-market/admin">
                            <i className="bi bi-gear me-2"></i>Admin
                          </Link>
                        )}
                        <span className="dropdown-item" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  className={`${styles.loginButton} flex-sm-fill text-sm-center nav-link mx-4`}
                  to="/eco-market/login"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span>Đăng nhập / Đăng ký</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </nav>

      <hr className="mt-0" />

      <div className="d-flex justify-content-center mb-1">
        <nav className="nav">
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
            </div>
          ))}
        </nav>
      </div>

      <hr className="m-0" />
    </>
  );
};

export default Header;
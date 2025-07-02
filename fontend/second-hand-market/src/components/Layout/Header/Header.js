import React, { useEffect, useState, useRef } from "react";
import { Image } from "react-bootstrap";
import AccountContext from "../../../contexts/AccountContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import emitter from "../../../utils/mitt";
import { useCategory } from "../../../contexts/CategoryContext";
import SearchBar from "../../common/Input";
import { Menu, MenuItem } from "@mui/material";

const Header = React.forwardRef((props, ref) => {
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState([]);
  const [account, setAccount] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Notification state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Bạn có lời mời kết bạn mới.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: 2,
      message: 'Dự án "ABC" đã được cập nhật.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: 3,
      message: "Sếp đã duyệt yêu cầu nghỉ phép của bạn.",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000),
      read: true,
    },
    {
      id: 4,
      message: "Nhắc nhở: Cuộc họp vào lúc 10h sáng.",
      timestamp: new Date(Date.now() - 24 * 3600 * 1000),
      read: true,
    },
    {
      id: 5,
      message: "Bạn có 2 tin nhắn chưa đọc.",
      timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      read: false,
    },
    {
      id: 6,
      message: 'Bạn đã đạt được huy hiệu "Người giải quyết vấn đề"!',
      timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      read: true,
    },
  ]);

  const navigate = useNavigate();

  // Notification menu handlers
  const handleOpenMenu = (event) => {
    if (!anchorEl) setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setNotifications((prev) => prev.map((noti) => ({ ...noti, read: true })));
  };
  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((noti) => (noti.id === id ? { ...noti, read: true } : noti))
    );
    handleCloseMenu();
  };

  // User dropdown
  const handleDropdownToggle = () => setShowDropdown((v) => !v);
  const handleMobileMenuToggle = () => setShowMobileMenu((v) => !v);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/eco-market/home");
    window.location.reload();
  };

  // Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/eco-market?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch account info
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data) setAccount(data.data.account);
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

  // Fetch categories
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format time ago
  function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 172800) return `Hôm qua`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  }
  return (
    <div className={styles.fixedHeaderWrapper} ref={ref}>
      <nav className="navbar navbar-expand-lg navbar-light bg-while p-0">
        <div className="container d-flex h-25">
          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuBtn} d-lg-none`}
            onClick={handleMobileMenuToggle}
          >
            <i className="bi bi-list"></i>
          </button>

          <Link className="navbar-brand" to="/">
            <Image
              src="/images/logi.png"
              alt="Logo"
              className={styles.logo}
              height={"120px"}
              width={"170px"}
            />
          </Link>

          <div className={`${styles.modernSearchContainer}`}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <div
            className={`${styles.desktopNav} d-none d-lg-flex`}
            id="navbarNav"
          >
            <nav className="nav nav-pills d-flex justify-content-evenly align-items-center">
              <Link
                className={`${styles.sellButton} flex-sm-fill text-center nav-link px-4 py-2`}
                to={
                  !account || Object.keys(account).length === 0
                    ? "/eco-market/login"
                    : account?.role === "buyer"
                    ? "/eco-market/seller/register"
                    : "/eco-market/seller/products/create"
                }
              >
                <i className="bi bi-plus-circle-fill me-2 text-white"></i>
                <span className={styles.sellText} style={{ color: "white" }}>
                  Đăng Bán
                </span>
              </Link>

              {/* Notification Icon & Menu */}
              <div className={`${styles.iconContainer} position-relative ms-4`}>
                <button
                  className={`${styles.notificationBtn} ${
                    open ? styles.active : ""
                  }`}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleOpenMenu}
                  style={
                    open
                      ? { outline: "2px solid #344960", outlineOffset: 2 }
                      : {}
                  }
                >
                  <i className="bi bi-bell-fill"></i>
                  {account && Object.keys(account).length > 0 && (
                    <span className={styles.badge}>{notifications.length}</span>
                  )}
                </button>
                <Menu
                  disableScrollLock={true}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                      style: { minWidth: 340, padding: 0 },
                    },
                  }}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    style: {
                      borderRadius: 14,
                      boxShadow: "0 8px 32px rgba(60,72,100,0.18)",
                      marginTop: 8,
                      padding: 0,
                      overflow: "hidden",
                      background: "#fff",
                    },
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#344960",
                      padding: "16px 24px 12px 24px",
                      borderBottom: "1px solid #f0f0f0",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <i
                      className="bi bi-bell-fill"
                      style={{ color: "#ff6b6b", fontSize: 20 }}
                    ></i>
                    Thông báo
                  </div>
                  {!account || Object.keys(account).length === 0 ? (
                    <MenuItem
                      style={{
                        justifyContent: "center",
                        padding: "32px 20px",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "#fff",
                      }}
                      disabled
                    >
                      <i
                        className="bi bi-exclamation-triangle-fill"
                        style={{
                          color: "#ff9800",
                          fontSize: 32,
                          marginBottom: 8,
                        }}
                      ></i>
                      <div
                        style={{
                          color: "#344960",
                          fontWeight: 500,
                          fontSize: 15,
                          marginBottom: 10,
                          textAlign: "center",
                        }}
                      >
                        Bạn chưa đăng nhập
                        <br />
                        Vui lòng đăng nhập để xem thông báo
                      </div>
                      <Link
                        to="/eco-market/login"
                        style={{
                          padding: "7px 22px",
                          background: "#344960",
                          color: "#fff",
                          border: "none",
                          borderRadius: 7,
                          cursor: "pointer",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 15,
                          boxShadow: "none",
                          marginTop: 4,
                        }}
                        onClick={handleCloseMenu}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#344960";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#344960";
                          e.currentTarget.style.color = "#fff";
                        }}
                      >
                        Đăng nhập
                      </Link>
                    </MenuItem>
                  ) : notifications.length === 0 ? (
                    <MenuItem
                      disabled
                      style={{
                        justifyContent: "center",
                        padding: "32px 20px",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "#fff",
                      }}
                    >
                      <i
                        className="bi bi-bell-slash"
                        style={{ color: "#bbb", fontSize: 32, marginBottom: 8 }}
                      ></i>
                      <div
                        style={{
                          color: "#888",
                          fontWeight: 500,
                          fontSize: 15,
                          textAlign: "center",
                        }}
                      >
                        Không có thông báo mới
                      </div>
                    </MenuItem>
                  ) : (
                    notifications.map((noti, idx) => (
                      <MenuItem
                        key={noti.id}
                        onClick={() => handleNotificationClick(noti.id)}
                        style={{
                          alignItems: "flex-start",
                          gap: 14,
                          padding: "16px 24px",
                          borderBottom:
                            idx === notifications.length - 1
                              ? "none"
                              : "1px solid #f5f5f5",
                          whiteSpace: "normal",
                          background: noti.read ? "#fff" : "#f0f4ff",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#f5f7fa")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = noti.read
                            ? "#fff"
                            : "#f0f4ff")
                        }
                      >
                        <span
                          style={{
                            color: noti.read ? "#bbb" : "#ff6b6b",
                            marginTop: 2,
                          }}
                        >
                          <i className="bi bi-bell-fill"></i>
                        </span>
                        <span style={{ color: "#344960", fontSize: 15 }}>
                          <span
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {noti.message}
                            <span
                              style={{
                                color: "#888",
                                fontSize: 12,
                                marginTop: 2,
                              }}
                            >
                              {timeAgo(noti.timestamp)}
                            </span>
                          </span>
                        </span>
                      </MenuItem>
                    ))
                  )}
                </Menu>
              </div>

              {/* Cart Icon */}
              {account && Object.keys(account).length > 0 && (
                <div className={`${styles.iconContainer} position-relative`}>
                  <Link to="/eco-market/my-cart" className={styles.cartBtn}>
                    <i className="bi bi-bag-heart-fill"></i>
                    <span className={styles.badge}>
                      {account.cart?.length || 0}
                    </span>
                  </Link>
                </div>
              )}

              {/* User Profile Dropdown */}
              {account && Object.keys(account).length > 0 ? (
                <div className="d-flex align-items-center">
                  <div
                    className={`${styles.userProfile} d-inline-block`}
                    ref={dropdownRef}
                  >
                    <div
                      className={styles.profileToggle}
                      onClick={handleDropdownToggle}
                    >
                      <img
                        src={
                          account?.avatar?.url ||
                          "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                        }
                        alt="User"
                        className={styles.avatar}
                      />
                      <span className={styles.userName}>
                        {account?.fullName}
                      </span>
                      <i className={`bi bi-chevron-down ${styles.chevron}`}></i>
                    </div>
                    {showDropdown && (
                      <div
                        className={`${styles.dropdownMenu} dropdown-menu show mt-2`}
                      >
                        <Link
                          className="dropdown-item"
                          to="/eco-market/user/profile"
                        >
                          <i className="bi bi-person me-2"></i>Hồ sơ
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="/eco-market/customer/orders"
                        >
                          <i className="bi bi-box-seam me-2"></i>Đơn Hàng
                        </Link>
                             {account?.role === "seller" && (
                          <Link className="dropdown-item" to="/eco-market/seller">
                           <i className="bi bi-shop me-2"></i>Gian Hàng
                        </Link>
                              )}

                        {account?.role === "admin" && (
                          <Link
                            className="dropdown-item"
                            to="/eco-market/admin"
                          >
                            <i className="bi bi-gear me-2"></i>Admin
                          </Link>
                        )}
                        <Link className="dropdown-item" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>Đăng
                          xuất
                        </Link>
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

          {/* Mobile Navigation */}
          <div
            className={`${styles.mobileNav} d-lg-none ${
              showMobileMenu ? styles.show : ""
            }`}
          >
            {/* Search in Mobile Menu */}
            <div className={styles.mobileSearchContainer}>
              <SearchBar onSearch={handleSearch} />
            </div>

            <nav className="nav flex-column">
              {/* Categories Section */}
              <div className={styles.mobileCategorySection}>
                <div className={styles.mobileSectionTitle}>
                  <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                  Danh mục
                </div>
                {categories?.slice(0, 4).map((category) => (
                  <Link
                    key={category._id}
                    className={`${styles.mobileNavLink} ${styles.mobileCategoryLink} nav-link`}
                    to={`/eco-market?categoryID=${category._id}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="bi bi-tag me-2"></i>
                    {category.name}
                  </Link>
                ))}
                <Link
                  className={`${styles.mobileNavLink} ${styles.viewAllCategories} nav-link`}
                  to="/eco-market"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="bi bi-grid me-2"></i>
                  Xem tất cả danh mục
                </Link>
              </div>

              {/* Main Actions */}
              <Link
                className={`${styles.mobileNavLink} nav-link`}
                to={
                  !account || Object.keys(account).length === 0
                    ? "/eco-market/login"
                    : account?.role === "buyer"
                    ? "/eco-market/seller/register"
                    : "/eco-market/seller/products/create"
                }
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="bi bi-plus-circle-fill me-2"></i>
                Đăng Bán
              </Link>

              {account && Object.keys(account).length > 0 && (
                <Link
                  to="/eco-market/my-cart"
                  className={`${styles.mobileNavLink} nav-link`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="bi bi-bag-heart-fill me-2"></i>
                  Giỏ hàng ({account.cart?.length || 0})
                </Link>
              )}

              {account && Object.keys(account).length > 0 ? (
                <>
                  <Link
                    className={`${styles.mobileNavLink} nav-link`}
                    to="/eco-market/user/profile"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="bi bi-person me-2"></i>Hồ sơ
                  </Link>
                  <Link
                    className={`${styles.mobileNavLink} nav-link`}
                    to="/eco-market/customer/orders"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="bi bi-box-seam me-2"></i>Đơn Hàng
                  </Link>
                  {account?.role === "admin" && (
                    <Link
                      className={`${styles.mobileNavLink} nav-link`}
                      to="/eco-market/admin"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="bi bi-gear me-2"></i>Admin
                    </Link>
                  )}
                  <button
                    className={`${styles.mobileNavLink} nav-link`}
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  className={`${styles.mobileNavLink} nav-link`}
                  to="/eco-market/login"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </nav>
          </div>
        </div>
      </nav>
      {/* Category Navigation */}
      <div>
        <div className="d-flex justify-content-center mb-1">
          <nav className="nav">
            <div className="dropdown">
              <span className="nav-link pt-0">
                <i className="fs-4 bi bi-list text-black"></i>
              </span>
              <ul className="dropdown-menu">
                {categories?.map((category, index) => (
                  <li key={category._id || index} className="dropdown-submenu">
                    <Link
                      className="dropdown-item dropdown-toggle"
                      to={`/eco-market?categoryID=${category._id}`}
                    >
                      {category.name}
                    </Link>
                    <ul className="dropdown-menu">
                      {category.subcategories
                        .filter((subcate) => subcate.status === "active")
                        ?.map((subcategory) => (
                          <li key={subcategory._id}>
                            <Link
                              className="dropdown-item"
                              to={`/eco-market?subcategoryID=${subcategory._id}`}
                            >
                              {subcategory?.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            {categories?.map((category) => (
              <div key={category._id} className="dropdown">
                <Link
                  className="nav-link ps-2 text-black d-flex align-items-center"
                  to={`/eco-market?categoryID=${category._id}`}
                >
                  {category.name}
                </Link>
                <ul className="dropdown-menu">
                  {category.subcategories
                    .filter((subcate) => subcate.status === "active")
                    ?.map((subcategory) => (
                      <li key={subcategory._id}>
                        <Link
                          className="dropdown-item"
                          to={`/eco-market?subcategoryID=${subcategory._id}`}
                        >
                          {subcategory?.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <hr className="m-0" />
      </div>
    </div>
  );
});

export default Header;

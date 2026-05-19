import React, { useEffect, useState, useRef, forwardRef } from "react";
import { Image } from "react-bootstrap";
import AccountContext from "../../../contexts/AccountContext";
import { Link, useNavigate } from "react-router-dom";
import { useCategory } from "../../../contexts/CategoryContext";
import { useCart } from "../../../contexts/CartContext";
import SearchBar from "../../common/Input";
import { NotificationMenu } from "./components/NotificationMenu";
import { UserDropdown } from "./components/UserDropdown";
import { MobileMenu } from "./components/MobileMenu";
import { Account, Category, HeaderNotification } from "./types/Header.types";

interface HeaderProps {}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const { getCategories } = useCategory() as any;
  const { cart } = useCart() as any;
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [account, setAccount] = useState<Account>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([
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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);

  // Handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!anchorEl) setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setNotifications((prev) => prev.map((noti) => ({ ...noti, read: true })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((noti) => (noti.id === id ? { ...noti, read: true } : noti))
    );
    handleCloseMenu();
  };

  const handleDropdownToggle = () => setShowDropdown((v) => !v);
  const handleMobileMenuToggle = () => setShowMobileMenu((v) => !v);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/eco-market/home");
    window.location.reload();
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/eco-market?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const timeAgo = (date: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 172800) return `Hôm qua`;
    return `${Math.floor(diff / 86400)} ngày trước`;
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
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [getCategories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[1050] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]" ref={ref}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white p-0">
        <div className="container flex h-25">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden border-0 bg-transparent text-2xl text-[#344960] cursor-pointer p-2.5 rounded-lg transition-all duration-300 mr-2.5 hover:bg-[#344960]/10 hover:scale-110"
            onClick={handleMobileMenuToggle}
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <Image
              src="/images/logi.png"
              alt="Logo"
              className="transition-all duration-300 h-[120px] w-[170px] xl:h-[120px] xl:w-[170px] lg:h-[100px] lg:w-[140px] md:h-[90px] md:w-[120px] md:ml-5 sm:h-[80px] sm:w-[100px]"
              height={120}
              width={170}
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="relative flex-1 max-w-2xl mx-4 hidden md:block xl:w-auto lg:w-[40%] md:w-[50%]">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-end" id="navbarNav">
            <nav className="nav nav-pills flex justify-evenly items-center">
              {/* Sell Button */}
              <Link
                className="bg-[#344960] text-white border-0 rounded-[25px] font-semibold text-sm transition-all duration-300 shadow-md no-underline flex items-center justify-center min-w-[120px] whitespace-nowrap px-4 py-2 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(102,126,234,0.4)] hover:brightness-110 focus:outline focus:outline-2 focus:outline-[#344960] focus:outline-offset-2"
                to={
                  !account || Object.keys(account).length === 0
                    ? "/eco-market/login"
                    : account?.role === "buyer"
                    ? "/eco-market/seller/register"
                    : "/eco-market/seller/products/create"
                }
              >
                <i className="bi bi-plus-circle-fill me-2 text-white"></i>
                <span className="text-sm font-semibold xl:inline lg:hidden">Đăng Bán</span>
              </Link>

              {/* Notification Icon */}
              <div className="w-12 h-12 flex items-center justify-center mx-3.5 relative">
                <button
                  className={`relative w-full h-full border-0 bg-white/90 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-[10px] border-2 border-white/20 shadow-sm hover:bg-gradient-to-br hover:from-[#344960] hover:to-[#667eea] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_25px_rgba(102,126,234,0.3)] focus:outline focus:outline-2 focus:outline-[#344960] focus:outline-offset-2 group ${
                    open ? "outline outline-2 outline-[#344960] outline-offset-2" : ""
                  }`}
                  onClick={handleOpenMenu}
                >
                  <i className="bi bi-bell-fill text-xl text-[#344960] transition-colors group-hover:text-white"></i>
                  {account && Object.keys(account).length > 0 && (
                    <span className="absolute -top-2 -right-2 text-white rounded-full min-w-[22px] h-[22px] text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-md animate-[pulseNotification_2s_infinite] bg-red-500">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <NotificationMenu
                  anchorEl={anchorEl}
                  open={open}
                  account={account}
                  notifications={notifications}
                  onClose={handleCloseMenu}
                  onNotificationClick={handleNotificationClick}
                  timeAgo={timeAgo}
                />
              </div>

              {/* Cart Icon */}
              {account && Object.keys(account).length > 0 && (
                <div className="w-12 h-12 flex items-center justify-center mx-0 relative">
                  <Link
                    to="/eco-market/my-cart"
                    className="relative w-full h-full border-0 bg-white/90 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center no-underline backdrop-blur-[10px] border-2 border-white/20 shadow-sm hover:bg-gradient-to-br hover:from-[#344960] hover:to-[#667eea] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_25px_rgba(102,126,234,0.3)] focus:outline focus:outline-2 focus:outline-[#344960] focus:outline-offset-2 group"
                  >
                    <i className="bi bi-bag-heart-fill text-xl text-[#344960] transition-colors group-hover:text-white"></i>
                    <span className="absolute -top-2 -right-2 text-white rounded-full min-w-[22px] h-[22px] text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-md animate-[pulseNotification_2s_infinite] bg-red-500">
                      {cart?.items?.length || 0}
                    </span>
                  </Link>
                </div>
              )}

              {/* User Profile or Login */}
              {account && Object.keys(account).length > 0 ? (
                <UserDropdown
                  account={account}
                  showDropdown={showDropdown}
                  dropdownRef={dropdownRef}
                  onToggle={handleDropdownToggle}
                  onLogout={handleLogout}
                />
              ) : (
                <Link
                  className="bg-white/90 text-[#344960] border-2 border-[#344960] rounded-[25px] font-semibold text-sm transition-all duration-300 no-underline flex items-center justify-center px-5 py-2.5 backdrop-blur-[10px] shadow-sm hover:bg-gradient-to-br hover:from-[#344960] hover:to-[#667eea] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(102,126,234,0.3)] hover:border-transparent focus:outline focus:outline-2 focus:outline-[#344960] focus:outline-offset-2 mx-4"
                  to="/eco-market/login"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span>Đăng nhập / Đăng ký</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <MobileMenu
            show={showMobileMenu}
            account={account}
            categories={categories}
            onSearch={handleSearch}
            onClose={() => setShowMobileMenu(false)}
            onLogout={handleLogout}
          />
        </div>
      </nav>

      {/* Category Navigation Bar */}
      <div>
        <div className="flex justify-center mb-1">
          <nav className="nav">
            {/* Category Menu Icon */}
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
                      {category?.subCategories
                        ?.filter((subcate) => subcate.status === "active")
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

            {/* Category Links */}
            {categories?.map((category) => (
              <div key={category._id} className="dropdown">
                <Link
                  className="nav-link ps-2 text-black flex items-center"
                  to={`/eco-market?categoryID=${category._id}`}
                >
                  {category.name}
                </Link>
                <ul className="dropdown-menu">
                  {category?.subCategories
                    ?.filter((subcate) => subcate.status === "active")
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

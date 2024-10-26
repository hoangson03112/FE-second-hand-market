import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import CategoryContext from "../../contexts/CategoryContext";
import AccountContext from "../../contexts/AccountContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [account, setAccount] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  // const { cart } = useCart();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/ecomarket/home");
    window.location.reload();
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data.data) {
          setAccount(data.data.account);
        }
      } catch (error) {
        console.error("Error fetching", error);
      }
    };
    checkAuthentication();
  }, []);

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
    <div className="">
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

          <div id="navbarNav" className="ms-5 ">
            <nav className="nav nav-pills d-flex justify-content-evenly">
              <a
                className="gradient-custom-2 flex-sm-fill  text-center nav-link active px-5"
                href="/"
              >
                Đăng Bán
              </a>
              {Object.keys(account).length > 0 ? (
                <div className="d-flex align-items-center  ">
                  <div
                    className="position-relative mx-5"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <i
                      className="bi bi-cart4 fs-4 rounded-circle text-center cart shadow"
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                      }}
                      onClick={() => {
                        navigate("/ecomarket/my-cart");
                      }}
                    />
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
                        <a className="dropdown-item" href="/">
                          Hồ sơ
                        </a>
                        <a className="dropdown-item" href="/ecomarket/my-order">
                          Đơn Hàng
                        </a>
                        <span className="dropdown-item" onClick={handleLogout}>
                          Đăng xuất
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <a
                  className="flex-sm-fill text-sm-center shadow nav-link text-black mx-4"
                  href="/ecomarket/login"
                >
                  Đăng nhập / Đăng ký
                </a>
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
                            href={`/ecomarket?subcategoryID=${subcategory._id}`}
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
                        href={`/ecomarket?subcategoryID=${subcategory._id}`}
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

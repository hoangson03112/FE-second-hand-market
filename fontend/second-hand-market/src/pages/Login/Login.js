import React, { useState } from "react";
import "./Login.css";

import AccountContext from "../../contexts/AccountContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const data = await AccountContext.Login(username, password);
    console.log(data);
    
    if (data.status !== "success") {
      setErrorMessage(data.message);
    }
  };

  const handleCloseModal = () => {
    setErrorMessage(""); // Đóng modal
  };

  return (
    <div>
      <div
        style={{
          background:
            "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
        }}
      >
        <div className="container pt-4">
          <div className="row">
            <div
              className="col-md-5 mb-5 card shadow"
              style={{ transform: "none", boxShadow: "none" }}
            >
              <div className="d-flex flex-column">
                <div className="text-center">
                  <img
                    src="/images/logi.png"
                    style={{ width: "200px" }}
                    alt="logo"
                  />
                  <h4 className="mt-1 mb-3 pb-1">
                    Chào mừng bạn đến với EcoMarket
                  </h4>
                </div>
                <p className="text-center">
                  Vui lòng đăng nhập tài khoản của bạn
                </p>

                <div className="mb-4">
                  <label htmlFor="form1" className="form-label ms-5">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    className="form-control w-75 mx-auto rounded-pill border-danger py-2"
                    id="form1"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="form2" className="form-label ms-5">
                    Mật khẩu
                  </label>
                  <div className="d-flex justify-content-center">
                    <div className="position-relative w-75">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-pill border-danger py-2"
                        id="form2"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y"
                        style={{
                          zIndex: 10,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        <i
                          className={`fa ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-1 mb-5 pb-1">
                  <button
                    className="btn text-white mb-4 p-2 w-75 gradient-custom-2"
                    onClick={handleLogin}
                  >
                    Đăng nhập
                  </button>

                  <div
                    className={`modal fade ${errorMessage ? "show" : ""}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{
                      display: errorMessage ? "block" : "none",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                    aria-hidden={!errorMessage}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Thông báo lỗi</h5>
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleCloseModal}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <p>{errorMessage}</p>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn gradient-custom-2 text-white"
                            onClick={handleCloseModal}
                          >
                            Đăng nhập lại!
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <a className="text-muted" href="#!">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                  <p className="mb-0">Bạn chưa có tài khoản?</p>
                  <a
                    href="/ecomarket/register"
                    className="btn btn-outline-danger mx-2"
                  >
                    Đăng kí
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-7 mb-5">
              <div className="d-flex flex-column justify-content-center h-100 mb-4">
                <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                  <h4 className="mb-4">
                    Khám phá giá trị cũ, tạo phong cách mới
                  </h4>
                  <p className="mb-0 fst-italic">
                    "Tôi luôn tin rằng những món đồ cũ không chỉ là những vật
                    thể đã qua sử dụng mà còn là những phần của ký ức và câu
                    chuyện cá nhân..."
                  </p>
                  <span>
                    — Sophia Amoruso, Nhà sáng lập Nasty Gal và tác giả của
                    #GIRLBOSS.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

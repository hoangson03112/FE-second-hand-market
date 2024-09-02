import React, { useState } from "react";
import "./Login.css";
import Header from "./Header";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header />
      <div
        style={{
          background:
            "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
        }}
      >
        <div className="container  pt-4">
          <div className="row">
            <div
              className="col-md-5 mb-5 card shadow "
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
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control w-75 mx-auto rounded-pill  border-danger py-2"
                    id="form1"
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
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y "
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
                  <button className="btn text-white mb-4 p-2 w-75 gradient-custom-2">
                    Đăng nhập
                  </button>
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
              <div className="d-flex flex-column justify-content-center  h-100 mb-4">
                <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                  <h4 className="mb-4">
                    Khám phá giá trị cũ, tạo phong cách mới
                  </h4>
                  <p className=" mb-0 fst-italic">
                    "Tôi luôn tin rằng những món đồ cũ không chỉ là những vật
                    thể đã qua sử dụng mà còn là những phần của ký ức và câu
                    chuyện cá nhân. Chúng mang theo dấu ấn của thời gian và kỷ
                    niệm, và điều đó làm cho chúng trở nên quý giá hơn bao giờ
                    hết. Mỗi món đồ cũ là một chứng nhân của lịch sử, một phần
                    không thể thiếu trong hành trình cuộc sống của chúng ta."
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

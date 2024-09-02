import React, { useState } from "react";
import "./Register.css";
import Header from "./Header";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <Header />
      <div className="bg-body-secondary">
        <div className="container gradient-form pt-4">
          <div className="row">
            <div className="col-md-7 mb-5">
              <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
                <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                  <h4 className="mb-4">
                    Sống xanh, sống bền vững với những món đồ cũ đầy giá trị.
                  </h4>
                  <p className=" mb-0 fst-italic">
                    "Sự sáng tạo là nhìn thấy những gì mà người khác không nhìn
                    thấy và nghĩ ra những gì chưa từng tồn tại. Những món đồ cũ
                    có thể mở ra những cách nhìn mới, tạo nên giá trị mà bạn
                    chưa từng tưởng tượng."
                  </p>
                  <span>— Albert Einstein</span>
                </div>
              </div>
            </div>
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
                  <h4 className="mt-1 mb-5 pb-1">
                    Chào mừng bạn đến với EcoMarket
                  </h4>
                </div>
                <p className="text-center">
                  Vui lòng điền thông tin để tạo tài khoản
                </p>

                <div className="mb-4">
                  <label htmlFor="form2" className="form-label ms-5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control w-75 mx-auto rounded-pill border-danger py-2"
                    id="form2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="form3" className="form-label ms-5">
                    Mật khẩu
                  </label>
                  <div className="d-flex justify-content-center">
                    <div className="position-relative w-75">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-pill border-danger py-2"
                        id="form3"
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

                <div className="mb-4">
                  <label htmlFor="form4" className="form-label ms-5">
                    Xác nhận mật khẩu
                  </label>
                  <div className="d-flex justify-content-center">
                    <div className="position-relative w-75">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control rounded-pill border-danger py-2"
                        id="form4"
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
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        <i
                          className={`fa ${
                            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-1 mb-4 pb-1">
                  <button className="btn text-white mb-4 p-2 w-75 gradient-custom-2">
                    Đăng ký
                  </button>
                  <div>
                    <p className="text-muted ">
                      Đã có tài khoản?{" "}
                      <a
                        href="/ecomarket/login"
                        className="text-decoration-none"
                      >
                        Đăng nhập ngay!
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

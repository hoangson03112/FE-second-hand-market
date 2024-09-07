import React, { useState } from "react";
import "./Register.css";
import Header from "./Header";
import AccountContext from "../http/AccountContext";
import Verification from "./Verification";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState(""); // Thêm state cho tên đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [userID, setUserID] = useState("");

  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8,9})$/;
    return phoneRegex.test(number);
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    setPhoneNumber(input);

    if (!validatePhoneNumber(input)) {
      setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
    } else {
      setPhoneError("");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z]).{8,20}$/;
    return passwordRegex.test(password);
  };

  const validateFields = () => {
    let isValid = true;

    if (!validatePassword(password)) {
      setPasswordError(
        "Mật khẩu phải có độ dài từ 8-20 ký tự và chứa ít nhất 1 chữ cái."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validatePhoneNumber(phoneNumber) && validateFields()) {
      const error = await AccountContext.Register(
        username,
        email,
        password,
        phoneNumber
      );

      if (error.status === "success") {
        setShowVerify(true);
        setUserID(error.accountID);
      } else if (error.type === "email") {
        setErrorMessage("Email này đã tồn tại!");
      } else if (error.type === "username") {
        setErrorMessage("Tên đăng nhập này đã tồn tại!");
      } else if (error.type === "phoneNumber") {
        setErrorMessage("Số điện thoại này đã tồn tại!");
      }
    }
  };

  const handleCloseModal = () => {
    setErrorMessage(""); // Đóng modal
  };

  return (
    <div>
      <Header />
      {showVerify && (
        <Verification setShowVerify={setShowVerify} userID={userID} />
      )}
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
              <form onSubmit={handleSubmit}>
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

                  <div className="input-container">
                    <label htmlFor="form1" className="form-label ms-5">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      className="form-control w-75 mx-auto rounded-pill py-2"
                      id="form1"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-container mt-2">
                    <label htmlFor="form2" className="form-label ms-5">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className={`form-control w-75 mx-auto rounded-pill py-2 ${
                        phoneError && "is-invalid"
                      }`}
                      id="form2"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                    {phoneError && (
                      <div className="error-message">{phoneError}</div>
                    )}
                  </div>

                  <div className="input-container mt-2">
                    <label htmlFor="form2" className="form-label ms-5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control w-75 mx-auto rounded-pill py-2 
                      "
                      id="form2"
                      onChange={handleEmailChange}
                      required
                    />
                  </div>

                  <div className="input-container mt-2">
                    <label htmlFor="form3" className="form-label ms-5">
                      Mật khẩu
                    </label>
                    <div className="d-flex justify-content-center">
                      <div className="position-relative w-75">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control rounded-pill py-2 ${
                            passwordError && "is-invalid"
                          }`}
                          id="form3"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
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
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i
                            className={`fa ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>
                    {isSubmitted && passwordError && (
                      <div className="error-message">{passwordError}</div>
                    )}
                  </div>

                  <div className="input-container mt-2">
                    <label htmlFor="form4" className="form-label ms-5">
                      Xác nhận mật khẩu
                    </label>
                    <div className="d-flex justify-content-center">
                      <div className="position-relative w-75">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control rounded-pill py-2 ${
                            confirmPasswordError && "is-invalid"
                          }`}
                          id="form4"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <i
                            className={`fa ${
                              showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>
                    {isSubmitted && confirmPasswordError && (
                      <div className="error-message">
                        {confirmPasswordError}
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-1 my-4 pb-1">
                    <button
                      type="submit"
                      className="btn text-white mb-4 p-2 w-75 gradient-custom-2"
                    >
                      Đăng ký
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
                            <h5 className="modal-title">Thông báo </h5>
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
                              Đóng!
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

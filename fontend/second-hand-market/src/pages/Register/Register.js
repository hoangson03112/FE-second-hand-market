import React, { useState } from "react";
import "./Register.css";
import AccountContext from "../../contexts/AccountContext";
import Verification from "./../Verification/Verification";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    fullName: "",
  });
  const [formErrors, setFormErrors] = useState({
    passwordError: "",
    confirmPasswordError: "",
    phoneError: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [userID, setUserID] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validatePhoneNumber = (number) =>
    /^(0[3|5|7|8|9])+([0-9]{8,9})$/.test(number);

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z]).{8,20}$/.test(password);

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    if (!validatePassword(formData.password)) {
      errors.passwordError =
        "Mật khẩu phải có độ dài từ 8-20 ký tự và chứa ít nhất 1 chữ cái.";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPasswordError = "Mật khẩu xác nhận không khớp.";
      isValid = false;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneError = "Số điện thoại không hợp lệ. Vui lòng nhập lại.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(formData);

    if (validateFields()) {
      const error = await AccountContext.Register(
        formData.username,
        formData.email,
        formData.password,
        formData.phoneNumber,
        formData.fullName
      );

      if (error.status === "success") {
        setShowVerify(true);
        setUserID(error.accountID);
      } else {
        setErrorMessage(`Lỗi: ${error.type} đã tồn tại!`);
      }
    }
  };

  const handleCloseModal = () => setErrorMessage("");

  return (
    <div>
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
                  <p className="mb-0 fst-italic">
                    "Sự sáng tạo là nhìn thấy những gì mà người khác không nhìn
                    thấy và nghĩ ra những gì chưa từng tồn tại."
                  </p>
                  <span>— Albert Einstein</span>
                </div>
              </div>
            </div>

            <div className="col-md-5 mb-5 card shadow">
              <form onSubmit={handleSubmit}>
                <div className="text-center">
                  <img
                    src="/images/logi.png"
                    style={{ width: "200px" }}
                    alt="logo"
                  />
                  <h4 className="mt-1 mb-5 pb-1">
                    Chào mừng bạn đến với eco-market
                  </h4>
                </div>
                <p className="text-center">
                  Vui lòng điền thông tin để tạo tài khoản
                </p>

                {["username", "fullName", "phoneNumber", "email"].map(
                  (field) => (
                    <div key={field} className="input-container mt-2">
                      <label htmlFor={field} className="form-label ms-5">
                        {field === "username"
                          ? "Tên đăng nhập"
                          : field === "fullName"
                          ? "Họ và Tên"
                          : field === "phoneNumber"
                          ? "Số điện thoại"
                          : "Email"}
                      </label>
                      <input
                        type="text"
                        className={`form-control w-75 mx-auto rounded-pill py-2 ${
                          formErrors.phoneError && field === "phoneNumber"
                            ? "is-invalid"
                            : ""
                        }`}
                        id={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.phoneError && field === "phoneNumber" && (
                        <div className="error-message">
                          {formErrors.phoneError}
                        </div>
                      )}
                    </div>
                  )
                )}

                {["password", "confirmPassword"].map((field) => (
                  <div key={field} className="input-container mt-2">
                    <label htmlFor={field} className="form-label ms-5">
                      {field === "password" ? "Mật khẩu" : "Xác nhận mật khẩu"}
                    </label>
                    <div className="d-flex justify-content-center">
                      <div className="position-relative w-75">
                        <input
                          type={
                            field === "password" && showPassword
                              ? "text"
                              : field === "confirmPassword" &&
                                showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          className={`form-control rounded-pill py-2 ${
                            formErrors[field + "Error"] ? "is-invalid" : ""
                          }`}
                          id={field}
                          value={formData[field]}
                          onChange={handleInputChange}
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
                            field === "password"
                              ? setShowPassword(!showPassword)
                              : setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <i
                            className={`fa ${
                              (field === "password" && showPassword) ||
                              (field === "confirmPassword" &&
                                showConfirmPassword)
                                ? "fa-eye-slash"
                                : "fa-eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>
                    {isSubmitted && formErrors[field + "Error"] && (
                      <div className="error-message">
                        {formErrors[field + "Error"]}
                      </div>
                    )}
                  </div>
                ))}

                <div className="text-center pt-1 my-4 pb-1">
                  <button
                    type="submit"
                    className="btn text-white mb-4 p-2 w-75 gradient-custom-2"
                  >
                    Đăng ký
                  </button>

                  {errorMessage && (
                    <div
                      className="modal fade show"
                      role="dialog"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Thông báo </h5>
                            <button
                              type="button"
                              className="btn-close"
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
                  )}

                  <p className="text-muted">
                    Đã có tài khoản?{" "}
                    <a href="/eco-market/login" className="text-decoration-none">
                      Đăng nhập ngay
                    </a>
                  </p>
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

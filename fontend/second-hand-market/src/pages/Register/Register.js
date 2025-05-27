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
  const [isLoading, setIsLoading] = useState(false);

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
    setErrorMessage("");
    setIsLoading(true);
    
    try {
      if (validateFields()) {
        const response = await AccountContext.Register(
          formData.username,
          formData.email,
          formData.password,
          formData.phoneNumber,
          formData.fullName
        );

        if (response.status === "success") {
          setShowVerify(true);
          setUserID(response.accountID);
        } else {
          // Xử lý các loại lỗi khác nhau
          if (response.type === "username") {
            setErrorMessage("Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.");
          } else if (response.type === "email") {
            setErrorMessage("Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.");
          } else if (response.type === "phoneNumber") {
            setErrorMessage("Số điện thoại này đã được đăng ký với tài khoản khác.");
          } else {
            setErrorMessage(`Đăng ký không thành công: ${response.message || 'Vui lòng thử lại sau.'}`);
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
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

            <div className="col-md-5 mb-5 card shadow" style={{ transition: "none", transform: "none" }}>
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
                
                {/* Error message alert */}
                {errorMessage && (
                  <div className="alert alert-danger mx-auto mb-4 w-75 text-center" role="alert" style={{
                    borderRadius: "15px",
                    animation: "fadeIn 0.5s",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
                  }}>
                    <i className="fa fa-exclamation-circle me-2"></i>
                    {errorMessage}
                  </div>
                )}
                
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
                    style={{ 
                      transition: "all 0.3s ease", 
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </button>

                  <p className="text-muted">
                    Đã có tài khoản?{" "}
                    <a
                      href="/eco-market/login"
                      className="text-decoration-none"
                      style={{ 
                        position: "relative",
                        transition: "all 0.3s ease", 
                        color: "#6c757d"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "#0d6efd";
                        e.currentTarget.style.textDecoration = "underline";
                        e.currentTarget.style.fontWeight = "500";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "#6c757d";
                        e.currentTarget.style.textDecoration = "none";
                        e.currentTarget.style.fontWeight = "normal";
                      }}
                    >
                      Đăng nhập ngay
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add a keyframe animation for the error message */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .error-message {
            color: #dc3545;
            font-size: 0.85rem;
            margin-top: 5px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
}

export default Register;

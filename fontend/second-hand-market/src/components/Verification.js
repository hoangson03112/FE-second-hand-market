import React, { useState, useRef, useEffect } from "react";
import "./Verification.css";
import AccountContext from "../http/AccountContext";
import { useNavigate } from "react-router-dom";

const Verification = ({ setShowVerify, userID }) => {
  const [codes, setCodes] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút = 900 giây
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cập nhật thời gian còn lại mỗi giây
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Xóa interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = codes.join("");

    try {
      const data = await AccountContext.Verify(userID, code);
      if (data.status === "success") {
        setShowVerify(false);
        navigate("/ecomarket/home");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  // Chuyển đổi thời gian còn lại thành định dạng MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="wrapper">
      <div>
        <form className="form">
          <span
            className="close"
            onClick={() => {
              setShowVerify(false);
            }}
          >
            <i className="bi bi-x-octagon fs-3"></i>
          </span>
          <div className="info">
            <span className="title">Xác minh email</span>
            <p className="description">
              Nhập mã code được gửi đến email của bạn để kích hoạt tài khoản
            </p>
            <p className="timer">Thời gian còn lại: {formatTime(timeLeft)}</p>
          </div>
          <div className="input-fields">
            {codes.map((code, index) => (
              <input
                key={index}
                type="tel"
                maxLength={1}
                value={code}
                ref={(el) => (inputsRef.current[index] = el)} // Gán ref cho từng input
                onChange={(e) => handleChange(e, index)}
              />
            ))}
          </div>
          <div className="action-btns">
            <a className="verify" href="#" onClick={handleVerify}>
              Xác minh
            </a>
            <a
              className="clear"
              href="#"
              onClick={() => setCodes(["", "", "", ""])}
            >
              Xóa
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;

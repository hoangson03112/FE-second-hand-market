import ApiService from "../../services/ApiService";
import React, { useState } from "react";

interface PhoneVerifyProps {
  phone: string;
  onVerified: () => void;
}

const PhoneVerify: React.FC<PhoneVerifyProps> = ({ phone, onVerified }) => {
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const token = localStorage.getItem("token");

  const sendSMS = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!phone) {
        alert("Vui lòng nhập số điện thoại!");
        return;
      }

      const response = await ApiService.post(
        "  /otp/send-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ FIX: Set confirmationResult
      setConfirmationResult({
        phone: phone,
        sentAt: new Date(),
        success: true,
        message: response.data.message || "OTP sent successfully",
      });
    } catch (err) {
      console.error("Lỗi gửi SMS:", err);

      setConfirmationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      alert("Vui lòng gửi mã OTP trước!");
      return;
    }

    if (!code.trim()) {
      alert("Vui lòng nhập mã OTP!");
      return;
    }

    if (code.length !== 6) {
      alert("Mã OTP phải có 6 chữ số!");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await ApiService.post(
        "  /otp/verify-otp",
        {
          otp: code.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onVerified();
      } else {
        alert("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại!");
      }

      // Reset form
      setCode("");
      setConfirmationResult(null);
    } catch (err) {
      console.error("Verification error:", err);
      alert("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại!");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    // Reset confirmation result và gửi lại
    setConfirmationResult(null);
    setCode("");
    await sendSMS();
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px" }}>
      <h3>Xác minh số điện thoại</h3>

      <div
        style={{
          backgroundColor: "#e7f3ff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #b3d9ff",
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
          📱 Số điện thoại: {phone || "Chưa nhập"}
        </p>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Một mã OTP 6 chữ số sẽ được gửi đến số điện thoại này.
        </p>
      </div>

      <button
        onClick={sendSMS}
        disabled={isLoading || !phone}
        style={{
          width: "100%",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: isLoading || !phone ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: isLoading || !phone ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {isLoading ? "⏳ Đang gửi..." : "📨 Gửi mã OTP"}
      </button>

      {confirmationResult && (
        <div
          style={{
            backgroundColor: "#d4edda",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontWeight: "bold",
              color: "#155724",
            }}
          >
            ✅ Mã OTP đã được gửi!
          </p>
          <p
            style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#155724" }}
          >
            Vui lòng kiểm tra tin nhắn và nhập mã OTP bên dưới.
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Gửi lúc:{" "}
            {new Date(confirmationResult.sentAt).toLocaleTimeString("vi-VN")}
          </p>
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Nhập mã OTP:
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            // Chỉ cho phép số và tối đa 6 chữ số
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(value);
          }}
          placeholder="000000"
          maxLength={6}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "24px",
            textAlign: "center",
            border: "2px solid #ddd",
            borderRadius: "8px",
            letterSpacing: "8px",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        />
      </div>

      <button
        onClick={verifyOTP}
        disabled={
          !confirmationResult ||
          !code.trim() ||
          code.length !== 6 ||
          isVerifying
        }
        style={{
          width: "100%",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor:
            !confirmationResult ||
            !code.trim() ||
            code.length !== 6 ||
            isVerifying
              ? "#ccc"
              : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor:
            !confirmationResult ||
            !code.trim() ||
            code.length !== 6 ||
            isVerifying
              ? "not-allowed"
              : "pointer",
          marginBottom: "15px",
        }}
      >
        {isVerifying ? "⏳ Đang xác minh..." : "✓ Xác minh OTP"}
      </button>

      {confirmationResult && (
        <button
          onClick={resendOTP}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Đang gửi lại..." : "🔄 Gửi lại mã OTP"}
        </button>
      )}
    </div>
  );
}

export default PhoneVerify;

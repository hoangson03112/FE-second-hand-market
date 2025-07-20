import axios from "axios";
import React from "react";

class SellerContext {
  async registerSeller(sellerInfo) {
    const token = localStorage.getItem("token");
    try {
      // Tạo FormData để gửi file cùng với dữ liệu
      const formData = new FormData();

      // Thêm tất cả field text
      formData.append("address", sellerInfo.address || "");
      formData.append("province", sellerInfo.province || "");
      formData.append("district", sellerInfo.district || "");
      formData.append("ward", sellerInfo.ward || "");
      formData.append("bankName", sellerInfo.bankName || "");
      formData.append("accountNumber", sellerInfo.accountNumber || "");
      formData.append("accountHolder", sellerInfo.accountHolder || "");
      formData.append("agreeTerms", sellerInfo.agreeTerms || false);
      formData.append("agreePolicy", sellerInfo.agreePolicy || false);

      // Thêm các file ảnh
      if (sellerInfo.avatar) {
        formData.append("avatar", sellerInfo.avatar);
      }
      if (sellerInfo.idCardFront) {
        formData.append("idCardFront", sellerInfo.idCardFront);
      }
      if (sellerInfo.idCardBack) {
        formData.append("idCardBack", sellerInfo.idCardBack);
      }

      const response = await axios.post("  /sellers/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message || "Đăng ký thành công!",
      };
    } catch (error) {
      console.error("Error registering seller:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        return {
          success: false,
          error: data,
          message: data.message || "Đăng ký thất bại!",
          statusCode: status,
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: "Network Error",
          message:
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
          statusCode: 0,
        };
      } else {
        // Other errors
        return {
          success: false,
          error: error.message,
          message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          statusCode: -1,
        };
      }
    }
  }
  async getSellerInfo(accountId) {
    const response = await axios.get(`/sellers/${accountId}`);
    return response.data;
  }
}

export default new SellerContext();

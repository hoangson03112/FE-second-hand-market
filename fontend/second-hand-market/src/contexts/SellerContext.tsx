import ApiService from "../services/ApiService";
import React from "react";

class SellerContext {
  async registerSeller(sellerInfo) {
    try {
      // Create FormData to send files with data
      const formData = new FormData();

      // Add all text fields
      formData.append("address", sellerInfo.address || "");
      formData.append("province", sellerInfo.province || "");
      formData.append("district", sellerInfo.district || "");
      formData.append("ward", sellerInfo.ward || "");
      formData.append("bankName", sellerInfo.bankName || "");
      formData.append("accountNumber", sellerInfo.accountNumber || "");
      formData.append("accountHolder", sellerInfo.accountHolder || "");
      formData.append("agreeTerms", sellerInfo.agreeTerms || false);
      formData.append("agreePolicy", sellerInfo.agreePolicy || false);
      formData.append("province_id", sellerInfo.province_id || "");
      formData.append("from_district_id", sellerInfo.from_district_id || "");
      formData.append("from_ward_code", sellerInfo.from_ward_code || "");

      // Add image files
      if (sellerInfo.avatar) {
        formData.append("avatar", sellerInfo.avatar);
      }
      if (sellerInfo.idCardFront) {
        formData.append("idCardFront", sellerInfo.idCardFront);
      }
      if (sellerInfo.idCardBack) {
        formData.append("idCardBack", sellerInfo.idCardBack);
      }

      const response = await ApiService.post("/sellers/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response,
        message: response.message || "Đăng ký thành công!",
      };
    } catch (error) {
      console.error("Error registering seller:", error);
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
    return await ApiService.get(`/sellers/${accountId}`);
  }
}

export default new SellerContext();


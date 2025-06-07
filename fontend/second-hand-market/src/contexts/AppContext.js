import axios from "axios";

// Tạo instance axios để tái sử dụng và cấu hình chung
const apiClient = axios.create({
  baseURL: "https://provinces.open-api.vn/api/",
  timeout: 5000, // 5 giây timeout
});

class AppContext {
  async fetchProvinces() {
    try {
      const response = await apiClient.get("/");
      return response.data; // Chỉ trả về data thay vì cả response object
    } catch (error) {
      console.error("Lỗi khi fetch tỉnh/thành:", error);
      throw error; // Re-throw để component có thể bắt lỗi
    }
  }
}

// Export singleton instance
export default new AppContext();
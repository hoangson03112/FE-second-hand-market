import axios from "axios";

class ChatContext {
  async getChat() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/eco-market/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Trả về dữ liệu JSON từ server
    } catch (error) {
      console.error("Error fetching data:", error);
      return { message: "Đã xảy ra lỗi khi xác thực.", status: 500 };
    }
  }
}

export default new ChatContext();

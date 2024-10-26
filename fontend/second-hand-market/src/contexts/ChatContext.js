import axios from "axios";

class ChatContext {
  async getChat() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const data = await axios.get("http://localhost:2000/ecomarket/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return "Đã xảy ra lỗi khi xác thực.";
    }
  }
}
export default new ChatContext();

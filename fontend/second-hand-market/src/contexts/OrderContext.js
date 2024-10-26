import axios from "axios";

class OrderContext {
  async getOrder() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/ecomarket/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {}
  }
}
export default new OrderContext();

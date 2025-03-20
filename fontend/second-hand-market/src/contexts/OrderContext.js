import axios from "axios";

class OrderContext {
  async getOrder() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/eco-market/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {}
  }

  async updateOrder(orderId, reason, status) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.patch(
        "http://localhost:2000/eco-market/orders/update-order",
        {
          orderId,
          reason,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật đơn hàng",
        status: error.response?.status || 500,
      };
    }
  }
}
export default new OrderContext();

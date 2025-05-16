import ApiService from "./ApiService";

const orderService = {
  getAllOrders: async () => {
    return await ApiService.get("/orders");
  },

  getOrderById: async (id) => {
    return await ApiService.get(`/orders/${id}`);
  },

  getUserOrders: async (userId) => {
    return await ApiService.get(`/users/${userId}/orders`);
  },

  createOrder: async (orderData) => {
    return await ApiService.post("/orders", orderData);
  },

  updateOrderStatus: async (id, status) => {
    return await ApiService.put(`/orders/${id}/status`, { status });
  },

  cancelOrder: async (id) => {
    return await ApiService.put(`/orders/${id}/cancel`);
  },

  getOrdersStatistics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/orders/statistics?${queryParams}`);
  },
  getTotalAmountOfOrder: async (id) => {
    return await ApiService.get(`/orders/${id}/totalAmount`);
  },
};

export default orderService;

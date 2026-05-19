import ApiService from "./ApiService";

const adminService = {
  // Dashboard & Statistics
  async getDashboardStats() {
    return await ApiService.get("/admin/dashboard");
  },

  async getStatistics(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/admin/statistics?${queryParams}`);
  },

  // User Management
  async getAllUsers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/accounts/admin/list?${queryParams}`);
  },

  async createUser(userData) {
    return await ApiService.post("/accounts/admin/create", userData);
  },

  async updateUser(accountId, userData) {
    return await ApiService.put(`/accounts/admin/update/${accountId}`, userData);
  },

  // Seller Management
  async getAllSellers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/sellers/admin/all?${queryParams}`);
  },

  async getSellerById(sellerId) {
    return await ApiService.get(`/sellers/admin/${sellerId}`);
  },

  async updateSellerStatus(sellerId, status) {
    return await ApiService.put(`/sellers/admin/${sellerId}/status`, { status });
  },

  // Order Management  
  async getAllOrders(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/orders/admin/all?${queryParams}`);
  },

  // Product Management
  async getAllProducts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/products?${queryParams}`);
  },

  // Report Management
  async getAllReports(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/reports?${queryParams}`);
  },
};

export default adminService;

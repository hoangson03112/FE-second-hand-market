import ApiService from "./ApiService";

const sellerService = {
  getAllSellers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sellers/admin/all${
      queryString ? `?${queryString}` : ""
    }`;
    return await ApiService.get(endpoint);
  },

  getSellerById: async (id) => {
    return await ApiService.get(`/sellers/admin/${id}`);
  },

  updateSellerStatus: async (id, status, rejectedReason = "") => {
    return await ApiService.put(`/sellers/admin/${id}/status`, {
      status: status,
      rejectedReason,
    });
  },

  // Đăng ký seller (cho user)
  registerSeller: async (formData) => {
    return await ApiService.post("/sellers/register", formData);
  },
};

export default sellerService;

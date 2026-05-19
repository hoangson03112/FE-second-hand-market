import ApiService from "./ApiService";

interface GetAllSellersParams {
  [key: string]: any;
}

const sellerService = {
  getAllSellers: async (params: GetAllSellersParams = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sellers/admin/all${
      queryString ? `?${queryString}` : ""
    }`;
    return await ApiService.get(endpoint);
  },

  getSellerById: async (id: string) => {
    return await ApiService.get(`/sellers/admin/${id}`);
  },

  updateSellerStatus: async (id: string, status: string, rejectedReason: string = "") => {
    return await ApiService.put(`/sellers/admin/${id}/status`, {
      status: status,
      rejectedReason,
    });
  },

  // Đăng ký seller (cho user)
  registerSeller: async (formData: FormData | any) => {
    return await ApiService.post("/sellers/register", formData);
  },
};

export default sellerService;

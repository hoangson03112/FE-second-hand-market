import ApiService from "./ApiService";

const reportApi = {
  createReport: async (data) => {
    const response = await ApiService.post("/reports", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  getAllReports: async () => {
    const response = await ApiService.get("/reports");
    return response.reports;
  },

  updateReportRefund: async (id, status, result) => {
    const response = await ApiService.patch(`/reports/order/${id}`, {
      status,
      result,
    });
    return response.data;
  },
};

export default reportApi;

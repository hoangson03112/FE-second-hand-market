import ApiService from "./ApiService";

interface ReportParams {
  [key: string]: any;
}

const reportService = {
  createReport: async (data: FormData | any) => {
    return await ApiService.post("/reports", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAllReports: async (params: ReportParams = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/reports?${queryParams}`);
  },

  getReportById: async (id: string) => {
    return await ApiService.get(`/reports/${id}`);
  },

  updateReportRefund: async (id: string, status: string, result: any) => {
    return await ApiService.patch(`/reports/order/${id}`, {
      status,
      result,
    });
  },

  updateReportStatus: async (id: string, status: string) => {
    return await ApiService.patch(`/reports/${id}`, { status });
  },

  deleteReport: async (id: string) => {
    return await ApiService.delete(`/reports/${id}`);
  },
};

export default reportService;

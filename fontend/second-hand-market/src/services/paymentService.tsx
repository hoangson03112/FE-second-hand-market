import ApiService from "./ApiService";

interface PaymentData {
  [key: string]: any;
}

const paymentService = {
  async createPayment(paymentData: PaymentData) {
    return await ApiService.post("/payments", paymentData);
  },

  async getPaymentStatus(paymentId: string) {
    return await ApiService.get(`/payments/${paymentId}`);
  },

  async updatePaymentStatus(paymentId: string, status: string) {
    return await ApiService.put(`/payments/${paymentId}`, { status });
  },

  async getPaymentMethods() {
    return await ApiService.get("/payments/methods");
  },
};

export default paymentService;

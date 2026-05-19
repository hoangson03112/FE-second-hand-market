import ApiService from "./ApiService";
import { Order, ApiResponse } from "../types/api.types";

interface CreateOrderData {
  sellerId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  totalAmount: number;
  shippingFee?: number;
  insuranceFee?: number;
  codFee?: number;
}

interface UpdateOrderData {
  status?: string;
  ghnStatus?: string;
  deliveredAt?: string;
  reason?: string;
}

interface GHNOrderData {
  ghnOrderCode: string;
  ghnSortCode?: string;
  expectedDeliveryTime?: string;
  ghnTrackingUrl?: string;
}

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  shipping: number;
  delivered: number;
  cancelled: number;
}

const orderService = {
  /**
   * Create new order
   * BE endpoint: POST /orders
   */
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    return await ApiService.post<Order>("/orders", orderData);
  },

  /**
   * Get my orders (as buyer)
   * BE endpoint: GET /orders/my-orders
   */
  getMyOrders: async (): Promise<Order[]> => {
    return await ApiService.get<Order[]>("/orders/my-orders");
  },

  /**
   * Get order details by ID
   * BE endpoint: GET /orders/order-details/:orderId
   */
  getOrderById: async (orderId: string): Promise<Order> => {
    return await ApiService.get<Order>(`/orders/order-details/${orderId}`);
  },

  /**
   * Get order for feedback
   * BE endpoint: GET /orders/:orderId
   */
  getOrderToFeedback: async (orderId: string): Promise<Order> => {
    return await ApiService.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Get total amount of order
   * BE endpoint: GET /orders/:orderId/totalAmount
   */
  getTotalAmountOfOrder: async (orderId: string): Promise<{ totalAmount: number }> => {
    return await ApiService.get<{ totalAmount: number }>(
      `/orders/${orderId}/totalAmount`
    );
  },

  /**
   * Update order (buyer)
   * BE endpoint: PATCH /orders/update
   */
  updateOrder: async (
    orderId: string,
    updateData: UpdateOrderData
  ): Promise<ApiResponse<Order>> => {
    return await ApiService.patch<ApiResponse<Order>>("/orders/update", {
      orderId,
      ...updateData,
    });
  },

  /**
   * Update payment status
   * BE endpoint: PATCH /orders/update-payment-status
   */
  updatePaymentStatus: async (
    orderId: string,
    paymentStatus: boolean
  ): Promise<ApiResponse<Order>> => {
    return await ApiService.patch<ApiResponse<Order>>(
      "/orders/update-payment-status",
      { orderId, paymentStatus }
    );
  },

  /**
   * Update GHN order info
   * BE endpoint: PUT /orders/:orderId/ghn-order
   */
  updateGHNOrder: async (
    orderId: string,
    ghnData: GHNOrderData
  ): Promise<Order> => {
    return await ApiService.put<Order>(`/orders/${orderId}/ghn-order`, ghnData);
  },

  /**
   * Get seller's orders
   * BE endpoint: GET /orders/seller/my
   */
  getSellerOrders: async (): Promise<Order[]> => {
    return await ApiService.get<Order[]>("/orders/seller/my");
  },

  /**
   * Get orders by seller ID
   * BE endpoint: GET /orders/seller/:sellerId
   */
  getOrdersBySeller: async (sellerId: string): Promise<Order[]> => {
    return await ApiService.get<Order[]>(`/orders/seller/${sellerId}`);
  },

  /**
   * Update order by seller
   * BE endpoint: PATCH /orders/seller/update/:orderId
   */
  updateOrderBySeller: async (
    orderId: string,
    updateData: UpdateOrderData
  ): Promise<ApiResponse<Order>> => {
    return await ApiService.patch<ApiResponse<Order>>(
      `/orders/seller/update/${orderId}`,
      updateData
    );
  },

  /**
   * Get seller order statistics
   * BE endpoint: GET /orders/seller/stats
   */
  getSellerOrderStats: async (): Promise<OrderStats> => {
    return await ApiService.get<OrderStats>("/orders/seller/stats");
  },

  /**
   * Get all orders for refund (admin)
   * BE endpoint: GET /orders/order-refund
   */
  getAllOrderRefund: async (): Promise<any> => {
    return await ApiService.get<any>("/orders/order-refund");
  },

  /**
   * Update refund decision
   * BE endpoint: PATCH /orders/refund/update/:orderId
   */
  updateRefund: async (
    orderId: string,
    refundData: {
      refundDecision: string;
      refundDecisionReason?: string;
    }
  ): Promise<ApiResponse<Order>> => {
    return await ApiService.patch<ApiResponse<Order>>(
      `/orders/refund/update/${orderId}`,
      refundData
    );
  },

  /**
   * Confirm refund (admin)
   * BE endpoint: PATCH /orders/confirm-refund/:orderId
   */
  confirmRefund: async (orderId: string): Promise<ApiResponse<Order>> => {
    return await ApiService.patch<ApiResponse<Order>>(
      `/orders/confirm-refund/${orderId}`
    );
  },

  /**
   * Get all orders (admin)
   * BE endpoint: GET /orders/admin/all
   */
  getAllOrders: async (params: Record<string, any> = {}): Promise<Order[]> => {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get<Order[]>(`/orders/admin/all?${queryParams}`);
  },

  // Legacy methods (for backward compatibility)
  getUserOrders: async (): Promise<Order[]> => {
    return await ApiService.get<Order[]>("/orders/my-orders");
  },

  updateOrderStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<Order>> => {
    return await ApiService.patch<ApiResponse<Order>>("/orders/update", {
      orderId: id,
      status,
    });
  },
};

export default orderService;

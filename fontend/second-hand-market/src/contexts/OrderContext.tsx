import React, { createContext, useContext } from "react";
import ApiService from "../services/ApiService";
import storage from "../utils/storage";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  // Các phương thức API
  const getOrder = async () => {
    try {
      // Token automatically added by ApiService
      const token = storage.getToken();
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await ApiService.get("/orders/my-orders");

      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lấy thông tin đơn hàng",
        status: error.response?.status || 500,
      };
    }
  };

  const updateOrder = async (orderId, reason = "", status) => {
    try {
      // Token automatically added by ApiService
      const token = storage.getToken();
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await ApiService.patch(
        "/orders/update",
        {
          orderId,
          reason,
          status,
        }
      );

      return response;
    } catch (error) {
      console.error("Error updating order:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật đơn hàng",
        status: error.response?.status || 500,
      };
    }
  };
  const updatePaymentStatus = async (orderId, status) => {
    try {
      // Token automatically added by ApiService
      const token = storage.getToken();
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }
      const response = await ApiService.patch(
        "/orders/update-payment-status",
        {
          orderId,
          status,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating payment status:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái thanh toán",
        status: error.response?.status || 500,
      };
    }
  };
  const getOrdersByAdmin = async () => {
    try {
      // Token automatically added by ApiService
      const token = storage.getToken();
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await ApiService.get("/orders");

      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lấy thông tin đơn hàng",
        status: error.response?.status || 500,
      };
    }
  };

  const getMySellerOrders = async () => {
    try {
      // Token automatically added by ApiService
      const token = storage.getToken();
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await ApiService.get("/orders/seller/my");

      return response;
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lấy thông tin đơn hàng",
        status: error.response?.status || 500,
      };
    }
  };

  const updateOrderBySeller = async (orderId, status, reason) => {
    try {
      // Token automatically added by ApiService
      const token = storage.getToken();
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await ApiService.patch(
        "/orders/seller/update",
        {
          orderId,
          status,
          reason,
        }
      );

      return response;
    } catch (error) {
      console.error("Error updating seller order:", error);
      return {
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật đơn hàng",
        status: error.response?.status || 500,
      };
    }
  };

  const contextValue = {
    getOrder,
    updateOrder,
    getOrdersByAdmin,
    updatePaymentStatus,
    getMySellerOrders,
    updateOrderBySeller,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;


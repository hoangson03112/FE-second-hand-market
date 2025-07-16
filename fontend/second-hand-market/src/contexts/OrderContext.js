import React, { createContext, useContext } from "react";
import axios from "axios";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  // Các phương thức API
  const getOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get("  /orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
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
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.patch(
        "  /orders/update",
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
  };
  const updatePaymentStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }
      const response = await axios.patch(
        "  /orders/update-payment-status",
        {
          orderId,
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
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get("  /orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
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
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get("/orders/seller/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
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
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.patch(
        "  /orders/seller/update",
        {
          orderId,
          status,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
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

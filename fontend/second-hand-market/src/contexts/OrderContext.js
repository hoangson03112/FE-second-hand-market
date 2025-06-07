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

      const response = await axios.get(
        "http://localhost:2000/eco-market/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const updateOrder = async (orderId, reason, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.patch(
        "http://localhost:2000/eco-market/orders/update",
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

  const getOrdersByAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/eco-market/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // Các giá trị và phương thức để cung cấp thông qua context
  const contextValue = {
    getOrder,
    updateOrder,
    getOrdersByAdmin,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;

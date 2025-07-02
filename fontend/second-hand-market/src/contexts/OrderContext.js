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
        "  /orders/my-orders",
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

  const getOrdersByAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "  /orders",
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

    const getMySellerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/eco-market/orders/my-seller-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        "http://localhost:2000/eco-market/orders/seller/update",
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

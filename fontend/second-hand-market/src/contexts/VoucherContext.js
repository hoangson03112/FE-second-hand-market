import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const VoucherContext = createContext();

export const useVoucher = () => useContext(VoucherContext);

export const VoucherProvider = ({ children }) => {
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const API_URL = "  /vouchers";

  // Admin functions
  const createVoucher = async (voucherData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/admin/create`, voucherData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  const getAllVouchers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  const updateVoucher = async (id, voucherData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/admin/${id}`, voucherData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  const deleteVoucher = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  // User functions
  const getAvailableVouchers = async () => {
    try {
      const response = await axios.get(`${API_URL}/available`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  const applyVoucher = async (code, orderAmount) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/apply`,
        { code, orderAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const { voucher, discountAmount, finalAmount } = response.data;
      setAppliedVoucher(voucher);
      setVoucherDiscount(discountAmount);
      
      return { voucher, discountAmount, finalAmount };
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  const useVoucher = async (voucherId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/use`,
        { voucherId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Có lỗi xảy ra" };
    }
  };

  const clearAppliedVoucher = () => {
    setAppliedVoucher(null);
    setVoucherDiscount(0);
  };

  const contextValue = {
    // Admin functions
    createVoucher,
    getAllVouchers,
    updateVoucher,
    deleteVoucher,
    
    // User functions
    getAvailableVouchers,
    applyVoucher,
    useVoucher,
    
    // State
    appliedVoucher,
    voucherDiscount,
    clearAppliedVoucher,
  };

  return (
    <VoucherContext.Provider value={contextValue}>
      {children}
    </VoucherContext.Provider>
  );
};
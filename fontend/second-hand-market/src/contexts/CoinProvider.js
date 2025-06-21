import React, { createContext, useState, useEffect, useContext } from "react";
import coinService from "./CoinContext";
import { useAuth } from "./AuthContext";

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshBalance = async () => {
    if (isAuthenticated) {
      const result = await coinService.getBalance();
      if (result.status === "success") {
        setBalance(result.balance);
      }
    } else {
      setBalance(0);
    }
  };

  const checkIn = async () => {
    const result = await coinService.checkIn();
    if (result.status === "success") {
      await refreshBalance();
    }
    return result;
  };

  const useCoins = async (amount) => {
    const result = await coinService.useCoins(amount);
    if (result.status === "success") {
      await refreshBalance();
    }
    return result;
  };

  useEffect(() => {
    refreshBalance();
  }, [isAuthenticated]);

  const value = {
    balance,
    refreshBalance,
    checkIn,
    useCoins,
  };

  return (
    <CoinContext.Provider value={value}>{children}</CoinContext.Provider>
  );
};

export const useCoin = () => useContext(CoinContext);
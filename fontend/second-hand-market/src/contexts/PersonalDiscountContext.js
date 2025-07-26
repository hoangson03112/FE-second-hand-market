import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const PersonalDiscountContext = createContext();

export const usePersonalDiscount = () => useContext(PersonalDiscountContext);

export const PersonalDiscountProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDiscounts = useCallback(async () => {
    if (!currentUser || !currentUser._id) {
      setDiscounts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/sellers/personal-discount/all`);

      const validDiscounts = (res.data.data || []).filter(
        (d) =>
          d.isUse === false &&
          new Date(d.endDate) > new Date() &&
          d.buyerId === currentUser._id
      );
      setDiscounts(validDiscounts);
    } catch (err) {
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // Helper: get discount for a product
  const getDiscountForProduct = (productId) => {
    return discounts.find(
      (d) => d.productId?._id === productId || d.productId === productId
    );
  };

  return (
    <PersonalDiscountContext.Provider
      value={{
        discounts,
        loading,
        fetchDiscounts,
        getDiscountForProduct,
      }}
    >
      {children}
    </PersonalDiscountContext.Provider>
  );
};

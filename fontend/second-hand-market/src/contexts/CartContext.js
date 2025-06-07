import React, { createContext, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
const CartContext = createContext();

const initialCart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  userId: null,
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useLocalStorage("cart", initialCart);

  useEffect(() => {
    if (currentUser) {
      setCart((prevCart) => ({
        ...prevCart,
        userId: currentUser._id,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const addToCart = async (productId, quantity, userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2000/eco-market/cart/add",
        {
          productId,
          quantity: quantity + "",
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching product list:", error);
      throw error;
    }
  };
  const deleteItem = async (productIds) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "http://localhost:2000/eco-market/cart/delete-item",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
          data: { productIds },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:2000/eco-market/cart/update-quantity",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  const contextValue = {
    cart,
    setCart,
    addToCart,
    deleteItem,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;

import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useTransition,
  startTransition,
} from "react";
import { useAuth } from "./AuthContext";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
const CartContext = createContext();

const initialCart = {
  items: [],
  totalItems: 0,
  userId: null,
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useLocalStorage("cart", initialCart);
  const [isInitialized, setIsInitialized] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set()); // Track items being updated
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (currentUser && currentUser.cart && !isInitialized) {
      // Only sync on first load or user change
      setCart((prevCart) => {
        if (prevCart.userId !== currentUser._id) {
          return {
            ...prevCart,
            userId: currentUser._id,
            items: currentUser.cart,
            totalItems: currentUser.cart.length,
          };
        }
        return prevCart;
      });
      setIsInitialized(true);
    }
  }, [currentUser, isInitialized]);

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/cart/add",
        {
          productId,
          quantity: quantity + "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const productInCart = cart.items.find(
        (item) => item.productId === productId
      );
      if (productInCart) {
        const updatedCart = cart.items.map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
        setCart({ ...cart, items: updatedCart });
      }
      if (!productInCart) {
        const updatedCart = [...cart.items, { productId, quantity }];
        setCart({ ...cart, items: updatedCart });
      }
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi thêm vào giỏ hàng";
      throw new Error(message);
    }
  };
  const deleteItem = async (productIds) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete("/cart/delete-item", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { productIds },
      });

      if (response.data?.cart) {
        setCart((prevCart) => ({
          ...prevCart,
          items: response.data.cart,
          totalItems: response.data.cart.length,
        }));
      }

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi xóa sản phẩm";
      throw new Error(message);
    }
  };
  const updateQuantity = async (productId, quantity) => {
    setUpdatingItems((prev) => new Set([...prev, productId]));

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/cart/update-quantity",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.cart) {
        setCart((prevCart) => ({
          ...prevCart,
          items: response.data.cart,
          totalItems: response.data.cart.length,
        }));
      }

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi cập nhật số lượng";
      throw new Error(message);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const updateQuantityOptimistic = (productId, newQuantity) => {
    startTransition(() => {
      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );

        const totalItems = newItems.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          ...prevCart,
          items: newItems,
          totalItems,
        };
      });
    });
  };

  // Rollback optimistic update if API fails
  const rollbackQuantityUpdate = (productId, originalQuantity) => {
    startTransition(() => {
      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: originalQuantity }
            : item
        );

        const totalItems = newItems.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          ...prevCart,
          items: newItems,
          totalItems,
        };
      });
    });
  };

  // Check if item is being updated
  const isItemUpdating = (productId) => {
    return updatingItems.has(productId);
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear state and localStorage
      setCart({
        items: [],
        totalItems: 0,
        userId: cart.userId,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi xóa giỏ hàng";
      throw new Error(message);
    }
  };

  const syncCartFromServer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.cart) {
        setCart((prevCart) => ({
          ...prevCart,
          items: response.data.cart,
          totalItems: response.data.cart.length,
        }));
      }

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi đồng bộ giỏ hàng";
      throw new Error(message);
    }
  };

  const contextValue = {
    cart,
    setCart,
    addToCart,
    deleteItem,
    updateQuantity,
    updateQuantityOptimistic,
    rollbackQuantityUpdate,
    isItemUpdating,
    isPending,
    clearCart,
    syncCartFromServer,
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

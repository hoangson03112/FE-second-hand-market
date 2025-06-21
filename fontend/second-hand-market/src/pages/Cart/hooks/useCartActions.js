import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { CART_CONSTANTS } from '../constants';

export const useCartActions = (updateCart, clearSelections) => {
  const navigate = useNavigate();
  const { deleteItem, updateQuantity } = useCart();

  // Check authentication and get token
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(CART_CONSTANTS.STORAGE_KEYS.TOKEN);
    if (!token) {
      alert(CART_CONSTANTS.MESSAGES.LOGIN_REQUIRED);
      navigate(CART_CONSTANTS.ROUTES.LOGIN);
      return false;
    }
    return true;
  }, [navigate]);

  // Delete multiple items
  const handleDeleteItems = useCallback(async (productIds) => {
    if (!checkAuth() || !productIds.length) return;

    try {
      const response = await deleteItem(productIds);
      if (response.status === 'success') {
        updateCart(response.cart);
        clearSelections();
      }
    } catch (error) {
      console.error('Error deleting items:', error);
      // TODO: Show user-friendly error message
    }
  }, [checkAuth, deleteItem, updateCart, clearSelections]);

  // Update item quantity
  const handleUpdateQuantity = useCallback(async (productId, change) => {
    if (!checkAuth()) return;

    try {
      const response = await updateQuantity(productId, change);
      if (response.status === 'success') {
        updateCart(response.cart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // TODO: Show user-friendly error message
    }
  }, [checkAuth, updateQuantity, updateCart]);

  // Navigate to checkout with selected items
  const handleCheckout = useCallback((selectedItems) => {
    if (selectedItems.length === 0) {
      // TODO: Show warning message
      return;
    }

    navigate(CART_CONSTANTS.ROUTES.CHECKOUT, {
      state: { selectedItems }
    });
  }, [navigate]);

  // Navigate to home page
  const handleContinueShopping = useCallback(() => {
    navigate(CART_CONSTANTS.ROUTES.HOME);
  }, [navigate]);

  return {
    handleDeleteItems,
    handleUpdateQuantity,
    handleCheckout,
    handleContinueShopping
  };
}; 
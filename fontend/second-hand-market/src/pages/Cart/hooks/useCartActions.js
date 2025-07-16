import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { useDebouncedCallback } from "../../../hooks/useDebounce";

export const useCartActions = (clearSelections) => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    updateQuantityOptimistic,
    rollbackQuantityUpdate,
    isItemUpdating,
    isPending,
    deleteItem,
  } = useCart();

  const handleDeleteItems = useCallback(
    async (productIds) => {
      try {
        // Use CartContext deleteItem method
        await deleteItem(productIds);

        // Clear selections after successful deletion
        clearSelections();
      } catch (error) {
        console.error("Error deleting items:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm");
      }
    },
    [deleteItem, clearSelections]
  );

  // Debounced optimistic update to prevent UI jank
  const [debouncedOptimisticUpdate] = useDebouncedCallback(
    (productId, newQuantity) => {
      updateQuantityOptimistic(productId, newQuantity);
    },
    50, // Very short debounce for UI updates
    [updateQuantityOptimistic]
  );

  // Debounced update quantity to prevent too many API calls
  const [debouncedUpdateQuantity] = useDebouncedCallback(
    async (productId, newQuantity, originalQuantity) => {
      try {
        await updateQuantity(productId, newQuantity);
      } catch (error) {
        console.error("Error updating quantity:", error);

        // Rollback optimistic update on error
        rollbackQuantityUpdate(productId, originalQuantity);

        alert("Có lỗi xảy ra khi cập nhật số lượng");
      }
    },
    200, // Reduced debounce time for better UX
    [updateQuantity, rollbackQuantityUpdate]
  );

  const handleUpdateQuantity = useCallback(
    (productId, change) => {
      // Get current quantity from cart
      const currentProduct = cart.items?.find(
        (item) => item.productId === productId
      );

      if (!currentProduct) {
        console.error("Product not found in cart");
        return;
      }

      const originalQuantity = currentProduct.quantity;
      const newQuantity = Math.max(1, originalQuantity + change);

      // Skip if quantity doesn't actually change
      if (newQuantity === originalQuantity) {
        return;
      }

      // Debounced UI update to prevent jank
      debouncedOptimisticUpdate(productId, newQuantity);

      // Debounced server update
      debouncedUpdateQuantity(productId, newQuantity, originalQuantity);
    },
    [cart.items, debouncedOptimisticUpdate, debouncedUpdateQuantity]
  );

  const handleSetQuantity = useCallback(
    (productId, newQuantity) => {
      // Get current quantity from cart
      const currentProduct = cart.items?.find(
        (item) => item.productId === productId
      );

      if (!currentProduct) {
        console.error("Product not found in cart");
        return;
      }

      const originalQuantity = currentProduct.quantity;
      const validQuantity = Math.max(1, Math.floor(Number(newQuantity) || 1));

      // Skip if quantity doesn't actually change
      if (validQuantity === originalQuantity) {
        return;
      }

      // Debounced UI update to prevent jank
      debouncedOptimisticUpdate(productId, validQuantity);

      // Debounced server update
      debouncedUpdateQuantity(productId, validQuantity, originalQuantity);
    },
    [cart.items, debouncedOptimisticUpdate, debouncedUpdateQuantity]
  );

  const handleCheckout = useCallback(
    (selectedItems) => {
      if (selectedItems.length === 0) {
        alert("Vui lòng chọn sản phẩm để thanh toán");
        return;
      }
      localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

      // Navigate to checkout page with state
      navigate("/eco-market/checkout", {
        state: { selectedItems },
      });

      console.log("selectedItems:", selectedItems);
    },
    [navigate]
  );

  const handleContinueShopping = useCallback(() => {
    // Navigate back to home/products page
    navigate("/eco-market/home");
  }, [navigate]);

  return {
    handleDeleteItems,
    handleUpdateQuantity,
    handleSetQuantity,
    handleCheckout,
    handleContinueShopping,
    isItemUpdating,
    isPending,
  };
};

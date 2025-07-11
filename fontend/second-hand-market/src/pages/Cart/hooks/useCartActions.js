import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from '../../../hooks/useDebounce';

export const useCartActions = (updateCart, clearSelections) => {
  const navigate = useNavigate();

  const handleDeleteItems = useCallback((productIds) => {
    // Get current products
    const currentProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    
    // Filter out deleted items
    const updatedProducts = currentProducts.filter(product => 
      !productIds.includes(product._id)
    );
    
    // Update cart
    updateCart(updatedProducts);
    
    // Save to localStorage (for persistence)
    localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
    
    // Clear selections
    clearSelections();
    
    console.log('Deleted items:', productIds);
  }, [updateCart, clearSelections]);

  // Debounced update quantity to prevent too many API calls
  const [debouncedUpdateQuantity] = useDebouncedCallback((productId, change) => {
    // Get current products
    const currentProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    
    // Update quantity
    const updatedProducts = currentProducts.map(product => {
      if (product._id === productId) {
        const newQuantity = Math.max(1, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    
    // Update cart
    updateCart(updatedProducts);
    
    // Save to localStorage
    localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
    
    console.log('Updated quantity for product:', productId, 'change:', change);
  }, 300, [updateCart]);

  const handleUpdateQuantity = useCallback((productId, change) => {
    // Immediate UI update for better UX
    const currentProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    const updatedProducts = currentProducts.map(product => {
      if (product._id === productId) {
        const newQuantity = Math.max(1, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    
    // Immediate state update
    updateCart(updatedProducts);
    
    // Debounced save to localStorage
    debouncedUpdateQuantity(productId, change);
  }, [updateCart, debouncedUpdateQuantity]);

  const handleCheckout = useCallback((selectedItems) => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    // Save selected items for checkout (backup)
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    
    // Navigate to checkout page with state
    navigate('/eco-market/checkout', {
      state: { selectedItems }
    });
    
    console.log('Proceeding to checkout with items:', selectedItems);
  }, [navigate]);

  const handleContinueShopping = useCallback(() => {
    // Navigate back to home/products page
    navigate('/eco-market/home');
  }, [navigate]);

  return {
    handleDeleteItems,
    handleUpdateQuantity,
    handleCheckout,
    handleContinueShopping
  };
}; 
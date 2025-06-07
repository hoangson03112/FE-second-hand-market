import { useContext, useCallback } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/helpers';

/**
 * Hook để quản lý giỏ hàng
 * @returns {Object} Các phương thức và trạng thái giỏ hàng
 */
const useCart = () => {
  const { cart, setCart } = useContext(CartContext);
  const { currentUser } = useAuth();

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {Object} product Sản phẩm cần thêm
   * @param {Number} quantity Số lượng
   */
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = prevCart.items.findIndex(item => item.product._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Nếu đã có, tăng số lượng
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        return {
          ...prevCart,
          items: updatedItems,
          totalItems: calculateTotalItems(updatedItems),
          totalAmount: calculateTotalAmount(updatedItems)
        };
      } else {
        // Nếu chưa có, thêm mới
        const newItem = {
          product,
          quantity,
          addedAt: new Date()
        };
        
        const updatedItems = [...prevCart.items, newItem];
        
        return {
          ...prevCart,
          items: updatedItems,
          totalItems: calculateTotalItems(updatedItems),
          totalAmount: calculateTotalAmount(updatedItems)
        };
      }
    });
  }, [setCart]);

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   * @param {String} productId ID sản phẩm
   * @param {Number} quantity Số lượng mới
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.product._id === productId 
          ? { ...item, quantity } 
          : item
      );
      
      return {
        ...prevCart,
        items: updatedItems,
        totalItems: calculateTotalItems(updatedItems),
        totalAmount: calculateTotalAmount(updatedItems)
      };
    });
  }, [setCart]);

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {String} productId ID sản phẩm cần xóa
   */
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.product._id !== productId);
      
      return {
        ...prevCart,
        items: updatedItems,
        totalItems: calculateTotalItems(updatedItems),
        totalAmount: calculateTotalAmount(updatedItems)
      };
    });
  }, [setCart]);

  /**
   * Xóa toàn bộ giỏ hàng
   */
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      userId: currentUser?._id || null
    });
  }, [setCart, currentUser]);

  /**
   * Tính tổng số sản phẩm trong giỏ hàng
   * @param {Array} items Danh sách sản phẩm
   * @returns {Number} Tổng số sản phẩm
   */
  const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Tính tổng tiền của giỏ hàng
   * @param {Array} items Danh sách sản phẩm
   * @returns {Number} Tổng tiền
   */
  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  /**
   * Format tổng tiền thành chuỗi tiền tệ
   * @returns {String} Chuỗi tiền tệ đã format
   */
  const formattedTotalAmount = formatCurrency(cart.totalAmount);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    formattedTotalAmount
  };
};

export default useCart;

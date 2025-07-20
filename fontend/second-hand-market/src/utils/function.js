import { useCallback } from "react";
import ProductContext from "../contexts/ProductContext";



export const useCartFunctions = (cart, checkedItems) => {
  const getProductPrice = useCallback(async (productID) => {
    const product = await ProductContext.getProduct(productID);
    return product.price;
  }, []);

  const getTotalAmount = useCallback(async () => {
    const itemTotals = await Promise.all(
      cart.map(async (item) => {
        const productTotals = await Promise.all(
          item.products.map(async (product) => {
            if (checkedItems[product.productId]) {
              const price = await getProductPrice(product.productId);
              return price * product.quantity;
            }
            return 0;
          })
        );
        return productTotals.reduce((sum, value) => sum + value, 0);
      })
    );
    return itemTotals.reduce((total, itemTotal) => total + itemTotal, 0);
  }, [cart, checkedItems, getProductPrice]);

  return { getProductPrice, getTotalAmount };
};
export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
export const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHr < 24) return `${diffHr} giờ trước`;
  if (diffDay === 1) return `Hôm qua lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

  // Định dạng ngày/tháng/năm và giờ/phút
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('vi-VN', options);
};
import { useCallback } from "react";
import ProductContext from "../contexts/ProductContext";

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "N/A";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

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

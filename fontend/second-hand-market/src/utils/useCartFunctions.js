import { useCallback } from "react";
import ProductContext from "../contexts/ProductContext";

const useCartFunctions = (cart, checkedItems) => {
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

export default useCartFunctions;

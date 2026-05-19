import { useCallback } from "react";
import { formatCurrency, formatNotificationTime } from "./helpers";

// Re-export commonly used functions
export { formatCurrency as formatPrice, formatNotificationTime };

interface Product {
  productId: string;
  quantity: number;
  price?: number;
}

interface CartItem {
  products: Product[];
}

interface CheckedItems {
  [key: string]: boolean;
}

interface ProductDetails {
  price: number;
  [key: string]: any;
}

// Note: This hook is deprecated - ProductContext should be replaced with proper API calls
export const useCartFunctions = (cart: CartItem[], checkedItems: CheckedItems) => {
  const getProductPrice = useCallback(async (productID: string): Promise<number> => {
    // TODO: Replace with proper API call or context hook
    // This is a temporary placeholder that will cause runtime error
    console.error('ProductContext.getProduct is not available. Please use proper API service.');
    throw new Error('ProductContext.getProduct is not available');
  }, []);

  const getTotalAmount = useCallback(async (): Promise<number> => {
    const itemTotals = await Promise.all(
      cart.map(async (item: CartItem) => {
        const productTotals = await Promise.all(
          item.products.map(async (product: Product) => {
            if (checkedItems[product.productId]) {
              try {
                const price = await getProductPrice(product.productId);
                return price * product.quantity;
              } catch (error) {
                // Fallback to product.price if available
                return (product.price || 0) * product.quantity;
              }
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

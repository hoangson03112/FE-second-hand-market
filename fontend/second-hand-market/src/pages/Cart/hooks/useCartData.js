import { useState, useEffect, useCallback, useMemo } from "react";
import AccountContext from "../../../contexts/AccountContext";
import { useProduct } from "../../../contexts/ProductContext";
import { useCart } from "../../../contexts/CartContext";

// Cache for API results to avoid repeated calls
const cache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const useCartData = () => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getProduct } = useProduct();
  const { cart } = useCart();

  // Memoized cache functions
  const getCachedData = useCallback((key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
  }, []);

  const fetchProductsWithQuantity = useCallback(
    async (cartItems) => {
      try {
        setLoading(true);
        setError(null);

        if (!cartItems || cartItems.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Parallel API calls with caching
        const productPromises = cartItems.map(async (item) => {
          const cacheKey = `product_${item.productId}`;
          const cached = getCachedData(cacheKey);

          if (cached) {
            return cached;
          }

          const product = await getProduct(item.productId);
          setCachedData(cacheKey, product);
          return product;
        });

        const productsData = await Promise.all(productPromises);

        const productsWithQuantity = productsData.map((product) => {
          const cartItem = cartItems.find(
            (item) => item.productId === product._id
          );
          return {
            ...product,
            quantity: cartItem?.quantity || 0,
          };
        });

        setProducts(productsWithQuantity);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải thông tin sản phẩm");
        setLoading(false);
      }
    },
    [getProduct, getCachedData, setCachedData]
  );

  const fetchSellers = useCallback(
    async (productList) => {
      try {
        if (productList.length === 0) {
          setSellers([]);
          return;
        }

        const uniqueSellerIds = [
          ...new Set(productList.map((product) => product.seller._id)),
        ];

        // Parallel API calls with caching for sellers
        const sellerPromises = uniqueSellerIds.map(async (sellerId) => {
          const cacheKey = `seller_${sellerId}`;
          const cached = getCachedData(cacheKey);

          if (cached) {
            return cached;
          }

          const seller = await AccountContext.getAccount(sellerId);
          setCachedData(cacheKey, seller);
          return seller;
        });

        const sellersData = await Promise.all(sellerPromises);
        setSellers(sellersData);
      } catch (err) {
        console.error("Error fetching sellers:", err);
        setError("Không thể tải thông tin người bán");
      }
    },
    [getCachedData, setCachedData]
  );

  // Fetch products when cart changes
  useEffect(() => {
    // cart.items là array từ CartContext
    const cartItems = cart.items || [];
    fetchProductsWithQuantity(cartItems);
  }, [cart.items, fetchProductsWithQuantity]);

  // Fetch sellers when products change
  useEffect(() => {
    fetchSellers(products);
  }, [products, fetchSellers]);

  // Memoized return object to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      cart,
      products,
      sellers,
      loading,
      error,
    }),
    [cart, products, sellers, loading, error]
  );

  return returnValue;
};

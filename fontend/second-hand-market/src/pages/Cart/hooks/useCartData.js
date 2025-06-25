import { useState, useEffect, useCallback } from "react";
import AccountContext from "../../../contexts/AccountContext";
import { useProduct } from "../../../contexts/ProductContext";
import { CART_CONSTANTS } from "../constants";

export const useCartData = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getProduct } = useProduct();

  const fetchCartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await AccountContext.Authentication();
      if (data?.data?.account?.cart) {
        console.log(data.data.account.cart);
        setCart(data.data.account.cart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsWithQuantity = useCallback(
    async (cartItems) => {
      try {
        if (cartItems.length === 0) {
          setProducts([]);
          return;
        }

        const productPromises = cartItems.map((item) =>
          getProduct(item.productId)
        );
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
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải thông tin sản phẩm");
      }
    },
    [getProduct]
  );

  const fetchSellers = useCallback(async (productList) => {
    try {
      if (productList.length === 0) {
        setSellers([]);
        return;
      }
      console.log(productList);
      const uniqueSellerIds = [
        ...new Set(productList.map((product) => product.seller._id)),
      ];
      const sellerPromises = uniqueSellerIds.map((sellerId) =>
        AccountContext.getAccount(sellerId)
      );

      const sellersData = await Promise.all(sellerPromises);
      setSellers(sellersData);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError("Không thể tải thông tin người bán");
    }
  }, []);

  // Initialize cart data
  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Fetch products when cart changes
  useEffect(() => {
    fetchProductsWithQuantity(cart);
  }, [cart, fetchProductsWithQuantity]);

  // Fetch sellers when products change
  useEffect(() => {
    fetchSellers(products);
  }, [products, fetchSellers]);

  const updateCart = useCallback((newCart) => {
    setCart(newCart);
  }, []);

  return {
    cart,
    products,
    sellers,
    loading,
    error,
    updateCart,
    refetchCart: fetchCartData,
  };
};

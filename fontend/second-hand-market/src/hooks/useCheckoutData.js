import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import AddressContext from "../contexts/AddressContext";
import AccountContext from "../contexts/AccountContext";
import { useNotification } from "./useNotification";
import { FORM_VALIDATION_MESSAGES } from "../constants/checkout";

export const useCheckoutData = (selectedItems) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [sellers, setSellers] = useState([]);

  const { getProduct } = useProduct();
  const { showWarning, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to cart if no items selected
    if (!selectedItems || selectedItems.length === 0) {
      showWarning(FORM_VALIDATION_MESSAGES.NO_SELECTED_ITEMS);
      navigate("/eco-market/cart");
      return;
    }

    const fetchProducts = async () => {
      try {
        // Parallel API calls for better performance
        const productsData = await Promise.all(
          selectedItems.map((item) => getProduct(item._id))
        );

        // Merge cart quantities with product data
        const productsWithQuantity = productsData.map((product) => {
          const cartItem = selectedItems.find(
            (item) => item._id === product._id
          );
          return {
            ...product,
            quantity: cartItem?.quantity || 0,
          };
        });

        setProducts(productsWithQuantity);
      } catch (error) {
        console.error("Error fetching products:", error);
        showError(FORM_VALIDATION_MESSAGES.FAILED_TO_LOAD_PRODUCTS);
      }
    };

    const fetchAddresses = async () => {
      try {
        const addresses = await AddressContext.getAddresses();
        setAddresses(addresses);

        const defaultAddress = addresses.find(
          (address) => address.isDefault === true
        );
        setSelectedAddress(defaultAddress);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        showError(FORM_VALIDATION_MESSAGES.FAILED_TO_LOAD_ADDRESSES);
      }
    };

    // Run fetchProducts and fetchAddresses in parallel for better performance
    Promise.allSettled([fetchProducts(), fetchAddresses()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedItems, navigate, showWarning, showError, getProduct]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const uniqueSellerIds = Array.from(
          new Set(products.map((product) => product.seller._id))
        );

        const sellerPromises = uniqueSellerIds.map((sellerId) =>
          AccountContext.getAccount(sellerId)
        );
        const sellersData = await Promise.all(sellerPromises);

        setSellers(sellersData);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    if (products.length > 0) {
      fetchSellers();
    }
  }, [products]);

  const refreshAddresses = async () => {
    try {
      const updatedAddresses = await AddressContext.getAddresses();
      setAddresses(updatedAddresses);
      return updatedAddresses;
    } catch (error) {
      console.error("Error refreshing addresses:", error);
      showError(FORM_VALIDATION_MESSAGES.FAILED_TO_LOAD_ADDRESSES);
      return [];
    }
  };

  return {
    loading,
    products,
    addresses,
    selectedAddress,
    setSelectedAddress,
    sellers,
    refreshAddresses,
  };
};

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import AddressContext from "../contexts/AddressContext";
import AccountContext from "../contexts/AccountContext";
import { useNotification } from "./useNotification";
import { FORM_VALIDATION_MESSAGES } from "../constants/checkout";
import SellerContext from "../contexts/SellerContext";

export const useCheckoutData = (selectedItemsParam) => {
  const selectedItems = useMemo(() => {
    if (selectedItemsParam && selectedItemsParam.length > 0) {
      return selectedItemsParam;
    }
    const local = localStorage.getItem("checkoutItems");
    return local ? JSON.parse(local) : [];
  }, [selectedItemsParam]);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [sellers, setSellers] = useState([]);
  const { getProduct } = useProduct();
  const { showWarning, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      showWarning(FORM_VALIDATION_MESSAGES.NO_SELECTED_ITEMS);
      navigate("/eco-market/my-cart");
      return;
    }

    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          selectedItems.map(async (item) => {
            const productId = item._id || item.productId;
            try {
              const product = await getProduct(productId);
              return product;
            } catch (error) {
              console.error("Error fetching product:", error);

              return item;
            }
          })
        );
        const productsWithQuantity = productsData.map((product) => {
          const cartItem = selectedItems.find(
            (item) => (item._id || item.productId) === product._id
          );
          const result = {
            ...product,
            quantity: cartItem?.quantity || 0,
          };

          return result;
        });
        if (isMounted) setProducts(productsWithQuantity);
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

    Promise.allSettled([fetchProducts(), fetchAddresses()])
      .then(() => {
        if (isMounted) setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedItems, navigate, showWarning, showError, getProduct]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const uniqueSellerIds = Array.from(
          new Set(products.map((product) => product.seller._id))
        );

        const sellerPromises = uniqueSellerIds.map(async (sellerId) => {
          const account = await AccountContext.getAccount(sellerId);
          const seller = await SellerContext.getSellerInfo(sellerId);
          return {
            ...seller.data,
            ...account,
          };
        });

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

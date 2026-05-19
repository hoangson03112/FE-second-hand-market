import { useState, useEffect } from "react";
import { useProduct } from "../contexts/ProductContext";

export function useProducts(selectedItems) {
  const { getProduct } = useProduct();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          selectedItems.map((item) => getProduct(item.productId))
        );
        setProducts(productsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [selectedItems, getProduct]);

  return { products };
} 
import React, { createContext, useContext } from "react";
import axios from "axios";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  // Các phương thức API
  const getProduct = async (productID) => {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/products/details",
        {
          params: { productID },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/products"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const getProductsByUser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:2000/eco-market/products/by-user",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  };
  const getProductList = async (categoryID, subcategoryID) => {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/products/by-category",
        {
          params: { categoryID, subcategoryID },
        }
      );
      if (response.data) {
        return response.data.data;
      } else {
        console.error("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      throw error; // Re-throw the error for proper error handling
    }
  };

  const postProduct = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2000/eco-market/products/create",
        {
          product,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching product list:", error);
      throw error;
    }
  };

  const updateProductStatus = async (slug, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      "http://localhost:2000/eco-market/products/update-status",
      {
        slug,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:2000/eco-market/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

  const contextValue = {
    getProduct,
    getProducts,
    getProductList,
    postProduct,
    updateProductStatus,
    deleteProduct,
    getProductsByUser,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;

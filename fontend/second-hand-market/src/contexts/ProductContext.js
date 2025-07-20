import React, { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const { currentUser } = useAuth();
  // Các phương thức API
  const getProduct = async (productID) => {
    try {
      const response = await axios.get("/products/details", {
        params: { productID },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get("/products");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const getProductsByUser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("/products/by-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  };
  const getProductList = async (categoryID, subcategoryID) => {
    try {
      const response = await axios.get("/products/by-category", {
        params: { categoryID, subcategoryID },
      });
      if (response.data) {
        return response.data.data.filter((product) => {
          if (currentUser) {
            return product.seller._id !== currentUser._id;
          }
          return true;
        });
      } else {
        console.error("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      throw error; // Re-throw the error for proper error handling
    }
  };

  const postProduct = async (
    productData,
    isFormData = false,
    onProgress = null
  ) => {
    try {
      const token = localStorage.getItem("token");

      let requestData, headers, config;

      if (isFormData) {
        // Sử dụng FormData (khuyến nghị cho file upload)
        requestData = productData; // FormData object
        headers = {
          Authorization: `Bearer ${token}`,
          // Không set Content-Type - để browser tự động set với boundary
        };

        // Config cho FormData với progress tracking
        config = {
          headers,
          timeout: 60000, // 60 seconds timeout cho file upload
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        };
      } else {
        // Sử dụng JSON (legacy support)
        requestData = { product: productData };
        config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      }

      const response = await axios.post(
        "/products/create",
        requestData,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Error posting product:", error);

      // Enhanced error handling
      if (error.response) {
        throw new Error(
          `Server Error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        throw new Error(
          "Không thể kết nối với server. Vui lòng kiểm tra internet."
        );
      } else {
        throw new Error(`Upload Error: ${error.message}`);
      }
    }
  };

  const updateProductStatus = async (productId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      "/products/update-status",
      {
        productId,
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
    const response = await axios.delete(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

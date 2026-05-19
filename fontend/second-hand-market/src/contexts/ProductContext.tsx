import React, { createContext, useContext } from "react";
import ApiService from "../services/ApiService";
import storage from "../utils/storage";
import { useAuth } from "./AuthContext";
const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const { currentUser } = useAuth();
  // Các phương thức API
  const getProduct = async (productID) => {
    try {
      const response = await ApiService.get("/products/details", {
        params: { productID },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const getProducts = async () => {
    try {
      const response = await ApiService.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const getProductsByUser = async () => {
    // Token automatically added by ApiService
    const response = await ApiService.get("/products/by-user");
    return response.data;
  };
  const getProductList = async (categoryID, subcategoryID) => {
    try {
      const response = await ApiService.get("/products/by-category", {
        params: { categoryID, subcategoryID },
      });
      if (response) {
        return response.data.filter((product) => {
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
      // Token automatically added by ApiService

      let requestData, headers, config;

      if (isFormData) {
        // Sử dụng FormData (khuyến nghị cho file upload)
        requestData = productData; // FormData object

        // Config cho FormData với progress tracking
        config = {
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
            "Content-Type": "application/json",
          },
        };
      }

      const response = await ApiService.post(
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
    // Token automatically added by ApiService
    const response = await ApiService.patch(
      "/products/update-status",
      {
        productId,
        status,
      }
    );

    return response.data;
  };

  const deleteProduct = async (productId) => {
    // Token automatically added by ApiService
    const response = await ApiService.delete(`/products/${productId}`);

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


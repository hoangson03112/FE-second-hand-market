import ApiService from "../../services/ApiService";

class SellerApi {
  constructor() {
    this.baseURL = "/products";
  }

  // Get all products of the seller
  async getMyProducts() {
    try {
      const response = await ApiService.get(`${this.baseURL}/my-products2`);
      return response;
    } catch (error) {
      console.error("Error fetching seller products:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy danh sách sản phẩm"
      );
    }
  }

  // Get products by user (alternative endpoint)
  async getProductsByUser() {
    try {
      const response = await ApiService.get(`${this.baseURL}/by-user`);
      return response;
    } catch (error) {
      console.error("Error fetching products by user:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy sản phẩm người dùng"
      );
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
      const formData = new FormData();

      // Add basic product data
      Object.keys(productData).forEach((key) => {
        if (key !== "images" && key !== "attributes") {
          formData.append(key, productData[key]);
        }
      });

      // Add attributes as JSON string
      if (productData.attributes) {
        formData.append("attributes", JSON.stringify(productData.attributes));
      }

      // Add images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await ApiService.post(`${this.baseURL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi tạo sản phẩm");
    }
  }

  // Update product status
  async updateProductStatus(slug, status) {
    try {
      const response = await ApiService.patch(
        `${this.baseURL}/update-status`,
        { slug, status }
      );
      return response;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái sản phẩm"
      );
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const response = await ApiService.delete(`${this.baseURL}/${productId}`);
      return response;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
    }
  }

  // Get product details
  async getProductDetails(productID) {
    try {
      const response = await ApiService.get(
        `${this.baseURL}/details?productID=${productID}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy chi tiết sản phẩm"
      );
    }
  }

  async updateProduct(productId, formData) {
    try {
      const response = await ApiService.put(
        `${this.baseURL}/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật sản phẩm"
      );
    }
  }
  async resubmitProduct(productId) {
    try {
      const response = await ApiService.patch(`${this.baseURL}/${productId}`);
      return response;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy sản phẩm theo ID"
      );
    }
  }
}

export default new SellerApi();

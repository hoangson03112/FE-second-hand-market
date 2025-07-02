import axios from "axios";

class SellerApi {
  constructor() {
    this.baseURL = "http://localhost:2000/eco-market";
  }

  // Get token from localStorage
  getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all products of the seller
  async getMyProducts() {
    try {
      const response = await axios.get(`${this.baseURL}/products/my-products`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
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
      const response = await axios.get(`${this.baseURL}/products/by-user`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
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
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && key !== 'attributes') {
          formData.append(key, productData[key]);
        }
      });

      // Add attributes as JSON string
      if (productData.attributes) {
        formData.append('attributes', JSON.stringify(productData.attributes));
      }

      // Add images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await axios.post(
        `${this.baseURL}/products/create`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi tạo sản phẩm"
      );
    }
  }

  // Update product status
  async updateProductStatus(slug, status) {
    try {
      const response = await axios.patch(
        `${this.baseURL}/products/update-status`,
        { slug, status },
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
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
      const response = await axios.delete(
        `${this.baseURL}/products/${productId}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi xóa sản phẩm"
      );
    }
  }

  // Get product details
  async getProductDetails(productID) {
    try {
      const response = await axios.get(
        `${this.baseURL}/products/details?productID=${productID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy chi tiết sản phẩm"
      );
    }
  }

  async updateProduct(productId, formData) {
  try {
    const response = await axios.put(
      `${this.baseURL}/products/${productId}`,
      formData,
      {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật sản phẩm"
    );
  }
}
}

export default new SellerApi();
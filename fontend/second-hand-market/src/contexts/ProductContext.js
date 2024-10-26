import axios from "axios";

class ProductContext {
  async getProduct(productID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/ecomarket/product",
        {
          params: { productID },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async getProductList(categoryID, subcategoryID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/ecomarket/product-list",
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
  }

  async addToCart(productId, quantity, userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2000/ecomarket/add-to-cart",
        {
          productId,
          quantity: quantity + "",
          userId,
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
      throw error; // Re-throw the error for proper error handling
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ProductContext();

import axios from "axios";

class ProductContext {
  async getProduct(productID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/product",
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
        "http://localhost:2000/eco-market/product-list",
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
        "http://localhost:2000/eco-market/add-to-cart",
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
      throw error;
    }
  }

  async postProduct(product) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2000/eco-market/product/create",
        {
          product
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
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ProductContext();

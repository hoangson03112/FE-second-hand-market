import axios from "axios";

class CategoryContext {
  async getCategories() {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/categories"
      );
      const categories = response.data.data;
      return categories;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async getCategory(categoryID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/category",
        {
          params: { categoryID },
        }
      );
      console.log(response.data);

      const category = response.data.data;
      return category;
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }

  async updateCategory(categoryID, data) {
    try {
      const response = await axios.put(
        `http://localhost:2000/eco-market/category/update?categoryID=${categoryID}`,
        {
          data,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      return;
    }
  }
}

export default new CategoryContext();

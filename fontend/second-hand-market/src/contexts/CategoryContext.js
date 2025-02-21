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
      const category = response.data.data;
      return category;
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }
}

export default new CategoryContext();

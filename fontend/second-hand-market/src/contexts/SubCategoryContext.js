import axios from "axios";

class SubCategoryContext {
  async getSubCategory(SubcategoryID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/subcategory",
        {
          params: { SubcategoryID },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }
  async addSubcategory(subcategory, parentCategoryId) {
    try {
      const response = await axios.post(
        `http://localhost:2000/eco-market/subcategory/${parentCategoryId}`,
        {
          name: subcategory.name,
          status: subcategory.status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding data:", error);
      return;
    }
  }
  async updateSubcategory(subcategory, parentCategoryId) {
    try {
      const response = await axios.put(
        "http://localhost:2000/eco-market/subcategory/update",
        {
          subcategory,
          parentCategoryId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      return;
    }
  }
  async deleteSubcategory(subcategoryID, categoryId) {
    try {
      const response = await axios.delete(
        `http://localhost:2000/eco-market/category/${categoryId}/subcategory/${subcategoryID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting data:", error);
      return;
    }
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new SubCategoryContext();

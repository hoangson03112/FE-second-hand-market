import axios from "axios";

class SubCategoryContext {
  async getSubCategory(SubcategoryID) {
    try {
      const response = await axios.get("/categories/sub", {
        params: { SubcategoryID },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }
  async addSubcategory(subcategory, parentCategoryId) {
    try {
      const response = await axios.post(`/categories/sub/${parentCategoryId}`, {
        name: subcategory.name,
        status: subcategory.status,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding data:", error);
      return;
    }
  }
  async updateSubcategory(subcategory, parentCategoryId) {
    try {
      const response = await axios.put("/categories/sub/update", {
        subcategory,
        parentCategoryId,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      return;
    }
  }
  async deleteSubcategory(subcategoryID, categoryId) {
    try {
      const response = await axios.delete(
        `/categories/${categoryId}/sub/${subcategoryID}`
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

import axios from "axios";

class SubCategoryContext {
  async getSubCategory(SubcategoryID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/ecomarket/subcategory",
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
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new SubCategoryContext();

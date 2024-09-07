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
      console.log(response.data);

      const Subcategory = response.data.data;
      return Subcategory;
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }
}
export default new SubCategoryContext();

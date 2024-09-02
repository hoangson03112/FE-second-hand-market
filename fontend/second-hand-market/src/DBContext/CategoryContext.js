import axios from "axios";

class CategoryContext {
  async getCatgories() {
    try {
      const response = await axios.get(
        "http://localhost:2000/ecomarket/categories"
      );
      const categories = response.data.data;
      return categories; // Trả về mảng categories khi dữ liệu đã được nhận
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; // Trả về một mảng rỗng nếu có lỗi
    }
  }

  async getCategory(categoryID) {
    try {
      const response = await axios.get(
        "http://localhost:2000/ecomarket/category",
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

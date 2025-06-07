import React, { createContext, useContext } from "react";
import axios from "axios";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  // Các phương thức API
  const getCategories = async () => {
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
  };

  const getCategory = async (categoryID) => {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/categories/details",
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
  };

  const updateCategory = async (categoryID, data) => {
    try {
      const response = await axios.put(
        `http://localhost:2000/eco-market/categories/update?categoryID=${categoryID}`,
        {
          data,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      return;
    }
  };

  const contextValue = {
    getCategories,
    getCategory,
    updateCategory,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;

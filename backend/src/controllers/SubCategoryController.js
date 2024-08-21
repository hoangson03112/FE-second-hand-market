const SubCategory = require("../models/SubCategory");

async function getAllSubCategory() {
  try {
    const SubCategories = await SubCategory.find({});
    return SubCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

module.exports = { getAllSubCategory };

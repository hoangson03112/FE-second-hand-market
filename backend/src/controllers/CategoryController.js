// controllers/CategoryController.js
const Category = require("../models/category");

async function getAllCategories() {
  try {
    const categories = await Category.find({});
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function addCate(data, res) {
  try {
    const category = new Category(data);
    await category.save();
    res.status(201).json({
      success: true,
      data: category,
    }); // Gửi phản hồi thành công
  } catch (error) {
    console.error("Error storing category:", error);
    res.status(500).send("Error storing category"); // Sử dụng res để gửi phản hồi lỗi
  }
}
module.exports = { getAllCategories, addCate };

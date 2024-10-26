const Category = require("../models/category");

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find({});

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching categories",
        error: error.message,cd 
      });
    }
  }

  async getCategory(req, res) {
    try {
      const category = await Category.findById(req.query.categoryID);

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching categories",
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryController();

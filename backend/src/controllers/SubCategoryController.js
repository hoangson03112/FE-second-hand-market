class SubCategoryController {
  async getSubCategory(req, res) {
    try {
      const categories = await Category.find({});
      const subcategoryID = req.query.SubcategoryID;
      let foundCategory = null;
      let foundSubcategory = null;

      // Duyệt qua tất cả các category để tìm subcategory có id khớp
      for (const category of categories) {
        foundSubcategory = category.subcategories.find(
          (sub) => sub._id === subcategoryID
        );
        if (foundSubcategory) {
          foundCategory = category;
          break;
        }
      }
      res.json({
        success: true,
        subcategory: foundSubcategory,
        category: foundCategory,
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

module.exports = new SubCategoryController();

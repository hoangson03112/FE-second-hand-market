const { getAllSubCategory } = require("../controllers/SubCategoryController");

const SubCategoryHandle = async (req, res) => {
  try {
    const subcategory = await getAllSubCategory();
    res.json({
      success: true,
      data: subcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};
module.exports = { SubCategoryHandle };

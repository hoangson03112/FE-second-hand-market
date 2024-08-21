const {
  getAllCategories,
  addCate,
} = require("../controllers/CategoryController");

const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    await addCate(req.body, res); // Truyền res vào addCate
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};
module.exports = { getCategories, addCategory };

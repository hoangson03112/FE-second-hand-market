const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");
const router = express.Router();

router.get("/categories", CategoryController.getAllCategories);
router.get("/productlist", ProductController.getProductList);
router.get("/category", CategoryController.getCategory);
router.get("/product", ProductController.getProduct);

module.exports = router;


const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");
const AccountController = require("../controllers/AccountController");
const SubCategoryController = require("../controllers/SubCategoryController");

const router = express.Router();

router.get("/categories", CategoryController.getAllCategories);
router.get("/product-list", ProductController.getProductList);
router.get("/subcategory", SubCategoryController.getSubCategory);
router.get("/category", CategoryController.getCategory);
router.get("/product", ProductController.getProduct);
router.post("/login", AccountController.Login);
router.get("/authentication", AccountController.Authentication);
router.post("/register", AccountController.Register);
router.post("/verify", AccountController.Verify);
router.post("/add-to-cart", ProductController.addToCart);
router.post("/purchase-now", ProductController.purchaseNow);
module.exports = router;

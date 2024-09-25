const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");
const AccountController = require("../controllers/AccountController");
const SubCategoryController = require("../controllers/SubCategoryController");
const CartController = require("../controllers/CartController");

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
router.post("/add-to-cart", CartController.addToCart);
router.post("/purchase-now", CartController.purchaseNow);
router.delete("/delete-item", CartController.deleteItem);
router.put("/update-item-quantity", CartController.updateQuantity);
router.post("/admin/create-account", AccountController.createAccountByAdmin);
router.put(
  "/admin/update-account/:userId",
  AccountController.updateAccountByAdmin
);
router.get("/admin/get-accounts", AccountController.getAccountsByAdmin);
router.get("/account/:id", AccountController.getAccountById);

module.exports = router;

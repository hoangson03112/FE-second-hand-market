const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");
const AccountController = require("../controllers/AccountController");
const SubCategoryController = require("../controllers/SubCategoryController");
const CartController = require("../controllers/CartController");
const verifyToken = require("../middlewave/verifyToken");
const ChatController = require("../controllers/ChatController");
const OrderController = require("../controllers/OrderController");

const router = express.Router();

router.get("/categories", CategoryController.getAllCategories);
router.get("/product-list", ProductController.getProductList);
router.get("/subcategory", SubCategoryController.getSubCategory);
router.get("/category", CategoryController.getCategory);
router.get("/product", ProductController.getProduct);

router.post("/register", AccountController.Register);
router.post("/verify", AccountController.Verify);
router.post("/login", AccountController.Login);

router.get("/authentication", verifyToken, AccountController.Authentication);
router.get("/messages", verifyToken, ChatController.getAllChat);
router.post("/orders", verifyToken, OrderController.createOrder);
router.get("/my-orders", verifyToken, OrderController.getOrderByAccount);

router.post("/add-to-cart", verifyToken, CartController.addToCart);
router.post("/purchase-now", verifyToken, CartController.purchaseNow);
router.delete("/delete-item", verifyToken, CartController.deleteItem);
router.put("/update-item-quantity", verifyToken, CartController.updateQuantity);
router.post("/admin/create-account", AccountController.createAccountByAdmin);
router.put(
  "/admin/update-account/:userId",
  AccountController.updateAccountByAdmin
);
router.get("/admin/get-accounts", AccountController.getAccountsByAdmin);
router.get("/account/:id", AccountController.getAccountById);

module.exports = router;

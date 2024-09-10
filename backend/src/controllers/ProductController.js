const Account = require("../models/Account");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

class ProductController {
  async getProductList(req, res) {
    try {
      const { categoryID, subcategoryID } = req.query;

      if (!categoryID && !subcategoryID) {
        return res.status(400).json({
          success: false,
          message: "At least one of Category ID or Subcategory ID is required",
        });
      }

      const query = {};
      if (categoryID) {
        query.categoryId = categoryID;
      }
      if (subcategoryID) {
        query.subcategoryId = subcategoryID;
      }
      const products = await Product.find(query);

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getProduct(req, res) {
    try {
      const { productID } = req.query;

      const product = await Product.findById({ _id: productID });

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async addToCart(req, res) {
    const { productId, quantity } = req.body;
    const userId = "66dec2831ca1635c708cfcce"; // Assuming you have user authentication

    try {
      // Tìm Account theo userId
      let account = await Account.findById(userId);

      if (!account) {
        return res.status(404).json({ message: "User not found" });
      }

      const productIndex = account.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        account.cart[productIndex].quantity =
          parseInt(account.cart[productIndex].quantity, 10) +
          parseInt(quantity, 10);
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
        account.cart.push({ productId, quantity });
      }

      // Lưu lại Account sau khi cập nhật giỏ hàng
      await account.save();

      return res.status(200).json({
        status: "success",
        message: "Đã thêm sản phẩm vào giỏ hàng thành công.",
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async purchaseNow(req, res) {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // assuming you have user authentication

    // Xử lý việc mua ngay, có thể tạo một order và thanh toán luôn
    Order.create({ userId, products: [{ productId, quantity }] })
      .then((order) => {
        // Sau khi tạo order có thể xử lý thanh toán và phản hồi lại trạng thái
        res.status(200).json(order);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  }
}

module.exports = new ProductController();

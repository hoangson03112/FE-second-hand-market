const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

class CartController {
  async addToCart(req, res) {
    const { productId, quantity } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "No token provided" });
    }

    const data = jwt.verify(token, "sown");

    try {
      // Tìm Account theo userId
      let account = await Account.findById(data);

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

  async deleteItem(req, res) {
    const { ids } = req.body; // Mảng chứa các productId cần xóa

    // Kiểm tra token trong header của request
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "No token provided" });
    }

    // Xác thực token và lấy thông tin người dùng
    let data;
    try {
      data = jwt.verify(token, "sown"); // "sown" là secret key, hãy chắc chắn secret này được bảo mật
    } catch (err) {
      return res
        .status(403)
        .json({ status: "error", message: "Invalid token" });
    }

    try {
      // Tìm account và xóa các sản phẩm có productId nằm trong mảng idsToDeleted
      const account = await Account.findOneAndUpdate(
        { _id: data }, // Dựa trên userId từ token
        { $pull: { cart: { productId: { $in: ids } } } }, // Xóa các mục trong cart có productId trong idsToDeleted
        { new: true } // Trả về đối tượng đã cập nhật
      );

      if (!account) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      // Phản hồi lại giỏ hàng đã được cập nhật sau khi xóa
      res.status(200).json({
        status: "success",
        message: "Items removed from cart",
        cart: account.cart, // Trả lại giỏ hàng sau khi cập nhật
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
  async updateQuantity(req, res) {
    const { productId, quantity } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "No token provided" });
    }

    const data = jwt.verify(token, "sown");

    if (quantity === 0) {
      const account = await Account.findOneAndUpdate(
        { _id: data }, // Dựa trên userId từ token
        { $pull: { cart: { productId: { $in: productId } } } }, // Xóa các mục trong cart có productId trong idsToDeleted
        { new: true } // Trả về đối tượng đã cập nhật
      );

      res.status(200).json({
        status: "success",
        message: "Items removed from cart",
        cart: account.cart, // Trả lại giỏ hàng sau khi cập nhật
      });
    } else {
      try {
        // Giả sử bạn có mô hình giỏ hàng và cập nhật số lượng sản phẩm
        await Account.findOneAndUpdate(
          { _id: data, "cart.productId": productId }, // Tìm account với productId trong giỏ hàng
          { $set: { "cart.$.quantity": quantity } }, // Cập nhật số lượng của sản phẩm trong giỏ hàng
          { new: true }
        );

        res.status(200).send({ message: "Quantity updated successfully" });
      } catch (error) {
        res.status(500).send({ message: "Error updating quantity" });
      }
    }
  }
}
module.exports = new CartController();

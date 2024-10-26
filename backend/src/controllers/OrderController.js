const Order = require("../models/Order");

class OrderController {
  async createOrder(req, res) {
    console.log(req.accountID);

    try {
      const { products, totalAmount, shippingAddress, shippingMethod } =
        req.body;
      console.log(req.body);

      if (!products || !totalAmount || !shippingAddress || !shippingMethod) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
      }

      const newOrder = new Order({
        userId: req.accountID,
        products,
        totalAmount,
        shippingAddress,
        shippingMethod,
      });


      
      await newOrder.save();
      res.status(201).json({ message: "Đơn hàng đã được tạo thành công!" });
    } catch (error) {
      console.error("Error processing order:", error);

      // Trả về phản hồi lỗi
      res.status(500).json({ message: "Có lỗi xảy ra khi xử lý đơn hàng." });
    }
  }
  async getOrderByAccount(req, res) {
    try {
      const orders = await Order.find({ userId: req.accountID });

      if (!orders.length) {
        return res
          .status(404)
          .json({ message: "No orders found for this account" });
      }

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new OrderController();

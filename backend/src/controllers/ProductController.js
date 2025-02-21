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

  async addProduct(req, res) {
    try {
      const product = req.body;
      const newProduct = new Product({ ...product, sellerId: req.accountID });
      await newProduct.save();
      res.status(201).json({ message: 'Thêm sản phẩm thành công.', product: newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi thêm sản phẩm.', error: error.message });
    }

  }

}

module.exports = new ProductController();

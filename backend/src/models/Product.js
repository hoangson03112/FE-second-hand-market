const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    images: { type: [String], required: false },
    avatar: { type: String, required: true },
    accountId: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến tài khoản người bán
      ref: "accounts",
    },
  },
  { timestamps: true, collection: "products" }
);

module.exports = mongoose.model("Product", ProductSchema);

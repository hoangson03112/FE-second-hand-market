const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const ProductSchema = new Schema(
  {
    name: { type: String, required: false },
    slug: { type: String, slug: "name", unique: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    price: { type: Number, required: false },
    description: { type: String, required: false },
    images: { type: [String], required: false },
    avatar: { type: String, required: false },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    location: { type: String, required: false },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },

  { timestamps: true, collection: "products" }
);

module.exports = mongoose.model("Product", ProductSchema);

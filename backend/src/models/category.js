// models/Category.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
    url: { type: String }, // Thay { String } bằng { type: String }
  },
  { timestamps: true, collection: "category" } // Đặt tất cả tùy chọn trong một đối tượng
);
mongoose.plugin(slug);
module.exports = mongoose.model("Category", CategorySchema);

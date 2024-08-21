// models/Category.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategory = new Schema(
  {
    name: String,
    cateID: String,
  },
  { collection: "subcate" }
); // Chỉ định tên collection

module.exports = mongoose.model("SubCategory", SubCategory);

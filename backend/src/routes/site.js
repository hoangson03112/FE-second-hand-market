const express = require("express");

const { getCategories, addCategory } = require("../handles/CategoryHandle");
const { SubCategoryHandle } = require("../handles/SubCategoryHandle");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/subcategory", SubCategoryHandle);
router.post("/categories", addCategory);
module.exports = router;

const express = require("express");
const { handleGetAllProducts } = require("../controllers/products");

const router = express.Router();

router.route("/").get(handleGetAllProducts);

module.exports = router;

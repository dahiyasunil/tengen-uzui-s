const Product = require("../models/product.model");

const handleGetAllProducts = async (req, res) => {
  try {
    const keywords = req.query.search;
    const allProducts = keywords
      ? await Product.find({ $text: { $search: keywords } })
      : await Product.find();
    return res.status(200).json(allProducts);
  } catch (err) {
    console.error(
      "An error occured while trying to fetch all products.\nError: \n" + err,
    );
    next(err);
  }
};

module.exports = { handleGetAllProducts };

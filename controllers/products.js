const Product = require("../models/product.model");

const handleGetAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    return res.status(200).json(allProducts);
  } catch (err) {
    console.error(
      "An error occured while trying to fetch all products.\nError: \n" + err
    );
    return res.status(500).json({ err: "Please try again later!" });
  }
};

module.exports = { handleGetAllProducts };

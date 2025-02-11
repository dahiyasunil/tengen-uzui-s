const Product = require("../models/product.model");
const User = require("../models/user.model");

const getProducts = async (keywords) => {
  return keywords
    ? await Product.find({ $text: { $search: keywords } })
    : await Product.find();
};

const enrichWithWishlistFlag = (products, wishlistItems) => {
  const enrichedProducts = products.map((product) => {
    const wishlistedItem = wishlistItems.find(
      (item) => item === product._id.toString(),
    );
    let enrichedProduct = JSON.parse(JSON.stringify(product));
    if (wishlistedItem) {
      enrichedProduct.isWishlisted = true;
    } else {
      enrichedProduct.isWishlisted = false;
    }
    return enrichedProduct;
  });
  return enrichedProducts;
};

const handleGetAllProducts = async (req, res, next) => {
  try {
    const keywords = req.query.search;
    const mobileNo = req.get("X-Mobile-No");
    let products = [];
    if (mobileNo) {
      const user = await User.findOne({ mobileNumber: mobileNo });
      const wishlistItems = user.wishlist.map((item) => item.toString());
      products = enrichWithWishlistFlag(
        await getProducts(keywords),
        wishlistItems,
      );
    } else {
      products = await getProducts(keywords);
    }
    return res.status(200).json(products);
  } catch (err) {
    console.error(
      "An error occured while trying to fetch all products.\nError: \n" + err,
    );
    next(err);
  }
};

module.exports = { handleGetAllProducts };

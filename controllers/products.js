const Product = require("../models/product.model");
const User = require("../models/user.model");

const getProducts = async (keywords) => {
  try {
    if (keywords) {
      return await Product.find({ $text: { $search: keywords } });
    }
    return await Product.find();
  } catch (err) {
    console.error(`Error fetching products: ${err}`);
    throw err;
  }
};

const enrichWithWishlistFlag = (products, wishlistItems) => {
  return products.map((product) => {
    const isWishlisted = wishlistItems.includes(product._id.toString());
    return {
      ...product.toObject(),
      isWishlisted,
    };
  });
};

const handleGetAllProducts = async (req, res, next) => {
  const keywords = req.query.search;
  const mobileNo = req.get("X-Mobile-No");

  try {
    let products = await getProducts(keywords);

    if (mobileNo) {
      const user = await User.findOne({ mobileNumber: mobileNo });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const wishlistItems = user.wishlist.map((item) => item.toString());
      products = enrichWithWishlistFlag(products, wishlistItems);
    }

    console.log(`Fetched ${products.length} products`);

    return res.status(200).json(products);
  } catch (err) {
    console.error(`Error fetching products for mobileNo ${mobileNo}:`, err);
    next(err);
  }
};

module.exports = { handleGetAllProducts };

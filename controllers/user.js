const User = require("../models/user.model");

const handleUserLogin = async (req, res, next) => {
  try {
    const mobileNumber = Number(req.params.mobileNumber);
    let user = await User.findOne({ mobileNumber });
    if (!user) {
      user = new User({ mobileNumber });
      await user.save();
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(
      `An error occured while trying to save/get user.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleAddToWishlist = async (req, res, next) => {
  try {
    const { userId, productObjId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productObjId } },
      { new: true },
    );
    console.log(user);
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(
      `An error occured while trying to add product to wishlist.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleRemoveFromWishlist = async (req, res, next) => {
  try {
    const { userId, productObjId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productObjId } },
      { new: true },
    );
    console.log(user);

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(
      `An error occured while trying to remove product to wishlist.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleGetWishlistItems = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate("wishlist");
    const wishlistedItems = user.wishlist.map((item) => {
      let enrichedProduct = JSON.parse(JSON.stringify(item));
      enrichedProduct.isWishlisted = true;
      return enrichedProduct;
    });
    console.log(wishlistedItems);

    return res.status(200).json({ wishlist: wishlistedItems });
  } catch (err) {
    console.error(
      `An error occured while trying to fetch wishlist.\nError:\n${err}`,
    );
    next(err);
  }
};

module.exports = {
  handleUserLogin,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleGetWishlistItems,
};

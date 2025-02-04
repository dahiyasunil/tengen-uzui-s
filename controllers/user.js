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
    res.status(200).json({ user });
  } catch (err) {
    console.error(
      `An error occured while trying to add product to wishlist.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleGetWishlistItems = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate("wishlist");
    return res.status(200).json({ wishlist: user.wishlist });
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
  handleGetWishlistItems,
};

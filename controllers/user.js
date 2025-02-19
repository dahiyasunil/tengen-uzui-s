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
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(
      `An error occured while trying to remove product from wishlist.\nError:\n${err}`,
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
    return res.status(200).json({ wishlist: wishlistedItems });
  } catch (err) {
    console.error(
      `An error occured while trying to fetch wishlist.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleAddProductToCart = async (req, res, next) => {
  try {
    const { userId, productObjId, quantity } = req.body;
    const user = await User.findById(userId);

    const existingItem = user.bag.findIndex(
      (item) => item.item.toString() === productObjId,
    );

    if (existingItem != -1) {
      user.bag[existingItem].quantity += quantity;
    } else {
      user.bag.push({ item: productObjId, quantity });
    }
    await user.save();
    res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(
      `An error occured while trying to add product to cart.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleRemoveProductFromCart = async (req, res, next) => {
  try {
    const { userId, productObjId } = req.body;
    const user = await User.findById(userId);
    const itemIndex = user.bag.findIndex(
      (item) => item.item.toString() === productObjId,
    );
    user.bag.splice(itemIndex, 1);
    await user.save();
    res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(
      `An error occured while trying to remove product from cart.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleGetCartItems = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId }).populate("bag.item");
    return res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(
      `An error occured while trying to fetch cart items.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleUpdateItemQuantity = async (req, res, next) => {
  try {
    const { userId, productObjId, quantity } = req.body;
    const user = await User.findById(userId);
    const itemIndex = user.bag.findIndex(
      (item) => item.item.toString() === productObjId,
    );
    user.bag[itemIndex].quantity = quantity;
    await user.save();
    return res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(
      `An error occured while trying to update item quanity.\nError:\n${err}`,
    );
    next(err);
  }
};

module.exports = {
  handleUserLogin,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleGetWishlistItems,
  handleAddProductToCart,
  handleRemoveProductFromCart,
  handleGetCartItems,
  handleUpdateItemQuantity,
};

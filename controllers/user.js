const Address = require("../models/address.model");
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

const handleUpdateUserPersonalInfo = async (req, res, next) => {
  try {
    const { userId, payload } = req.body;
    const user = await User.findById(userId);
    if (payload.name && payload.name.trim() !== "") {
      user.name = payload.name.trim();
    }
    if (payload.email && payload.email.trim() !== "") {
      user.emailId = payload.email.trim();
    }
    await user.save();
    return res.status(200).json({ user });
  } catch (err) {
    console.error(
      `An error occured while trying to update user personal information.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleAddAddress = async (req, res, next) => {
  try {
    const { userId, payload } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      payload === null ||
      !payload.name ||
      !payload.mobile ||
      !payload.pincode ||
      !payload.addressLine1 ||
      !payload.addressLine2 ||
      !payload.townCity ||
      !payload.state
    ) {
      return res
        .status(400)
        .json({ message: "Invalid address." });
    }

    const newAddress = new Address(payload);
    await newAddress.save();
    user.addresses.push(newAddress._id);
    await user.save();
    return res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    console.error(
      `An error occured while trying to add address.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleGetAllAddress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error(
      `An error occured while trying to get all addresses.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleEditAddress = async (req, res, next) => {
  try {
    const { userId, payload } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      typeof payload.address !== "object" ||
      Array.isArray(payload.address) ||
      !payload.addressObjId ||
      payload.address  === null ||
      !payload.address.name ||
      !payload.address.mobile ||
      !Number(payload.address.mobile) ||
      String(payload.address.mobile).length !==10 ||
      !Number(payload.address.pincode) ||
      String(payload.address.pincode).length !==6 ||
      !payload.address.pincode ||
      !payload.address.addressLine1 ||
      !payload.address.addressLine2 ||
      !payload.address.townCity ||
      !payload.address.state
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Address" });
    }
    const address = await Address.findByIdAndUpdate(payload.addressObjId,payload.address,{ new: true })
    await address.save();
    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error(
      `An error occured while trying to add address.\nError:\n${err}`,
    );
    next(err);
  }
};

const handleDeleteAddress = async (req, res, next) => {
  try {
    const { userId, addressObjId } = req.query;    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const removeAddressIndex = user.addresses.findIndex((address)=> address.toString() === addressObjId);
    if(removeAddressIndex === -1){
      return res.status(404).json({ message: "Address not found!" });
    }
    user.addresses.splice(removeAddressIndex,1);
    await user.save();
    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error(
      `An error occured while trying to delete address.\nError:\n${err}`,
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
  handleUpdateUserPersonalInfo,
  handleAddAddress,
  handleGetAllAddress,
  handleEditAddress,
  handleDeleteAddress
};

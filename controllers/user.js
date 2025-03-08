const Address = require("../models/address.model");
const User = require("../models/user.model");

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return user;
};

const handleUserLogin = async (req, res, next) => {
  const { mobileNumber } = req.params;

  if (!mobileNumber || isNaN(mobileNumber)) {
    return res.status(400).json({ message: "Valid mobileNumber is required" });
  }
  try {
    const normalizedMobileNumber = Number(mobileNumber);
    let user = await User.findOne({ mobileNumber: normalizedMobileNumber });

    if (!user) {
      user = new User({ mobileNumber: normalizedMobileNumber });
      await user.save();

      console.log(
        `New user created with mobileNumber: ${normalizedMobileNumber}`,
      );
    } else {
      console.log(
        `User logged in with mobileNumber: ${normalizedMobileNumber}`,
      );
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(
      `Error during user login for mobileNumber ${mobileNumber}:`,
      err,
    );
    next(err);
  }
};

const handleAddToWishlist = async (req, res, next) => {
  const { userId, productObjId } = req.body;

  if (!userId || !productObjId) {
    return res
      .status(400)
      .json({ message: "userId and productObjId are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productObjId } },
      { new: true },
    );

    console.log(`Product ${productObjId} added to wishlist for user ${userId}`);

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(`Error adding product to wishlist for user ${userId}:`, err);
    next(err);
  }
};

const handleRemoveFromWishlist = async (req, res, next) => {
  const { userId, productObjId } = req.body;

  if (!userId || !productObjId) {
    return res
      .status(400)
      .json({ message: "userId and productObjId are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productObjId } },
      { new: true },
    );

    console.log(
      `Product ${productObjId} removed from wishlist for user ${userId}`,
    );

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(
      `Error removing product from wishlist for user ${userId}:`,
      err,
    );
    next(err);
  }
};

const handleGetWishlistItems = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await getUser(userId);

    await user.populate("wishlist");

    const wishlistedItems = user.wishlist.map((item) => {
      let enrichedProduct = JSON.parse(JSON.stringify(item));
      enrichedProduct.isWishlisted = true;
      return enrichedProduct;
    });

    console.log(`Fetched and enriched wishlist items for user ${userId}`);

    return res.status(200).json({ wishlist: wishlistedItems });
  } catch (err) {
    console.error(`Error fetching wishlist items for user ${userId}:`, err);
    next(err);
  }
};

const handleAddProductToCart = async (req, res, next) => {
  const {
    userId,
    itemData: { productObjId, quantity, size },
  } = req.body;

  if (!userId || !productObjId || !quantity || !size) {
    return res.status(400).json({
      message: "userId, productObjId, quantity and size are required",
    });
  }

  try {
    const user = await getUser(userId);

    const existingItemIndex = user.bag.findIndex(
      (item) => item.item.toString() === productObjId && item.size === size,
    );

    if (existingItemIndex === -1) {
      user.bag.push({ item: productObjId, quantity, size });
      await user.save();

      console.log(`Product ${productObjId} added to cart for user ${userId}`);
    } else {
      console.log(
        `Product ${productObjId} already exists in cart for user ${userId}`,
      );
    }

    res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(`Error adding product to cart for user ${userId}:`, err);
    next(err);
  }
};

const handleRemoveProductFromCart = async (req, res, next) => {
  const {
    userId,
    itemData: { productObjId, quantity, size },
  } = req.body;

  if (!userId || !productObjId || !quantity || !size) {
    return res.status(400).json({
      message: "userId, productObjId, quantity and size are required",
    });
  }

  try {
    const user = await getUser(userId);

    const existingItemIndex = user.bag.findIndex(
      (item) => item.item.toString() === productObjId && item.size === size,
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    user.bag.splice(existingItemIndex, 1);
    await user.save();

    console.log(`Product ${productObjId} removed from cart for user ${userId}`);

    return res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(`Error removing product from cart for user ${userId}:`, err);
    next(err);
  }
};

const handleClearCart = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await getUser(userId);

    user.bag = [];
    await user.save();

    console.log(`Cart cleared for user ${userId}`);

    return res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(`Error clearing cart for user ${userId}:`, err);
    next(err);
  }
};

const handleGetCartItems = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await getUser(userId);

    await user.populate("bag.item");

    console.log(`Fetched cart items for user ${userId}`);

    return res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(`Error fetching cart items for user ${userId}:`, err);
    next(err);
  }
};

const handleUpdateItemQuantity = async (req, res, next) => {
  const { userId, productObjId, quantity } = req.body;

  if (!userId || !productObjId || !quantity) {
    return res
      .status(400)
      .json({ message: "userId, productObjId and quantity are required" });
  }

  try {
    const user = await getUser(userId);

    const existingItemIndex = user.bag.findIndex(
      (item) => item.item.toString() === productObjId,
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({ error: "Item not found in bag" });
    }
    user.bag[existingItemIndex].quantity = quantity;
    await user.save();

    console.log(
      `Updated quantity for product ${productObjId} in cart for user ${userId}`,
    );

    return res.status(200).json({ cart: user.bag });
  } catch (err) {
    console.error(`Error updating item quantity for user ${userId}:`, err);
    next(err);
  }
};

const handleUpdateUserPersonalInfo = async (req, res, next) => {
  const {
    userId,
    payload: { name, email },
  } = req.body;

  if (!userId || !name || !email) {
    return res
      .status(400)
      .json({ message: "userId, name and email are required" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await getUser(userId);

    if (name && name.trim() !== "") {
      user.name = name.trim();
    }
    if (email && email.trim() !== "") {
      user.emailId = email.trim();
    }

    await user.save();

    console.log(`Updated personal information for user ${userId}`);

    return res.status(200).json({ user });
  } catch (err) {
    console.error(
      `Error updating personal information for user ${userId}:`,
      err,
    );
    next(err);
  }
};

const handleAddAddress = async (req, res, next) => {
  const { userId, payload } = req.body;

  if (!userId || !payload) {
    return res.status(400).json({
      message: `userId and payload are required`,
    });
  }

  const { name, mobile, pincode, addressLine1, addressLine2, townCity, state } =
    payload;

  if (
    !name ||
    !mobile ||
    !pincode ||
    !addressLine1 ||
    !addressLine2 ||
    !townCity ||
    !state
  ) {
    return res.status(400).json({
      message: `name, mobile, pincode, addressLine1, addressLine2, townCity and state are required`,
    });
  }

  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: "Invalid mobile number format" });
  }

  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode format" });
  }

  try {
    const user = await getUser(userId);

    const newAddress = new Address(payload);
    await newAddress.save();

    console.log(`Saved address for user ${userId}`);

    user.addresses.push(newAddress._id);
    await user.save();

    return res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    console.error(`Error adding address for user ${userId}:`, err);
    next(err);
  }
};

const handleGetAllAddress = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await getUser(userId);

    await user.populate("addresses");

    console.log(`Fetched all addresses for user ${userId}`);

    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error(`Error fetching addresses for user ${userId}:`, err);
    next(err);
  }
};

const handleEditAddress = async (req, res, next) => {
  const { userId, payload } = req.body;

  if (!userId || !payload || !payload.addressObjId || !payload.address) {
    return res.status(400).json({
      message: "userId, payload, addressObjId, and address are required",
    });
  }

  const { name, mobile, pincode, addressLine1, addressLine2, townCity, state } =
    payload.address;

  if (
    !name ||
    !mobile ||
    !pincode ||
    !addressLine1 ||
    !addressLine2 ||
    !townCity ||
    !state
  ) {
    return res.status(400).json({
      message:
        "Name, mobile, pincode, addressLine1, addressLine2, townCity and state fields are required",
    });
  }

  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: "Invalid mobile number format" });
  }

  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode format" });
  }

  try {
    const user = await getUser(userId);

    const addressBelongsToUser = user.addresses.includes(payload.addressObjId);
    if (!addressBelongsToUser) {
      return res
        .status(403)
        .json({ message: "Address does not belong to the user" });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      payload.addressObjId,
      payload.address,
      { new: true },
    );

    await updatedAddress.save();

    console.log(`Updated address ${payload.addressObjId} for user ${userId}`);

    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error(`Error updating address for user ${userId}:`, err);
    next(err);
  }
};

const handleDeleteAddress = async (req, res, next) => {
  const { userId, addressObjId } = req.query;

  if (!userId || !addressObjId) {
    return res
      .status(400)
      .json({ message: "userId and addressObjId are required" });
  }

  try {
    const user = await getUser(userId);

    const addressBelongsToUser = user.addresses.includes(addressObjId);
    if (!addressBelongsToUser) {
      return res
        .status(403)
        .json({ message: "Address does not belong to the user" });
    }

    user.addresses = user.addresses.filter(
      (address) => address.toString() !== addressObjId,
    );

    await Address.findByIdAndDelete(addressObjId);

    await user.save();

    console.log(`Deleted address ${addressObjId} for user ${userId}`);

    return res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error(`Error deleting address for user ${userId}:`, err);
    next(err);
  }
};

const handleOrder = async (req, res, next) => {
  const { userId, deliveryAddress } = req.body;

  if (!userId || !deliveryAddress) {
    return res
      .status(400)
      .json({ message: "userId and deliveryAddress are required" });
  }
  try {
    const user = await getUser(userId);

    const address = await Address.findById(deliveryAddress._id);
    if (!address) {
      return res.status(404).json({ message: "Delivery address not found" });
    }

    await user.populate("bag.item");

    if (user.bag.length === 0) {
      return res.status(400).json({ message: "Bag is empty" });
    }

    const order = {
      items: user.bag.map((item) => ({
        item: item.item._id,
        quantity: item.quantity,
        size: item.size,
        price: item.item.price.amount,
        discount: item.item.discount?.percentage,
      })),
      deliveryAddress: address,
    };

    order.totalDiscount = order.items.reduce((acc, curr) => {
      if (curr.discount) {
        acc += Math.round((curr.price * curr.discount) / 100) * curr.quantity;
      }
      return acc;
    }, 0);

    order.totalPrice = order.items.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);

    user.orders.unshift(order);

    await user.save();

    console.log(`Order placed successfully for user ${userId}`);

    return res.status(200).json({ orders: user.orders });
  } catch (err) {
    console.error(`Error placing order for user ${userId}:`, err);
    next(err);
  }
};

const handleGetOrders = async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    const user = await getUser(userId);

    await user.populate("orders.items.item");

    console.log(`Fetched orders for user ${userId}`);

    return res.status(200).json({ orders: user.orders });
  } catch (err) {
    console.error(
      `An error occured while trying to get orders!.\nError:\n${err}`,
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
  handleClearCart,
  handleGetCartItems,
  handleUpdateItemQuantity,
  handleUpdateUserPersonalInfo,
  handleAddAddress,
  handleGetAllAddress,
  handleEditAddress,
  handleDeleteAddress,
  handleOrder,
  handleGetOrders,
};

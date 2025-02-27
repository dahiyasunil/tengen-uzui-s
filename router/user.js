const express = require("express");
const {
  handleUserLogin,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleGetWishlistItems,
  handleAddProductToCart,
  handleRemoveProductFromCart,
  handleGetCartItems,
  handleUpdateItemQuantity,
  handleUpdateUserPersonalInfo,
  handleGetAllAddress,
  handleAddAddress,
  handleEditAddress,
  handleDeleteAddress,
} = require("../controllers/user");

const router = express.Router();

router.route("/login/:mobileNumber").get(handleUserLogin);
router.route("/wishlist/add").put(handleAddToWishlist);
router.route("/wishlist/remove").put(handleRemoveFromWishlist);
router.route("/wishlist/details/:userId").get(handleGetWishlistItems);
router.route("/cart/add").put(handleAddProductToCart);
router.route("/cart/remove").put(handleRemoveProductFromCart);
router.route("/cart/details/:userId").get(handleGetCartItems);
router.route("/cart/item/quantity").put(handleUpdateItemQuantity);
router.route("/update/details").put(handleUpdateUserPersonalInfo);
router.route("/addresses/:userId").get(handleGetAllAddress);
router
  .route("/address")
  .post(handleAddAddress)
  .put(handleEditAddress)
  .delete(handleDeleteAddress);

module.exports = router;

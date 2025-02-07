const express = require("express");
const {
  handleUserLogin,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleGetWishlistItems,
} = require("../controllers/user");

const router = express.Router();

router.route("/login/:mobileNumber").get(handleUserLogin);
router.route("/wishlist/add").put(handleAddToWishlist);
router.route("/wishlist/remove").put(handleRemoveFromWishlist);
router.route("/wishlist/details/:userId").get(handleGetWishlistItems);

module.exports = router;

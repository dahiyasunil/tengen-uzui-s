const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  emailId: {
    type: String,
  },
  addresses: { type: Array, default: [] },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  bag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;

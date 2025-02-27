const mongoose = require("mongoose");
const Address = require("./address.model");

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
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  bag: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;

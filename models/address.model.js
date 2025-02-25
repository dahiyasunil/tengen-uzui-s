const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  pincode: { type: Number, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  landmark: String,
  townCity: { type: String, required: true },
  state: { type: String, required: true },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;

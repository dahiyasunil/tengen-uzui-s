const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobileNumber: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    emailId: {
        type: String,
    },
    addresses: { type: Array, "default": [] },
    wishlist: [{ type: String }],
    bag: [{ type: String }],
    orders: [{ type: String }]
})

const User = mongoose.model("User", userSchema);
module.exports =User;
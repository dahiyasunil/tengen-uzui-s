const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    category: { type: String },
    subCategory: { type: String },
    images: [
      {
        url: { type: String },
        altText: { type: String },
        isPrimary: { type: Boolean },
      },
    ],
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    discount: {
      percentage: { type: Number },
      startDate: { type: Date },
      endDate: { type: Date },
    },
    sizes: [
      {
        size: { type: String },
        stock: { type: Number },
      },
    ],
    colors: [
      {
        name: { type: String },
        hexCode: { type: String },
        images: [
          {
            url: { type: String },
            altText: { type: String },
            isPrimary: { type: Boolean },
          },
        ],
        availableSizes: [{ type: String }],
      },
    ],
    material: { type: String },
    careInstructions: { type: String },
    style: { type: String },
    pattern: { type: String },
    fit: { type: String },
    targetAudience: [{ type: String }],
    ageGroup: { type: String },
    keywords: [{ type: String }],
    reviews: [
      {
        rating: { type: Number },
        text: { type: String },
        user: { type: String },
      },
    ],
    shippingInfo: {
      shippingMethods: [
        {
          name: { type: String },
          price: {
            amount: { type: Number },
            currency: { type: String },
          },
          estimatedDelivery: { type: String },
        },
      ],
      handlingTime: { type: String },
      freeDelivery: {
        isEligible: { type: Boolean },
        minimumOrderValue: { type: Number },
      },
      isPayOnDeliveryAvailable: { type: Boolean },
    },
    productDetails: {
      description: { type: String },
      keyFeatures: [{ type: String }],
      materialComposition: {
        percentage: { type: String },
        materials: [{ type: String }],
      },
      careInstructions: { type: String },
      fit: { type: String },
      usage: [{ type: String }],
    },
    promotions: [
      {
        type: { type: String },
        value: { type: Number },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

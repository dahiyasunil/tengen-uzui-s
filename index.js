const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect.js");
const Product = require("./model/product.model.js");

initializeDatabase();

const corsOption = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOption));

app.get("/products", async (req, res) => {
  try {
    const allProducts = await Product.find();
    return res.status(200).json(allProducts);
  } catch (err) {
    console.error(
      "An error occured while trying to fetch all products.\nError: \n" + err
    );
    return res.status(500).json({ err: "Please try again later!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running!"));

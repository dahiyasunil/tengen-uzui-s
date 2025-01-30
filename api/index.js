const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("../db/db.connect.js");
const productRouter = require("../router/products.js");
const userRouter = require("../router/user.js")
// const { logReq } = require("../middlewares/index.js");

initializeDatabase();

const corsOption = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOption));
// app.use(logReq("log.text"));
app.use("/api/products", productRouter);
app.use("/api/user", userRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running!"));

const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_DB_URL;

const initializeDatabase = async () => {
  await mongoose
    .connect(MONGO_URL)
    .then(() => console.log("Connected to database!"))
    .catch((err) => {
      console.error("Failed to connect to database. Error:\n", err);
    });
};

module.exports = { initializeDatabase };

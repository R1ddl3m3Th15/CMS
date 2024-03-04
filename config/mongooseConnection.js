require("dotenv").config();

const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI; // Update URI as needed

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;

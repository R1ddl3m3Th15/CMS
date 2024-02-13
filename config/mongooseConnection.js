const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/claimsManagementSystem"; // Update URI as needed

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(mongoURI, options)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;

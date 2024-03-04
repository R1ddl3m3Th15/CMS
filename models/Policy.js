const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  policyId: { type: String, required: true, unique: true }, // Changed to uuid
  provider: { type: String, required: true },
  category: { type: String, default: "Medical Insurance" },
  coverageAmt: { type: Number, required: true }, // Changed field name
  premium: { type: Number, required: true },
  tenure: { type: Number, default: 1 },
  userIds: [{ type: String, ref: "User" }],
});

module.exports = mongoose.model("Policy", policySchema);

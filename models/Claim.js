const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Changed to uuid
  policyId: { type: String, required: true }, // Changed to uuid
  claimId: { type: String, required: true },
  claimReason: { type: String, required: true },
  claimAmt: { type: Number, required: true }, // Changed field name
  coverageAmt: { type: Number, required: true }, // Changed field name
  remAmt: { type: Number, required: true }, // Changed field name
  billApp: { type: String, enum: ["Yes", "No"], required: true }, // Changed field name
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  reqDate: { type: Date, default: Date.now }, // Changed field name
  endDate: { type: Date }, // Added field
  rejReason: { type: String }, // Changed field name
});

module.exports = mongoose.model("Claim", claimSchema);

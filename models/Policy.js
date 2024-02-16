const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // Ensure mongoose-sequence is installed

const policySchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    match: [
      /^[A-Za-z\s]+$/,
      "Provider name should only contain English alphabets",
    ],
  },
  category: { type: String, default: "Medical Insurance" },
  coverageAmount: {
    type: Number,
    required: true,
    max: [10000000, "Coverage amount cannot exceed 1 crore"],
  },
  premium: {
    type: Number,
    required: true,
    // Validation for premium < coverageAmount is handled in pre-save hook
  },
  tenure: {
    type: Number,
    default: 1,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: () =>
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
});

policySchema.plugin(AutoIncrement, { inc_field: "serialNo" }); // Auto-increment serialNo

// Ensure premium is less than coverageAmount
policySchema.pre("validate", function (next) {
  if (this.premium >= this.coverageAmount) {
    next(new Error("Premium should be less than coverage amount"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Policy", policySchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Changed to uuid
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  aadharId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  selectedPolicies: [{ type: String, ref: "Policy" }],
  selectedClaims: [{ type: String, ref: "Claim" }],
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);

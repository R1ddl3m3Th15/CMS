const db = require("../data/db");
const { v4: uuidv4 } = require("uuid");

exports.createClaim = (req, res) => {
  const { insuranceId, claimReason, billsApproved, claimAmount } = req.body;

  // Validation checks
  if (!insuranceId) {
    return res.status(400).json({ message: "InsuranceId is required." });
  }
  if (!claimReason) {
    return res.status(400).json({ message: "Claim reason is required." });
  }
  if (billsApproved !== "Yes" && billsApproved !== "No") {
    return res
      .status(400)
      .json({ message: "Bills approved must be 'Yes' or 'No'." });
  }
  if (billsApproved === "No") {
    return res.status(400).json({
      message: "Cannot proceed with claim as bills are not approved.",
    });
  }
  if (!claimAmount || claimAmount <= 0) {
    return res.status(400).json({ message: "Invalid claim amount." });
  }

  // Find the policy by InsuranceId
  const user = db.users.find((user) =>
    user.policies.some((policy) => policy.insuranceId === insuranceId)
  );
  if (!user) {
    return res
      .status(404)
      .json({ message: "Policy not found with the provided InsuranceId." });
  }
  const policy = user.policies.find(
    (policy) => policy.insuranceId === insuranceId
  );

  // Check if claim amount exceeds coverage amount
  if (claimAmount > policy.coverageAmount) {
    return res
      .status(400)
      .json({ message: "Claim amount exceeds policy coverage amount." });
  }

  // Calculate remaining amount
  const remainingAmount = policy.coverageAmount - claimAmount;

  // Create the claim
  const newClaim = {
    claimId: uuidv4(),
    userId: user.id,
    insuranceId,
    claimReason,
    claimAmount,
    remainingAmount,
    billsApproved,
    status: "Pending",
    requestDate: new Date().toISOString(), // Current date in ISO format
  };

  // Add the claim to the database
  db.claims.push(newClaim);

  // Respond with the created claim details
  res.status(201).json({
    message: "Claim created successfully.",
    claimDetails: {
      ...newClaim,
      userName: user.fullName,
      policyDetails: policy,
    },
  });
};

// exports.getUserClaims = (req, res) => {};

// exports.getClaimById = (req, res) => {};

// exports.updateClaim = (req, res) => {};

// exports.deleteClaim = (req, res) => {};

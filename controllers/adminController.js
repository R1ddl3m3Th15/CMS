const db = require("../data/db");

exports.getPendingClaims = (req, res) => {
  // Filter out claims that have "Pending" status
  const pendingClaims = db.claims.filter((claim) => claim.status === "Pending");

  // For each pending claim, find the user and policy details
  const detailedPendingClaims = pendingClaims.map((claim) => {
    const user = db.users.find((user) => user.id === claim.userId);
    const policy = user
      ? user.policies.find((policy) => policy.insuranceId === claim.insuranceId)
      : null;

    return {
      claimId: claim.claimId,
      status: claim.status,
      requestDate: claim.requestDate,
      claimDetails: {
        claimReason: claim.claimReason,
        claimAmount: claim.claimAmount,
        billsApproved: claim.billsApproved,
      },
      user: user
        ? {
            userId: user.id,
            userName: user.fullName,
            userEmail: user.email,
            // Include other user details as needed
          }
        : "User not found",
      policy: policy
        ? {
            insuranceId: claim.insuranceId,
            provider: policy.provider,
            category: policy.category,
            coverageAmount: policy.coverageAmount,
            premium: policy.premium,
            tenure: policy.tenure,
          }
        : "Policy not found",
    };
  });

  // Check if there are no pending claims
  if (detailedPendingClaims.length === 0) {
    return res.status(404).json({ message: "No pending claims found." });
  }

  // Respond with the list of detailed pending claims
  res.status(200).json(detailedPendingClaims);
};

exports.getApprovedClaims = (req, res) => {};

// exports.getRejectedClaims = (req, res) => {};

exports.approveClaim = (req, res) => {
  const { claimId } = req.params; // Extract claimId from request parameters

  // Find the claim in the database
  const claimIndex = db.claims.findIndex((claim) => claim.claimId === claimId);

  // Verify the claim exists and is in "Pending" status
  if (claimIndex === -1) {
    return res.status(404).json({ message: "Claim not found." });
  }

  const claim = db.claims[claimIndex];
  if (claim.status !== "Pending") {
    return res
      .status(400)
      .json({ message: "Only pending claims can be approved." });
  }

  // Update the claim's status to "Approved"
  db.claims[claimIndex].status = "Approved";
  //  db.claims[claimIndex].approvedAt = new Date().toISOString();
  // db.claims[claimIndex].approvedBy = req.adminId; // adminId from somewhere

  res.status(200).json({
    message: "Claim approved successfully.",
    claim: db.claims[claimIndex],
  });
};

exports.rejectClaim = (req, res) => {
  const { claimId } = req.params; // Extract claimId from request parameters
  const { rejectionReason } = req.body; // Assume the rejection reason is sent in the request body

  // Ensure a rejection reason is provided
  if (!rejectionReason) {
    return res
      .status(400)
      .json({ message: "A reason for rejection is required." });
  }

  // Find the claim in the database
  const claimIndex = db.claims.findIndex((claim) => claim.claimId === claimId);

  // Verify the claim exists and is in "Pending" status
  if (claimIndex === -1) {
    return res.status(404).json({ message: "Claim not found." });
  }

  const claim = db.claims[claimIndex];
  if (claim.status !== "Pending") {
    return res
      .status(400)
      .json({ message: "Only pending claims can be rejected." });
  }

  // Update the claim's status to "Rejected" and store the rejection reason
  db.claims[claimIndex].status = "Rejected";
  db.claims[claimIndex].rejectionReason = rejectionReason;

  res.status(200).json({
    message: "Claim rejected successfully.",
    claim: {
      ...db.claims[claimIndex],
      rejectionReason: rejectionReason,
    },
  });
};

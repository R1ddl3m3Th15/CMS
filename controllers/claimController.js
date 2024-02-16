// const db = require("../data/db");
// const { v4: uuidv4 } = require("uuid");

// ************************** for user only ****************************

// exports.createClaim = (req, res) => {
//   const { insuranceId, claimReason, billsApproved, claimAmount } = req.body;

//   // Validation checks
//   if (!insuranceId) {
//     return res.status(400).json({ message: "InsuranceId is required." });
//   }
//   if (!claimReason) {
//     return res.status(400).json({ message: "Claim reason is required." });
//   }
//   if (billsApproved !== "Yes" && billsApproved !== "No") {
//     return res
//       .status(400)
//       .json({ message: "Bills approved must be 'Yes' or 'No'." });
//   }
//   if (billsApproved === "No") {
//     return res.status(400).json({
//       message: "Cannot proceed with claim as bills are not approved.",
//     });
//   }
//   if (!claimAmount || claimAmount <= 0) {
//     return res.status(400).json({ message: "Invalid claim amount." });
//   }

//   // Find the policy by InsuranceId
//   const user = db.users.find((user) =>
//     user.policies.some((policy) => policy.insuranceId === insuranceId)
//   );
//   if (!user) {
//     return res
//       .status(404)
//       .json({ message: "Policy not found with the provided InsuranceId." });
//   }
//   const policy = user.policies.find(
//     (policy) => policy.insuranceId === insuranceId
//   );

//   // Check if claim amount exceeds coverage amount
//   if (claimAmount > policy.coverageAmount) {
//     return res
//       .status(400)
//       .json({ message: "Claim amount exceeds policy coverage amount." });
//   }

//   // Calculate remaining amount
//   const remainingAmount = policy.coverageAmount - claimAmount;

//   // Create the claim
//   const newClaim = {
//     claimId: uuidv4(),
//     userId: user.id,
//     insuranceId,
//     claimReason,
//     claimAmount,
//     remainingAmount,
//     billsApproved,
//     status: "Pending",
//     requestDate: new Date().toISOString(), // Current date in ISO format
//   };

//   // Add the claim to the database
//   db.claims.push(newClaim);

//   // Respond with the created claim details
//   res.status(201).json({
//     message: "Claim created successfully.",
//     claimDetails: {
//       ...newClaim,
//       userName: user.fullName,
//       policyDetails: policy,
//     },
//   });
// };

// exports.getClaimHistory = (req, res) => {
//   const { userId } = req.params; // Extract userId from request parameters

//   // Verify the user exists
//   const user = db.users.find((user) => user.id === userId);
//   if (!user) {
//     return res.status(404).json({ message: "User not found." });
//   }

//   // Filter claims made by the user
//   const userClaims = db.claims.filter((claim) => claim.userId === userId);

//   // Aggregate claim details with policy details
//   const claimHistory = userClaims.map((claim) => {
//     const policy = user.policies.find(
//       (policy) => policy.insuranceId === claim.insuranceId
//     );
//     return {
//       policyDetails: policy
//         ? {
//             insuranceId: policy.insuranceId,
//             provider: policy.provider,
//             category: policy.category,
//             coverageAmount: policy.coverageAmount,
//             premium: policy.premium,
//             tenure: policy.tenure,
//           }
//         : null,
//       claimDetails: {
//         claimId: claim.claimId,
//         claimReason: claim.claimReason,
//         claimAmount: claim.claimAmount,
//         status: claim.status,
//         rejectionReason:
//           claim.status === "Rejected" ? claim.rejectionReason : undefined,
//         requestDate: claim.requestDate,
//       },
//     };
//   });

//   // Respond with the user's claim history
//   res.status(200).json(claimHistory);
// };

// ***************************** for admin only *********************************

// exports.getPendingClaims = (req, res) => {
//   // Filter out claims that have "Pending" status
//   const pendingClaims = db.claims.filter((claim) => claim.status === "Pending");

//   // For each pending claim, find the user and policy details
//   const detailedPendingClaims = pendingClaims.map((claim) => {
//     const user = db.users.find((user) => user.id === claim.userId);
//     const policy = user
//       ? user.policies.find((policy) => policy.insuranceId === claim.insuranceId)
//       : null;

//     return {
//       claimId: claim.claimId,
//       status: claim.status,
//       requestDate: claim.requestDate,
//       claimDetails: {
//         claimReason: claim.claimReason,
//         claimAmount: claim.claimAmount,
//         billsApproved: claim.billsApproved,
//       },
//       user: user
//         ? {
//             userId: user.id,
//             userName: user.fullName,
//             userEmail: user.email,
//             // Include other user details as needed
//           }
//         : "User not found",
//       policy: policy
//         ? {
//             insuranceId: claim.insuranceId,
//             provider: policy.provider,
//             category: policy.category,
//             coverageAmount: policy.coverageAmount,
//             premium: policy.premium,
//             tenure: policy.tenure,
//           }
//         : "Policy not found",
//     };
//   });

//   // Check if there are no pending claims
//   if (detailedPendingClaims.length === 0) {
//     return res.status(404).json({ message: "No pending claims found." });
//   }

//   // Respond with the list of detailed pending claims
//   res.status(200).json(detailedPendingClaims);
// };

// exports.getApprovedClaims = (req, res) => {};

// // exports.getRejectedClaims = (req, res) => {};

// exports.approveClaim = (req, res) => {
//   const { claimId } = req.params; // Extract claimId from request parameters

//   // Find the claim in the database
//   const claimIndex = db.claims.findIndex((claim) => claim.claimId === claimId);

//   // Verify the claim exists and is in "Pending" status
//   if (claimIndex === -1) {
//     return res.status(404).json({ message: "Claim not found." });
//   }

//   const claim = db.claims[claimIndex];
//   if (claim.status !== "Pending") {
//     return res
//       .status(400)
//       .json({ message: "Only pending claims can be approved." });
//   }

//   // Update the claim's status to "Approved"
//   db.claims[claimIndex].status = "Approved";
//   //  db.claims[claimIndex].approvedAt = new Date().toISOString();
//   // db.claims[claimIndex].approvedBy = req.adminId; // adminId from somewhere

//   res.status(200).json({
//     message: "Claim approved successfully.",
//     claim: db.claims[claimIndex],
//   });
// };

// exports.rejectClaim = (req, res) => {
//   const { claimId } = req.params; // Extract claimId from request parameters
//   const { rejectionReason } = req.body; // Assume the rejection reason is sent in the request body

//   // Ensure a rejection reason is provided
//   if (!rejectionReason) {
//     return res
//       .status(400)
//       .json({ message: "A reason for rejection is required." });
//   }

//   // Find the claim in the database
//   const claimIndex = db.claims.findIndex((claim) => claim.claimId === claimId);

//   // Verify the claim exists and is in "Pending" status
//   if (claimIndex === -1) {
//     return res.status(404).json({ message: "Claim not found." });
//   }

//   const claim = db.claims[claimIndex];
//   if (claim.status !== "Pending") {
//     return res
//       .status(400)
//       .json({ message: "Only pending claims can be rejected." });
//   }

//   // Update the claim's status to "Rejected" and store the rejection reason
//   db.claims[claimIndex].status = "Rejected";
//   db.claims[claimIndex].rejectionReason = rejectionReason;

//   res.status(200).json({
//     message: "Claim rejected successfully.",
//     claim: {
//       ...db.claims[claimIndex],
//       rejectionReason: rejectionReason,
//     },
//   });
// };

// // exports.getUserClaims = (req, res) => {};

// // exports.getClaimById = (req, res) => {};

// // exports.updateClaim = (req, res) => {};

// // exports.deleteClaim = (req, res) => {};

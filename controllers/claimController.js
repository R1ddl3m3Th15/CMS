const { v4: uuidv4 } = require("uuid");
const Claim = require("../models/Claim");
const User = require("../models/User");
const Policy = require("../models/Policy");

// ************************** for user only ****************************

exports.createClaim = async (req, res) => {
  try {
    const { userId, policyId, claimReason, billsApproved, claimAmount } =
      req.body;

    // Validation checks
    if (
      !userId ||
      !policyId ||
      !claimReason ||
      !billsApproved ||
      !claimAmount
    ) {
      return res.status(400).json({ message: "All fields are required." });
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

    if (claimAmount <= 0) {
      return res.status(400).json({ message: "Invalid claim amount." });
    }

    // Find the user and policy
    const user = await User.findOne({ userId });
    const policy = await Policy.findOne({ policyId });

    if (!user || !policy) {
      return res.status(404).json({ message: "User or Policy not found." });
    }

    // Check if claim amount exceeds coverage amount
    if (claimAmount > policy.coverageAmt) {
      return res
        .status(400)
        .json({ message: "Claim amount exceeds policy coverage amount." });
    }

    // Calculate remaining amount
    const remainingAmount = policy.coverageAmt - claimAmount;

    // Generate claimId using uuid
    const claimId = uuidv4();

    // Create the claim
    const newClaim = new Claim({
      userId,
      policyId,
      claimId,
      coverageAmt: policy.coverageAmt,
      claimReason,
      claimAmt: claimAmount,
      remAmt: remainingAmount,
      billApp: billsApproved,
      status: "Pending",
    });

    // Save the claim to the database
    await newClaim.save();

    // Update the selectedClaims array in the user schema
    user.selectedClaims.push(newClaim.claimId);
    await user.save();

    // Respond with the created claim details
    res.status(201).json({
      message: "Claim created successfully.",
      claimDetails: newClaim,
    });
  } catch (error) {
    console.error("Error creating claim:", error);
    res
      .status(500)
      .json({ message: "Failed to create claim.", error: error.message });
  }
};

exports.getClaimHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    // Verify the user exists}
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find all claims made by the user
    const userClaims = await Claim.findOne({ userId });

    // Aggregate claim details with policy details
    const claimHistory = userClaims.map((claim) => {
      return {
        policyDetails: {
          policyId: claim.policyId,
          // You can include other policy details here if needed
        },
        claimDetails: {
          claimId: claim.claimId,
          claimReason: claim.claimReason,
          claimAmount: claim.claimAmt,
          status: claim.status,
          rejectionReason:
            claim.status === "Rejected" ? claim.rejReason : undefined,
          requestDate: claim.reqDate,
        },
      };
    });

    // Respond with the user's claim history
    res.status(200).json(claimHistory);
  } catch (error) {
    console.error("Error getting claim history:", error);
    res
      .status(500)
      .json({ message: "Failed to get claim history.", error: error.message });
  }
};

// ***************************** for admin only *********************************

exports.getPendingClaims = async (req, res) => {
  try {
    // Find all pending claims from the database
    const pendingClaims = await Claim.find({ status: "Pending" });

    // Check if there are no pending claims
    if (pendingClaims.length === 0) {
      return res.status(404).json({ message: "No pending claims found." });
    }

    // Initialize an array to store detailed pending claims
    const detailedPendingClaims = [];

    // For each pending claim, find the user and policy details
    for (const claim of pendingClaims) {
      const user = await User.findOne({ userId: claim.userId });
      if (!user) {
        continue; // Skip this claim if user not found
      }

      // Fetch policy details directly using claim's policyId
      const policy = await Policy.findOne({ policyId: claim.policyId });
      if (!policy) {
        continue; // Skip this claim if policy not found
      }

      // Construct the detailed pending claim object
      const detailedClaim = {
        claimId: claim.claimId,
        status: claim.status,
        requestDate: claim.reqDate,
        claimDetails: {
          claimReason: claim.claimReason,
          claimAmount: claim.claimAmt,
          billsApproved: claim.billApp,
        },
        user: {
          userId: user.userId,
          userName: user.fullName,
          userEmail: user.email,
          // Include other user details as needed
        },
        policy: {
          policyId: policy.policyId,
          provider: policy.provider,
          category: policy.category,
          coverageAmount: policy.coverageAmt,
          premium: policy.premium,
          tenure: policy.tenure,
        },
      };

      detailedPendingClaims.push(detailedClaim);
    }

    // Respond with the list of detailed pending claims
    res.status(200).json(detailedPendingClaims);
  } catch (error) {
    console.error("Error getting pending claims:", error);
    res
      .status(500)
      .json({ message: "Failed to get pending claims.", error: error.message });
  }
};

// exports.getApprovedClaims = (req, res) => {};

// exports.getRejectedClaims = (req, res) => {};

exports.approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params; // Extract claimId from request parameters

    // Find the claim in the database
    const claim = await Claim.findOne({ claimId });

    // Verify the claim exists and is in "Pending" status
    if (!claim || claim.status !== "Pending") {
      return res
        .status(404)
        .json({ message: "Claim not found or not pending." });
    }

    // Update the claim's status to "Approved"
    claim.status = "Approved";
    await claim.save();

    res.status(200).json({
      message: "Claim approved successfully.",
      claim,
    });
  } catch (error) {
    console.error("Error approving claim:", error);
    res
      .status(500)
      .json({ message: "Failed to approve claim.", error: error.message });
  }
};

exports.rejectClaim = async (req, res) => {
  try {
    const { claimId } = req.params; // Extract claimId from request parameters
    const { rejectionReason } = req.body; // Extract rejection reason from request body

    // Ensure a rejection reason is provided
    if (!rejectionReason) {
      return res
        .status(400)
        .json({ message: "A reason for rejection is required." });
    }

    // Find the claim in the database
    const claim = await Claim.findOne({ claimId });

    // Verify the claim exists and is in "Pending" status
    if (!claim || claim.status !== "Pending") {
      return res
        .status(404)
        .json({ message: "Claim not found or not pending." });
    }

    // Update the claim's status to "Rejected" and store the rejection reason
    claim.status = "Rejected";
    claim.rejReason = rejectionReason;
    await claim.save();

    res.status(200).json({
      message: "Claim rejected successfully.",
      claim,
    });
  } catch (error) {
    console.error("Error rejecting claim:", error);
    res
      .status(500)
      .json({ message: "Failed to reject claim.", error: error.message });
  }
};

// exports.getUserClaims = (req, res) => {};

// exports.getClaimById = (req, res) => {};

// exports.updateClaim = (req, res) => {};

// exports.deleteClaim = (req, res) => {};

const Policy = require("../models/Policy");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// *********************** for user/admin accesss ************************

exports.getAvailablePolicies = async (req, res) => {
  try {
    // Fetch all policies from the database
    const policies = await Policy.find({});

    // Map the policies to include only necessary fields
    const formattedPolicies = policies.map((policy) => {
      return {
        policyId: policy.policyId,
        provider: policy.provider,
        category: policy.category,
        coverageAmt: policy.coverageAmt,
        premium: policy.premium,
        tenure: policy.tenure,
      };
    });

    res.status(200).json(formattedPolicies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ message: "Failed to fetch policies" });
  }
};

// **************** for admin access only *************************

exports.addPolicies = async (req, res) => {
  try {
    // Destructuring assignment to unpack properties from req.body
    const { provider, coverageAmt, premium } = req.body;

    // Generate a UUID for the new policy
    const policyId = uuidv4();

    // Create a new policy object
    const policy = new Policy({
      policyId,
      provider,
      coverageAmt,
      premium,
    });

    // Save the new policy to the database
    await policy.save();

    res.status(201).json({
      message: "Policy added successfully",
      data: policy,
    });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({
      message: "Failed to add policy",
      error: error.message,
    });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // Find policy by policyId instead of _id
    const policy = await Policy.findOneAndUpdate({ policyId: id }, update, {
      new: true,
    });

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res
      .status(200)
      .json({ message: "Policy updated successfully", data: policy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete policy based on policyId instead of _id
    const policy = await Policy.findOneAndDelete({ policyId: id });

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllPolicies = async (req, res) => {
  try {
    // Delete all policies from the database
    await Policy.deleteMany({});

    // Respond with success message
    res.status(200).json({ message: "All policies deleted successfully." });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error deleting policies:", error);
    res
      .status(500)
      .json({ message: "Failed to delete policies.", error: error.message });
  }
};

// ********************* for user access only *****************************

exports.selectPolicy = async (req, res) => {
  const { policyId, userId } = req.body;

  try {
    // Check for required fields
    if (!policyId || !userId) {
      return res
        .status(400)
        .json({ message: "Both Policy ID and User ID are required." });
    }

    // Verify if the user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the policy using the provided Policy ID
    const policy = await Policy.findOne({ policyId });
    if (!policy) {
      return res
        .status(404)
        .json({ message: "Policy not found with the provided Policy ID." });
    }

    // Associate the policy with the user by adding its ID to selectedPolicies array
    user.selectedPolicies.push(policyId);
    await user.save();

    // Update the policy's userIds array
    if (!policy.userIds.includes(userId)) {
      policy.userIds.push(userId);
    }

    await policy.save();

    // Respond with success message
    res.status(200).json({
      message: "Policy selected successfully.",
      selectedPolicy: {
        policyId: policy.policyId,
        provider: policy.provider,
        category: policy.category,
        coverageAmt: policy.coverageAmt,
        premium: policy.premium,
        tenure: policy.tenure,
      },
    });
  } catch (error) {
    console.error("Error selecting policy:", error);
    res
      .status(500)
      .json({ message: "Failed to select policy", error: error.message });
  }
};

//exports.getPolicyById = (req, res) => {};

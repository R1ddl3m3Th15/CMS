const Policy = require("../models/Policy");

// *********************** for user/admin accesss ************************

exports.getAvailablePolicies = async (req, res) => {
  try {
    // Fetch all policies from the database
    const policies = await Policy.find({});
    res.status(200).json(policies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ message: "Failed to fetch policies" });
  }
};

// **************** for admin access only *************************
exports.addPolicies = async (req, res) => {
  try {
    // Destructuring assignment to unpack properties from req.body
    const { provider, coverageAmount, premium } = req.body;

    // Create a new policy object
    const policy = new Policy({
      provider,
      coverageAmount,
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
    const policy = await Policy.findByIdAndUpdate(id, update, { new: true });
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
    const policy = await Policy.findByIdAndDelete(id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ********************* for user access only *****************************

exports.selectPolicy = (req, res) => {
  const { serialNo, userId } = req.body;

  // Check for required fields
  if (!serialNo || !userId) {
    return res
      .status(400)
      .json({ message: "Both Serial No. and User Id are required." });
  }

  // Verify the user exists
  const user = db.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Find the policy using the provided Serial No.
  const policy = db.policies.find((p) => p.serialNo === serialNo);
  if (!policy) {
    return res
      .status(404)
      .json({ message: "Policy not found with the provided Serial No." });
  }

  // Generate a unique Insurance ID
  const insuranceId = uuidv4();

  // Associate the policy and Insurance ID with the user
  const userPolicy = {
    ...policy,
    insuranceId: insuranceId,
  };
  if (!user.policies) {
    user.policies = [userPolicy];
  } else {
    user.policies.push(userPolicy);
  }

  // Respond with success message and the generated Insurance ID
  res.status(200).json({
    message: "Policy selected successfully.",
    insuranceId: insuranceId,
    selectedPolicy: {
      serialNo: policy.serialNo,
      provider: policy.provider,
      category: policy.category,
      coverageAmount: policy.coverageAmount,
      premium: policy.premium,
      tenure: policy.tenure,
    },
  });
};

exports.getPolicyById = (req, res) => {};

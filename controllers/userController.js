const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    // Destructure the necessary attributes from the request body
    const { username, password, fullName, dob, address, email } = req.body;

    // Validate the input data (you can add more complex validations as needed)
    if (!username || !password || !fullName || !dob || !address || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing user with the same username
    const existingUser = db.users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record
    const newUser = {
      id: uuidv4(), // Generate a unique ID for the user
      username,
      password: hashedPassword, // Store the hashed password
      fullName,
      dob,
      address,
      email,
      role: "user", // Default role is 'user'
    };

    // Add the new user to the in-memory database
    db.users.push(newUser);

    // Respond with success message
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for missing username or password
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Find the user by username
    const user = db.users.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Assuming login is successful, direct user to the Home Page
    // In a real-world scenario, you'd issue a token using JWT or a session here
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        dob: user.dob,
        address: user.address,
        email: user.email,
        // Provide the options that the user has on the home page
        options: ["Select Policy", "Make a Claim", "View Claim History"],
      },
    });
  } catch (error) {
    // Handle any server error
    res.status(500).json({ message: "An error occurred during login." });
  }
};

exports.getAvailablePolicies = (req, res) => {
  // Directly reference the policies array from the in-memory database
  res.status(200).json(db.policies);
};

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

exports.getClaimHistory = (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  // Verify the user exists
  const user = db.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Filter claims made by the user
  const userClaims = db.claims.filter((claim) => claim.userId === userId);

  // Aggregate claim details with policy details
  const claimHistory = userClaims.map((claim) => {
    const policy = user.policies.find(
      (policy) => policy.insuranceId === claim.insuranceId
    );
    return {
      policyDetails: policy
        ? {
            insuranceId: policy.insuranceId,
            provider: policy.provider,
            category: policy.category,
            coverageAmount: policy.coverageAmount,
            premium: policy.premium,
            tenure: policy.tenure,
          }
        : null,
      claimDetails: {
        claimId: claim.claimId,
        claimReason: claim.claimReason,
        claimAmount: claim.claimAmount,
        status: claim.status,
        rejectionReason:
          claim.status === "Rejected" ? claim.rejectionReason : undefined,
        requestDate: claim.requestDate,
      },
    };
  });

  // Respond with the user's claim history
  res.status(200).json(claimHistory);
};

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, fullName, aadharId, email } = req.body;

    if (!username || !password || !fullName || !aadharId || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{5,29}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
    const aadharRegex = /^\d{12}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Invalid username format. Start with a letter, and can include numbers and underscores",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password does not meet criteria. Must have at least one lowercase and one uppercase letter, one special character, one number.",
      });
    }
    if (!nameRegex.test(fullName)) {
      return res
        .status(400)
        .json({ message: "Full name must only contain English alphabets." });
    }
    if (!aadharRegex.test(aadharId)) {
      return res.status(400).json({ message: "Aadhar ID must be 12 digits" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const adminId = uuidv4();

    const newAdmin = new Admin({
      adminId,
      username,
      password,
      fullName,
      aadharId,
      email,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred during registration.",
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      message: "Login successful.",
      admin: {
        adminId: admin.adminId,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        options: ["View Users", "Manage Policies", "Process Claims"],
      },
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during login." });
  }
};

// Function to get all registered users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, { password: 0 }); // Exclude password field from the response

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    // Fetch all users from the database
    const admins = await Admin.find({}, { password: 0 }); // Exclude password field from the response

    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found." });
    }

    // Respond with the list of users
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// to delete a user from record
exports.deleteUser = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    // Delete user based on userId instead of MongoDB's _id
    const user = await User.findOneAndDelete({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Failed to delete user.", error: error.message });
  }
};

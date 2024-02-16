const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    // Destructure the necessary attributes from the request body
    const { username, password, fullName, aadharId, email } = req.body;

    // Validate the input data (you can add more complex validations as needed)
    if (!username || !password || !fullName || !aadharId || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Regular expressions for validation
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{5,29}$/; // Start with a letter, and can include numbers and underscores
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Strong password criteria
    const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/; // First name or first name and surname with English alphabets
    const aadharRegex = /^\d{12}$/; // Aadhar ID must be 12 digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format

    // Validate the input data using regex
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Invalid username format. Start with a letter, and can include numbers and underscores",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password does not meet criteria. Must have atleast one lower and one upper case letter, one special character, one number.",
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

    // Check for existing user with the same username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // Create a new user record
    const newUser = new User({
      username,
      password,
      fullName,
      aadharId,
      email,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." }); // Respond with success message
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred during registration.",
    }); // Handle any other errors
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
    const user = await User.findOne({ username });
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
        id: user._id,
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

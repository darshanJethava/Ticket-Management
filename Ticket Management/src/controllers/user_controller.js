const bcrypt = require("bcryptjs");
const User = require("../models/user_t");
const Role = require("../models/roles_t");

// Create a new user (Manager only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id
    });

    await newUser.save();

    const createdUser = await User.findById(newUser._id)
      .populate("role", "name")
      .select("-password");

    res.status(201).json({
      message: "User created successfully",
      user: createdUser
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
};

// Get all users (Manager only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "name")
      .select("-password");

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      error: error.message
    });
  }
};

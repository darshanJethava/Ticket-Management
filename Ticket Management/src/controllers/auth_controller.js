const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user_t");

exports.loginUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const foundUser = await user.findOne({ email }).populate("role");

  if (!foundUser) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }
  const token = jwt.sign(
    {
      id: foundUser._id,
      role: foundUser.role.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message: "Login successful",
    token
  });
};
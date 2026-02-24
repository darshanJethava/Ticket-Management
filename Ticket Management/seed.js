require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Role = require("./src/models/roles_t");
const User = require("./src/models/user_t");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Role.deleteMany({});
    await User.deleteMany({});

    console.log("Cleared existing data");

    // Create roles
    const roles = await Role.insertMany([
      { name: "manager" },
      { name: "support" },
      { name: "user" }
    ]);

    console.log("Roles created:", roles.map(r => r.name));

    // Create default users
    const managerRole = roles.find(r => r.name === "manager");
    const supportRole = roles.find(r => r.name === "support");
    const userRole = roles.find(r => r.name === "user");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "Manager User",
        email: "manager@example.com",
        password: hashedPassword,
        role: managerRole._id
      },
      {
        name: "Support Agent",
        email: "support@example.com",
        password: hashedPassword,
        role: supportRole._id
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: hashedPassword,
        role: userRole._id
      }
    ]);

    console.log("Users created:");
    console.log("- manager@example.com (password: password123)");
    console.log("- support@example.com (password: password123)");
    console.log("- user@example.com (password: password123)");

    console.log("\nDatabase seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

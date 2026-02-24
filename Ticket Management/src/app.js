const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Support Ticket Management API is running" });
});

// Routes
app.use("/auth", require("./routes/auth_route"));
app.use("/users", require("./routes/user_route"));
app.use("/tickets", require("./routes/ticket_route"));
app.use("/tickets", require("./routes/comment_route"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
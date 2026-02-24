const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const rbacMiddleware = require("../middleware/rbacmiddleware");
const {
  createUser,
  getAllUsers
} = require("../controllers/user_controller");

router.post("/", authMiddleware, rbacMiddleware(["manager"]), createUser);
router.get("/", authMiddleware, rbacMiddleware(["manager"]), getAllUsers);

module.exports = router;

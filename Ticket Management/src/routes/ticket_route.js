const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const rbacMiddleware = require("../middleware/rbacmiddleware");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  updateTicketStatus,
  deleteTicket
} = require("../controllers/ticket_controller");

router.post("/", authMiddleware, rbacMiddleware(["user", "manager"]), createTicket);
router.get("/", authMiddleware, getAllTickets);
router.get("/:id", authMiddleware, getTicketById);
router.put("/:id", authMiddleware, updateTicket);
router.patch("/:id/assign", authMiddleware, rbacMiddleware(["manager", "support"]), assignTicket);
router.patch("/:id/status", authMiddleware, rbacMiddleware(["manager", "support"]), updateTicketStatus);
router.delete("/:id", authMiddleware, rbacMiddleware(["manager"]), deleteTicket);

module.exports = router;
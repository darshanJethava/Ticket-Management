const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const {
  addComment,
  getTicketComments,
  updateComment,
  deleteComment
} = require("../controllers/comment_controller");

router.post("/:id/comments", authMiddleware, addComment);
router.get("/:id/comments", authMiddleware, getTicketComments);
router.put("/comments/:commentId", authMiddleware, updateComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;

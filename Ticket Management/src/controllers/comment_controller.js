const Comment = require("../models/comment_t");
const Ticket = require("../models/tickets_t");

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const ticketDoc = await Ticket.findById(id);

    if (!ticketDoc) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "user") {
      if (ticketDoc.created_by.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access forbidden" });
      }
    }

    if (req.user.role === "support") {
      if (ticketDoc.assigned_to && ticketDoc.assigned_to.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access forbidden" });
      }
    }

    const newComment = new Comment({
      ticket: id,
      user: req.user.id,
      content: content.trim()
    });

    await newComment.save();

    const comment = await Comment.findById(newComment._id)
      .populate('user', 'name email');

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding comment",
      error: error.message
    });
  }
};

// Get all comments for a ticket
exports.getTicketComments = async (req, res) => {
  try {
    const { id } = req.params;

    const ticketDoc = await Ticket.findById(id);

    if (!ticketDoc) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "user") {
      if (ticketDoc.created_by.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access forbidden" });
      }
    }

    if (req.user.role === "support") {
      if (ticketDoc.assigned_to && ticketDoc.assigned_to.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access forbidden" });
      }
    }

    const comments = await Comment.find({ ticket: id })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Comments retrieved successfully",
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
      error: error.message
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(commentId)
      .populate('user', 'name email');

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating comment",
      error: error.message
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({ message: "Access forbidden" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message
    });
  }
};

const Ticket = require("../models/tickets_t");
const StatusLog = require("../models/status_t");
const User = require("../models/user_t");

exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (title.length < 5) {
      return res.status(400).json({ message: "Title must be at least 5 characters" });
    }

    if (description.length < 10) {
      return res.status(400).json({ message: "Description must be at least 10 characters" });
    }

    const newTicket = new Ticket({
      title,
      description,
      priority: priority || 'MEDIUM',
      created_by: req.user.id,
      status: 'OPEN'
    });

    await newTicket.save();

    const ticket = await Ticket.findById(newTicket._id)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email');

    res.status(201).json({
      message: "Ticket created successfully",
      ticket
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating ticket",
      error: error.message
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'user') {
      filter.created_by = req.user.id;
    }
    if (req.user.role === 'support') {
      filter.$or = [
        { assigned_to: req.user.id },
        { assigned_to: null }
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tickets retrieved successfully",
      count: tickets.length,
      tickets
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tickets",
      error: error.message
    });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticketDoc = await Ticket.findById(id)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email');

    if (!ticketDoc) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "user") {
      if (ticketDoc.created_by._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access forbidden" });
      }
    }

    if (req.user.role === "support") {
      if (ticketDoc.assigned_to && ticketDoc.assigned_to._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access forbidden" });
      }
    }

    res.status(200).json({
      message: "Ticket retrieved successfully",
      ticket: ticketDoc
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching ticket",
      error: error.message
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === 'user' && ticket.created_by.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    if (title) {
      if (title.length < 5) {
        return res.status(400).json({ message: "Title must be at least 5 characters" });
      }
      ticket.title = title;
    }

    if (description) {
      if (description.length < 10) {
        return res.status(400).json({ message: "Description must be at least 10 characters" });
      }
      ticket.description = description;
    }

    if (priority) {
      if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
        return res.status(400).json({ message: "Invalid priority value" });
      }
      ticket.priority = priority;
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email');

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating ticket",
      error: error.message
    });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo is required" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const assignee = await User.findById(assignedTo).populate('role');

    if (!assignee) {
      return res.status(404).json({ message: "User not found" });
    }

    if (assignee.role.name === 'user') {
      return res.status(400).json({ message: "Cannot assign ticket to USER role" });
    }

    ticket.assigned_to = assignedTo;
    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email');

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticket: updatedTicket
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning ticket",
      error: error.message
    });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const current = ticket.status;
    const allowed = {
      OPEN: ['IN_PROGRESS', 'CLOSED'],
      IN_PROGRESS: ['RESOLVED', 'OPEN'],
      RESOLVED: ['CLOSED', 'IN_PROGRESS'],
      CLOSED: []
    };

    if (!allowed[current].includes(status)) {
      return res.status(400).json({ message: `Cannot change status from ${current} to ${status}` });
    }

    ticket.status = status;
    await ticket.save();

    await StatusLog.create({
      ticket: ticket._id,
      oldStatus: current,
      newStatus: status,
      changedBy: req.user.id
    });

    const updatedTicket = await Ticket.findById(id)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email');

    res.status(200).json({ ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket status", error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Error deleting ticket",
      error: error.message
    });
  }
};
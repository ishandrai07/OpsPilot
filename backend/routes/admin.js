const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/requests – Get all requests (admin only)
router.get('/requests', protect, adminOnly, async (req, res) => {
  try {
    const { status, department, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter['aiAnalysis.department'] = department;

    const requests = await Request.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Request.countDocuments(filter);

    res.json({ requests, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/stats – Platform-wide stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [total, resolved, escalated, pending, highPriority, users] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: 'resolved' }),
      Request.countDocuments({ status: 'escalated' }),
      Request.countDocuments({ status: { $in: ['pending', 'processing'] } }),
      Request.countDocuments({ 'aiAnalysis.priority': { $in: ['High', 'Critical'] } }),
      User.countDocuments({ role: 'employee' }),
    ]);

    res.json({ total, resolved, escalated, pending, highPriority, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/requests/:id/status – Update request status
router.patch('/requests/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'resolved', 'escalated'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

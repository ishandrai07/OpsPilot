const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');
const { analyzeRequest } = require('../services/aiService');

// POST /api/requests – Create and analyze a new request
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create request with pending status
    const request = await Request.create({
      userId: req.user._id,
      title,
      description,
      status: 'processing',
    });

    // Run AI analysis
    const aiAnalysis = await analyzeRequest(title, description);

    // Update with AI results
    request.aiAnalysis = aiAnalysis;
    request.status = aiAnalysis.decision === 'Auto Resolve' ? 'resolved' : 'escalated';
    await request.save();

    res.status(201).json(request);
  } catch (error) {
    console.error('Request creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/requests – Get all requests for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/requests/stats – Get dashboard stats for current user
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, resolved, escalated, highPriority] = await Promise.all([
      Request.countDocuments({ userId }),
      Request.countDocuments({ userId, status: 'resolved' }),
      Request.countDocuments({ userId, status: 'escalated' }),
      Request.countDocuments({ userId, 'aiAnalysis.priority': { $in: ['High', 'Critical'] } }),
    ]);

    res.json({ total, resolved, escalated, highPriority });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/requests/:id – Get a single request by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Allow access to own requests or admins
    if (request.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

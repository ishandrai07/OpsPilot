const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  department: { type: String, default: '' },
  category: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  summary: { type: String, default: '' },
  relevantPolicy: { type: String, default: '' },
  recommendedAction: { type: String, default: '' },
  aiResponse: { type: String, default: '' },
  decision: { type: String, enum: ['Auto Resolve', 'Human Review'], default: 'Human Review' },
  decisionReason: { type: String, default: '' },
}, { _id: false });

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved', 'escalated'],
    default: 'pending',
  },
  aiAnalysis: {
    type: aiAnalysisSchema,
    default: () => ({}),
  },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

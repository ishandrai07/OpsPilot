const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: ['HR', 'IT', 'Finance', 'General'],
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rules: [{ type: String }],
  autoApproveLimit: {
    type: Number,
    default: null, // null means no monetary limit
  },
  keywords: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);

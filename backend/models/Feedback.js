const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null if submitted anonymously
  },
  rawText: { 
    type: String, 
    required: true 
  },
  sentiment: { 
    type: String, 
    enum: ['Positive', 'Neutral', 'Negative'], 
    required: true 
  },
  keyItems: [{ type: String }],
  requiresAction: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
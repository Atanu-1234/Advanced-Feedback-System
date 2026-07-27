const express = require('express');
const { GoogleGenAI, Type } = require('@google/genai');
const jwt = require('jsonwebtoken');
const Feedback = require('../models/Feedback');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

async function analyzeReview(reviewText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set');
    return { sentiment: 'Neutral', keyItems: ['General'], requiresAction: false };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a restaurant review analyzer. Analyze the following customer review and respond ONLY with a valid JSON object with exactly these fields:
- sentiment: one of "Positive", "Neutral", or "Negative"
- keyItems: array of strings (food items, service aspects, or topics mentioned)
- requiresAction: boolean (true if the review contains a serious complaint, request for refund, or urgent issue)

Review: "${reviewText}"

Respond with JSON only, no explanation.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment:      { type: Type.STRING,  enum: ['Positive', 'Neutral', 'Negative'] },
            keyItems:       { type: Type.ARRAY, items: { type: Type.STRING } },
            requiresAction: { type: Type.BOOLEAN }
          },
          required: ['sentiment', 'keyItems', 'requiresAction']
        }
      }
    });

    const result = JSON.parse(response.text);
    console.log('✅ Gemini analysis:', result);
    return result;
  } catch (error) {
    console.error('❌ Gemini analysis failed:', error.message);
    return { sentiment: 'Neutral', keyItems: ['Review'], requiresAction: false };
  }
}

// 1. PUBLIC / USER SUBMIT FEEDBACK
router.post('/', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ message: 'Review text cannot be empty' });
    }

    // Optional user attachment if auth token header present
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(
          authHeader.split(' ')[1],
          process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production'
        );
        // Admins cannot submit feedback
        if (decoded.role === 'admin') {
          return res.status(403).json({ message: 'Admins cannot submit feedback' });
        }
        userId = decoded.id;
      } catch (e) {
        // Continue anonymously if token invalid/expired
      }
    }

    const analysis = await analyzeReview(rawText);

    const feedback = new Feedback({
      user: userId,
      rawText,
      sentiment: analysis.sentiment,
      keyItems: analysis.keyItems,
      requiresAction: analysis.requiresAction
    });

    await feedback.save();

    // Broadcast to Admin socket subscribers
    const io = req.app.get('io');
    if (io) io.emit('new_feedback', feedback);

    return res.status(201).json(feedback);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. USER ONLY: GET /api/feedback/my-feedback — returns feedback submitted by the logged-in user
router.get('/my-feedback', verifyToken, async (req, res) => {
  try {
    const userFeedbacks = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(userFeedbacks);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving user feedback history' });
  }
});

module.exports = router;
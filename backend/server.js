const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const Feedback = require('./models/Feedback');
const User = require('./models/User');
const { verifyAdmin } = require('./middleware/verifyToken');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

app.use('/api', authRoutes);
app.use('/api/feedback', feedbackRoutes);

// GET /api/insights — required by spec (admin protected)
app.get('/api/insights', verifyAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'username').sort({ createdAt: -1 });
    return res.json(feedbacks);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving insights' });
  }
});

io.on('connection', (socket) => {
  console.log(`⚡ Admin client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔥 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_db';

async function seedAdmin() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const exists = await User.findOne({ username: adminUsername });
    if (!exists) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({ username: adminUsername, password: hashed, role: 'admin' });
      console.log(`✅ Admin user seeded: ${adminUsername}`);
    }
  } catch (err) {
    console.error('❌ Admin seeding error:', err);
  }
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedAdmin();
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Database connection error:', err));
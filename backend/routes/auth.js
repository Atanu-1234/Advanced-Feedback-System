const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 1. POST /api/register — creates regular user accounts only (admin is seeded via env)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'user' // Registration always creates regular users; admin is seeded via env
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
      { expiresIn: '2h' }
    );

    return res.status(201).json({ 
      message: 'Registration successful', 
      access_token: token,
      role: newUser.role,
      username: newUser.username
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
      { expiresIn: '2h' }
    );

    return res.json({ 
      access_token: token, 
      role: user.role,
      username: user.username
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
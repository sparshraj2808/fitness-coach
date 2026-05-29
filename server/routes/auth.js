import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnection from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, goal, experience, weight, height } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const users = dbConnection.getCollection('users');
    
    // Check if user exists
    const userExists = await users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await users.create({
      username,
      email,
      password: hashedPassword,
      goal: goal || 'fitness',
      experience: experience || 'beginner',
      weight: Number(weight) || 70,
      height: Number(height) || 175,
      streak: 1, // Start with a 1-day streak!
      lastActive: new Date().toISOString().split('T')[0],
      achievements: ['welcome_badge']
    });

    // Sign JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'fitcoach_ai_jwt_secret_key_2026_neon',
      { expiresIn: '30d' }
    );

    // Exclude password from output
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const users = dbConnection.getCollection('users');
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check and update fitness streak
    let currentStreak = user.streak || 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (user.lastActive === yesterday) {
      currentStreak += 1;
    } else if (user.lastActive !== today) {
      currentStreak = 1; // Reset streak if missed a day
    }

    // Update streak and last active date
    await users.updateOne({ _id: user._id }, { 
      $set: { 
        streak: currentStreak,
        lastActive: today
      } 
    });

    user.streak = currentStreak;
    user.lastActive = today;

    // Award streak badges if milestone hit
    const updatedAchievements = [...(user.achievements || [])];
    if (currentStreak >= 3 && !updatedAchievements.includes('streak_3')) {
      updatedAchievements.push('streak_3');
    }
    if (currentStreak >= 7 && !updatedAchievements.includes('streak_7')) {
      updatedAchievements.push('streak_7');
    }
    if (updatedAchievements.length !== (user.achievements || []).length) {
      await users.updateOne({ _id: user._id }, { $set: { achievements: updatedAchievements } });
      user.achievements = updatedAchievements;
    }

    // Sign Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fitcoach_ai_jwt_secret_key_2026_neon',
      { expiresIn: '30d' }
    );

    // Exclude password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const users = dbConnection.getCollection('users');
    const user = await users.findOne({ _id: req.user.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { goal, experience, weight, height } = req.body;
    const users = dbConnection.getCollection('users');

    const updateFields = {};
    if (goal) updateFields.goal = goal;
    if (experience) updateFields.experience = experience;
    if (weight) updateFields.weight = Number(weight);
    if (height) updateFields.height = Number(height);

    await users.updateOne({ _id: req.user.userId }, { $set: updateFields });
    
    const updatedUser = await users.findOne({ _id: req.user.userId });
    const { password, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

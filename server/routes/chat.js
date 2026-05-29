import express from 'express';
import dbConnection from '../config/db.js';
import authMiddleware from '../middleware/auth.js';
import { generateCoachResponse } from '../services/aiService.js';

const router = express.Router();

// Get conversation history for active user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const chats = dbConnection.getCollection('chats');
    const history = await chats.find({ userId: req.user.userId });
    
    // Sort chronologically (assuming auto ID sequential generation or parsing sorting)
    const sortedHistory = history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    res.json(sortedHistory.slice(-50)); // Limit to last 50 exchanges
  } catch (err) {
    console.error('Fetch chat history error:', err);
    res.status(500).json({ error: 'Failed to retrieve chat logs' });
  }
});

// Post a message and get coach response
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: 'Message content cannot be blank' });
    }

    const chats = dbConnection.getCollection('chats');
    const users = dbConnection.getCollection('users');

    // Fetch user details to inject personalization
    const user = await users.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Save user's message
    const userMsg = await chats.create({
      userId: req.user.userId,
      sender: 'user',
      message: message.trim()
    });

    // Fetch previous chats for context
    const rawHistory = await chats.find({ userId: req.user.userId });
    const sortedHistory = rawHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(-10);

    // Generate AI response
    const coachText = await generateCoachResponse(message.trim(), sortedHistory, user);

    // Save coach's response
    const coachMsg = await chats.create({
      userId: req.user.userId,
      sender: 'coach',
      message: coachText
    });

    res.status(201).json({
      userMessage: userMsg,
      coachMessage: coachMsg
    });
  } catch (err) {
    console.error('Chat message processing error:', err);
    res.status(500).json({ error: 'Failed to process AI response' });
  }
});

// Clear conversation log
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    const chats = dbConnection.getCollection('chats');
    const result = await chats.deleteMany({ userId: req.user.userId });
    res.json({ message: 'Conversation history wiped clean', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

export default router;

import express from 'express';
import dbConnection from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Static workout plans repository for client display
const WORKOUT_TEMPLATES = [
  {
    id: "home_body_blast",
    name: "⚡ Full Body Home Ignite",
    type: "home",
    difficulty: "beginner",
    duration: 20,
    caloriesBurned: 180,
    description: "An intense bodyweight circuit designed to shock the metabolism and build foundational strength.",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "15 reps", rest: "30s" },
      { name: "Incline/Standard Push-Ups", sets: 3, reps: "12 reps", rest: "45s" },
      { name: "Alternating Reverse Lunges", sets: 3, reps: "10 per leg", rest: "30s" },
      { name: "Prone Cobra (Lower Back)", sets: 2, reps: "15 reps", rest: "30s" },
      { name: "Plank Hold", sets: 3, reps: "40 seconds", rest: "45s" }
    ]
  },
  {
    id: "gym_upper_pump",
    name: "💪 Upper Body Hypertrophy",
    type: "gym",
    difficulty: "intermediate",
    duration: 45,
    caloriesBurned: 350,
    description: "A classic hypertrophy protocol targeting chest, back, shoulders, and arms inside the gym.",
    exercises: [
      { name: "Flat Dumbbell Bench Press", sets: 4, reps: "8-10 reps", rest: "90s" },
      { name: "Neutral Grip Cable Row", sets: 3, reps: "10-12 reps", rest: "75s" },
      { name: "Seated Overhead Dumbbell Press", sets: 3, reps: "10 reps", rest: "75s" },
      { name: "Lat Pulldowns", sets: 3, reps: "12 reps", rest: "60s" },
      { name: "Incline Dumbbell Bicep Curls", sets: 2, reps: "12 reps", rest: "60s" },
      { name: "Rope Overhead Tricep Extension", sets: 2, reps: "12 reps", rest: "60s" }
    ]
  },
  {
    id: "home_core_shred",
    name: "🔥 Neon Abdominal Shredder",
    type: "home",
    difficulty: "intermediate",
    duration: 15,
    caloriesBurned: 120,
    description: "A fast-paced core routine to build abdominal endurance and improve core stability.",
    exercises: [
      { name: "Bicycle Crunches", sets: 3, reps: "20 reps", rest: "30s" },
      { name: "Russian Twists (weighted or bodyweight)", sets: 3, reps: "30 taps", rest: "30s" },
      { name: "Mountain Climbers", sets: 3, reps: "45 seconds", rest: "30s" },
      { name: "Hollow Body Hold", sets: 2, reps: "30 seconds", rest: "45s" }
    ]
  },
  {
    id: "gym_leg_day",
    name: "🏋️‍♂️ Iron Quad & Hamstring Mastery",
    type: "gym",
    difficulty: "advanced",
    duration: 50,
    caloriesBurned: 450,
    description: "A high-intensity, heavy compound barbell session targeting the lower body.",
    exercises: [
      { name: "Barbell Back Squats", sets: 4, reps: "6-8 reps", rest: "120s" },
      { name: "Romanian Deadlifts (Dumbbell or Barbell)", sets: 3, reps: "10 reps", rest: "90s" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "8 per leg", rest: "90s" },
      { name: "Leg Extensions", sets: 3, reps: "12 reps (last set to failure)", rest: "60s" },
      { name: "Seated Calf Raises", sets: 3, reps: "15 reps", rest: "60s" }
    ]
  }
];

// Fetch available workouts catalog
router.get('/templates', authMiddleware, (req, res) => {
  res.json(WORKOUT_TEMPLATES);
});

// Fetch user's personal workout log history
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const workouts = dbConnection.getCollection('workouts');
    const logs = await workouts.find({ userId: req.user.userId });
    
    // Sort chronologically (newest first)
    const sortedLogs = logs.sort((a, b) => new Date(b.loggedAt || b.createdAt) - new Date(a.loggedAt || a.createdAt));
    
    res.json(sortedLogs);
  } catch (err) {
    console.error('Fetch logs error:', err);
    res.status(500).json({ error: 'Failed to retrieve workout logs' });
  }
});

// Log a completed workout session
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { name, duration, caloriesBurned, type } = req.body;

    if (!name || !duration || !caloriesBurned) {
      return res.status(400).json({ error: 'Please provide name, duration, and calories burned' });
    }

    const workouts = dbConnection.getCollection('workouts');
    const users = dbConnection.getCollection('users');

    // Save workout log
    const newLog = await workouts.create({
      userId: req.user.userId,
      name,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      type: type || 'home',
      loggedAt: new Date().toISOString()
    });

    // Fetch user to check achievements
    const user = await users.findOne({ _id: req.user.userId });
    if (user) {
      const achievements = [...(user.achievements || [])];
      
      // Award workout count badges
      const userLogs = await workouts.find({ userId: req.user.userId });
      const completedCount = userLogs.length;

      if (completedCount >= 1 && !achievements.includes('first_workout')) {
        achievements.push('first_workout');
      }
      if (completedCount >= 5 && !achievements.includes('workout_5')) {
        achievements.push('workout_5');
      }

      await users.updateOne({ _id: req.user.userId }, { $set: { achievements } });
    }

    res.status(201).json(newLog);
  } catch (err) {
    console.error('Log workout error:', err);
    res.status(500).json({ error: 'Failed to record workout' });
  }
});

export default router;

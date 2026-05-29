import express from 'express';
import dbConnection from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Helper to get today's date string in YYYY-MM-DD format
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Get today's tracking status summary
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const trackers = dbConnection.getCollection('trackers');
    const users = dbConnection.getCollection('users');
    const workouts = dbConnection.getCollection('workouts');
    
    const today = getTodayString();
    const userId = req.user.userId;

    // Fetch user profile for weight, height, BMI metrics
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // 1. Water Intake calculation (sum of all water records logged today)
    const todayWaterLogs = await trackers.find({ userId, type: 'water', date: today });
    const totalWater = todayWaterLogs.reduce((sum, log) => sum + (log.amount || 0), 0);

    // 2. Calories Consumed calculation
    const todayCalorieLogs = await trackers.find({ userId, type: 'calories_consumed', date: today });
    const totalCaloriesConsumed = todayCalorieLogs.reduce((sum, log) => sum + (log.calories || 0), 0);

    // 3. Calories Burned calculation (fetch workouts logged today)
    const todayWorkouts = await workouts.find({ userId });
    const totalCaloriesBurned = todayWorkouts
      .filter(w => {
        const logDate = w.loggedAt ? w.loggedAt.split('T')[0] : w.createdAt.split('T')[0];
        return logDate === today;
      })
      .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    // 4. Calculate current BMI
    const weight = user.weight || 70;
    const heightM = (user.height || 175) / 100;
    const bmi = Number((weight / (heightM * heightM)).toFixed(1));

    res.json({
      streak: user.streak || 0,
      achievements: user.achievements || [],
      weight,
      height: user.height || 175,
      bmi,
      waterTarget: 2500, // standard target in ml
      waterLogged: totalWater,
      calorieConsumingTarget: user.goal === 'gain' ? 2800 : 2000,
      caloriesConsumed: totalCaloriesConsumed,
      caloriesBurnedTarget: 400,
      caloriesBurned: totalCaloriesBurned
    });
  } catch (err) {
    console.error('Fetch tracking summary error:', err);
    res.status(500).json({ error: 'Failed to retrieve daily stats summary' });
  }
});

// Log water consumption
router.post('/water', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Please provide a valid water amount in ml' });
    }

    const trackers = dbConnection.getCollection('trackers');
    const users = dbConnection.getCollection('users');
    const today = getTodayString();

    // Create water log entry
    const newLog = await trackers.create({
      userId: req.user.userId,
      type: 'water',
      amount: Number(amount),
      date: today
    });

    // Check achievement badges for hydration
    const user = await users.findOne({ _id: req.user.userId });
    if (user) {
      const achievements = [...(user.achievements || [])];
      
      // Compute total water logged today
      const todayWaterLogs = await trackers.find({ userId: req.user.userId, type: 'water', date: today });
      const totalWaterToday = todayWaterLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
      
      if (totalWaterToday >= 2500 && !achievements.includes('hydration_hero')) {
        achievements.push('hydration_hero');
        await users.updateOne({ _id: req.user.userId }, { $set: { achievements } });
      }
    }

    res.status(201).json(newLog);
  } catch (err) {
    console.error('Log water error:', err);
    res.status(500).json({ error: 'Failed to record water logs' });
  }
});

// Log food/meals calories consumed
router.post('/calories', authMiddleware, async (req, res) => {
  try {
    const { calories } = req.body;
    if (!calories || Number(calories) <= 0) {
      return res.status(400).json({ error: 'Please provide valid calorie count' });
    }

    const trackers = dbConnection.getCollection('trackers');
    const today = getTodayString();

    const newLog = await trackers.create({
      userId: req.user.userId,
      type: 'calories_consumed',
      calories: Number(calories),
      date: today
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error('Log calories error:', err);
    res.status(500).json({ error: 'Failed to record calories' });
  }
});

// Log weight check-in
router.post('/weight', authMiddleware, async (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight || Number(weight) <= 0) {
      return res.status(400).json({ error: 'Please provide valid weight in kg' });
    }

    const trackers = dbConnection.getCollection('trackers');
    const users = dbConnection.getCollection('users');
    const today = getTodayString();

    // Fetch user details for BMI calculation
    const user = await users.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const heightM = (user.height || 175) / 100;
    const bmiVal = Number((Number(weight) / (heightM * heightM)).toFixed(1));

    // Save weight progress log
    const newLog = await trackers.create({
      userId: req.user.userId,
      type: 'weight',
      weight: Number(weight),
      bmi: bmiVal,
      date: today
    });

    // Update weight in core profile
    await users.updateOne({ _id: req.user.userId }, { $set: { weight: Number(weight) } });

    res.status(201).json(newLog);
  } catch (err) {
    console.error('Log weight error:', err);
    res.status(500).json({ error: 'Failed to log weight progress' });
  }
});

// Get progress telemetry history (for the last 7 active logging dates)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const trackers = dbConnection.getCollection('trackers');
    const workouts = dbConnection.getCollection('workouts');
    const userId = req.user.userId;

    // Get dates for last 7 calendar days
    const historyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Fetch tracking records for this date
      const waterLogs = await trackers.find({ userId, type: 'water', date: dateStr });
      const waterLogged = waterLogs.reduce((sum, l) => sum + (l.amount || 0), 0);

      const calorieLogs = await trackers.find({ userId, type: 'calories_consumed', date: dateStr });
      const caloriesConsumed = calorieLogs.reduce((sum, l) => sum + (l.calories || 0), 0);

      const weightLogs = await trackers.find({ userId, type: 'weight', date: dateStr });
      const weightLogged = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;

      // Calories burned
      const dayWorkouts = await workouts.find({ userId });
      const caloriesBurned = dayWorkouts
        .filter(w => {
          const logDate = w.loggedAt ? w.loggedAt.split('T')[0] : w.createdAt.split('T')[0];
          return logDate === dateStr;
        })
        .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

      // Shorten date label to "Mon", "Tue" etc.
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });

      historyData.push({
        date: dateStr,
        label,
        water: waterLogged,
        consumed: caloriesConsumed,
        burned: caloriesBurned,
        weight: weightLogged
      });
    }

    // Fill missing weight items in history with current user weight
    const users = dbConnection.getCollection('users');
    const user = await users.findOne({ _id: userId });
    let lastKnownWeight = user?.weight || 70;
    
    // Scan chronological history to cascade the last known weight forward
    for (let item of historyData) {
      if (item.weight !== null) {
        lastKnownWeight = item.weight;
      } else {
        item.weight = lastKnownWeight;
      }
    }

    res.json(historyData);
  } catch (err) {
    console.error('Fetch analytics history error:', err);
    res.status(500).json({ error: 'Failed to compile telemetry history' });
  }
});

export default router;

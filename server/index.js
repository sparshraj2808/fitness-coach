import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './config/db.js';

// Import routes
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import workoutsRouter from './routes/workouts.js';
import trackerRouter from './routes/tracker.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection
await dbConnection.connect();

// Base health route
app.get('/', (req, res) => {
  res.json({ message: '⚡ FitCoach AI API is active and burning calories!' });
});

// Register routers
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/tracker', trackerRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 =================================================`);
    console.log(`🔥 FitCoach AI API Server Running!`);
    console.log(`🔌 Local Endpoint: http://localhost:${PORT}`);
    console.log(`🎯 DB Status: ${dbConnection.isMongoDB ? 'MongoDB (Production)' : 'Local JSON File (Sandbox)'}`);
    console.log(`================================================= 🚀\n`);
  });
}

export default app;

import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { startReminderJob } from './jobs/reminderJob.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
    startReminderJob();
  } catch (e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
}

start();

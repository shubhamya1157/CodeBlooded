import express from 'express';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { Membership } from './models/Membership.js';

import * as url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Redis Client
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// redisClient.on('error', err => console.log('Redis Auth Error', err));
// await redisClient.connect().catch(e => console.error("Redis conn err: ", e.message));

const connectDB = async (retries = 5) => {
  const mongoUri = process.env.MONGO_URI_AUTH || 'mongodb://localhost:27017/auth';
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoUri, {
        retryWrites: true,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10
      });
      console.log('User Auth DB Connected');
      return true;
    } catch (err) {
      console.error(`DB connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error('Failed to connect to database after retries. Proceeding anyway...');
  return false;
};

(async () => {
  try {
    await connectDB();
    
    const { default: usersRoutes } = await import('./routes/users.js');
    const { default: orgsRoutes } = await import('./routes/organizations.js');

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'auth' });
    });

    app.use('/auth', authRoutes);
    app.use('/users', usersRoutes);
    app.use('/organizations', orgsRoutes);

    // Internal route for RBAC checks
    app.get('/internal/membership/:userId/:orgId', async (req, res) => {
      try {
        const { userId, orgId } = req.params;
        const membership = await Membership.findOne({ userId, orgId });
        if (!membership) return res.status(404).json({ error: 'Not found' });
        res.json(membership);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`User Auth Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal error during initialization:', err);
    process.exit(1);
  }
})();

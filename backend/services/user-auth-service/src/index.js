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

mongoose.connect(process.env.MONGO_URI_AUTH || 'mongodb://localhost:27017/auth')
  .then(() => console.log('User Auth DB Connected'))
  .catch(err => console.error('DB Err:', err));
import usersRoutes from './routes/users.js';
import orgsRoutes from './routes/organizations.js';
import membersRoutes from './routes/members.js';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-auth-service' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/organizations', orgsRoutes);
app.use('/members', membersRoutes);

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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err.message);
  res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
});

// 404 handler
app.use((req, res) => {
  console.warn('[404]', req.method, req.path);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Auth Service running on port ${PORT}`);
});

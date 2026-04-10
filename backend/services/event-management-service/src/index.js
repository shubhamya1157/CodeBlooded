import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import eventRoutes from './routes/events.js';

import * as url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const connectDB = async (retries = 5) => {
  const mongoUri = process.env.MONGO_URI_EVENTS || 'mongodb://localhost:27018/events';
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoUri, {
        retryWrites: true,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10
      });
      console.log('Events DB Connected');
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
    
    app.use('/', eventRoutes);

    io.on('connection', (socket) => {
      socket.on('subscribe:event', ({ eventId }) => {
        socket.join(eventId);
      });
      socket.on('unsubscribe:event', ({ eventId }) => {
        socket.leave(eventId);
      });
    });

    const PORT = process.env.EVENT_SERVICE_PORT || process.env.PORT || 3002;
    httpServer.listen(PORT, () => {
      console.log(`Event Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal error during initialization:', err);
    process.exit(1);
  }
})();

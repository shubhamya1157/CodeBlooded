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

mongoose.connect(process.env.MONGO_URI_EVENTS || 'mongodb://localhost:27018/events')
  .then(() => console.log('Events DB Connected'))
  .catch(err => console.error('DB Err:', err));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'event-management-service' });
});

app.use('/', eventRoutes);
app.use('/events', eventRoutes);

io.on('connection', (socket) => {
  socket.on('subscribe:event', ({ eventId }) => {
    socket.join(eventId);
  });
  socket.on('unsubscribe:event', ({ eventId }) => {
    socket.leave(eventId);
  });
});

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});

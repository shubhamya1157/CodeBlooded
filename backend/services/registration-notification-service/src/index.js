import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import registrationRoutes from './routes/registrations.js';

import * as url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI_REG || 'mongodb://localhost:27019/registrations')
  .then(() => console.log('Registration DB Connected'))
  .catch(err => console.error('DB Err:', err));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'registration-notification-service' });
});

app.use('/', registrationRoutes);
app.use('/registrations', registrationRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Registration Service running on port ${PORT}`);
});

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

const connectDB = async (retries = 5) => {
  const mongoUri = process.env.MONGO_URI_REG || 'mongodb://localhost:27019/registrations';
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoUri, {
        retryWrites: true,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10
      });
      console.log('Registration DB Connected');
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
    
    app.use('/', registrationRoutes);

    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
      console.log(`Registration Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal error during initialization:', err);
    process.exit(1);
  }
})();

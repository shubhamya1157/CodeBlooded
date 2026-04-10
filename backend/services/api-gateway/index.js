import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

import * as url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per minute)
});

app.use(cors());
app.use(morgan('dev'));
app.use(limiter);

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EVENTS_SERVICE = process.env.EVENTS_SERVICE_URL || 'http://localhost:3002';
const REGISTRATION_SERVICE = process.env.REGISTRATION_SERVICE_URL || 'http://localhost:3003';

// Proxy configuration
app.use('/api/auth', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/api/auth': '/auth' } }));
app.use('/api/users', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/api/users': '/users' } }));
app.use('/api/organizations', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/api/organizations': '/organizations' } }));
app.use('/api/members', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/api/members': '/members' } }));

app.use('/api/events', createProxyMiddleware({ target: EVENTS_SERVICE, changeOrigin: true, pathRewrite: { '^/api/events': '/' } }));

app.use('/api/register', createProxyMiddleware({ target: REGISTRATION_SERVICE, changeOrigin: true, pathRewrite: { '^/api/register': '/' } }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

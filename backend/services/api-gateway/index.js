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
  windowMs: 1 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(morgan('dev'));

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EVENTS_SERVICE = process.env.EVENTS_SERVICE_URL || 'http://localhost:3002';
const REGISTRATION_SERVICE = process.env.REGISTRATION_SERVICE_URL || 'http://localhost:3003';

console.log('Service URLs:', { AUTH_SERVICE, EVENTS_SERVICE, REGISTRATION_SERVICE });

// Apply rate limiting only to /api routes
app.use('/api/', limiter);

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error(`Proxy error [${req.method} ${req.originalUrl}] -> ${target}:`, err.message);
    if (!res.headersSent) {
      res.status(503).json({ error: 'Service unavailable', details: err.message });
    }
  },
});

// Auth service proxy routes
app.use('/api/auth', createProxyMiddleware({
  ...proxyOptions(AUTH_SERVICE),
  pathRewrite: (path) => `/auth${path === '/' ? '' : path}`,
}));
app.use('/api/users', createProxyMiddleware({
  ...proxyOptions(AUTH_SERVICE),
  pathRewrite: (path) => `/users${path === '/' ? '' : path}`,
}));
app.use('/api/organizations', createProxyMiddleware({
  ...proxyOptions(AUTH_SERVICE),
  pathRewrite: (path) => `/organizations${path === '/' ? '' : path}`,
}));
app.use('/api/members', createProxyMiddleware({
  ...proxyOptions(AUTH_SERVICE),
  pathRewrite: (path) => `/members${path === '/' ? '' : path}`,
}));

// Events service proxy routes
app.use('/api/events', createProxyMiddleware(proxyOptions(EVENTS_SERVICE)));

// Registration service proxy routes
app.use('/api/register', createProxyMiddleware(proxyOptions(REGISTRATION_SERVICE)));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', services: { auth: AUTH_SERVICE, events: EVENTS_SERVICE, registration: REGISTRATION_SERVICE } });
});

// Catch-all 404
app.use((req, res) => {
  console.warn(`Unhandled route: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({ error: 'Gateway error', message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import http from 'http';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EVENTS_SERVICE = process.env.EVENTS_SERVICE_URL || 'http://localhost:3002';
const REGISTRATION_SERVICE = process.env.REGISTRATION_SERVICE_URL || 'http://localhost:3003';

console.log('Service URLs:', { AUTH_SERVICE, EVENTS_SERVICE, REGISTRATION_SERVICE });

// Apply rate limiting only to /api routes
app.use('/api/', limiter);

// Auth service proxy routes
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/auth' },
  onError: (err, req, res) => {
    console.error('Auth proxy error:', err);
    res.status(503).json({ error: 'Auth service unavailable', details: err.message });
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Auth Response: ${proxyRes.statusCode}`);
  }
}));

app.use('/api/users', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/users' },
  onError: (err, req, res) => {
    console.error('Users proxy error:', err);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

app.use('/api/organizations', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/organizations': '/organizations' },
  onError: (err, req, res) => {
    console.error('Orgs proxy error:', err);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

app.use('/api/members', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/members': '/members' },
  onError: (err, req, res) => {
    console.error('Members proxy error:', err);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

// Events service proxy
app.use('/api/events', createProxyMiddleware({
  target: EVENTS_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/events': '' },
  onError: (err, req, res) => {
    console.error('Events proxy error:', err);
    res.status(503).json({ error: 'Events service unavailable' });
  }
}));

// Registration service proxy
app.use('/api/register', createProxyMiddleware({
  target: REGISTRATION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/register': '' },
  onError: (err, req, res) => {
    console.error('Registration proxy error:', err);
    res.status(503).json({ error: 'Registration service unavailable' });
  }
}));

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

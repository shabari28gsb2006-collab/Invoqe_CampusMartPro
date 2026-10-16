import 'dotenv/config';
import dns from 'node:dns';

// Some Windows/mobile-hotspot DNS resolvers fail MongoDB SRV queries. Use public resolvers for Node's DNS lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { randomUUID } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { z } from 'zod';
import { api } from './routes/api.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  // Optional during frontend/demo development. Database-backed routes return 503 until configured.
  MONGODB_URI: z.string().default(''),
  CLIENT_ORIGIN: z.string().url().default(process.env.CLIENT_URL || 'http://localhost:3000'),
  SESSION_SECRET: z.string().min(32).default(process.env.JWT_SECRET || 'campusmart-development-only-secret-change-before-production-2026'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
  process.exit(1);
}
const env = parsed.data;
// Make validated/defaulted secrets available to route modules as well as this entrypoint.
if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = env.SESSION_SECRET;
if (env.NODE_ENV === 'production') {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET || '';
  const hasDemoPortalCredentials = ['SELLER_USERNAME','SELLER_PASSWORD','ADMIN_USERNAME','ADMIN_PASSWORD'].some(key => !process.env[key] || /^(seller|admin|seller@campusmart|admin@campusmart)$/i.test(process.env[key] || ''));
  if (secret.length < 32 || /replace_with|development-only/i.test(secret)) {
    console.error('Production requires a unique SESSION_SECRET with at least 32 characters.'); process.exit(1);
  }
  if (hasDemoPortalCredentials) {
    console.error('Production requires custom SELLER_USERNAME, SELLER_PASSWORD, ADMIN_USERNAME, and ADMIN_PASSWORD values.'); process.exit(1);
  }
}
export const app = express();
let mongoConnectPromise: Promise<unknown> | undefined;
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN.split(',').map(s => s.trim()), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use((req, res, next) => {
  const requestId = req.header('x-request-id')?.slice(0, 100) || randomUUID();
  res.setHeader('x-request-id', requestId);
  next();
});
app.get('/', (_req, res) => res.json({ name: 'CampusMart Pro API', version: '1.0.0', docs: '/api/v1/health/live' }));
app.use('/api/v1', async (req, res, next) => {
  // Serverless deployments connect on demand; local server connects in the background below.
  if (req.path === '/health/live' || req.path === '/health/ready') return next();
  if (mongoose.connection.readyState !== 1 && process.env.VERCEL === '1' && env.MONGODB_URI.trim()) {
    try {
      if (!mongoConnectPromise) {
        mongoConnectPromise = mongoose.connect(env.MONGODB_URI.trim(), { serverSelectionTimeoutMS: 8000 }).then(() => undefined);
      }
      await mongoConnectPromise;
    } catch (error) {
      mongoConnectPromise = undefined;
      console.error('MongoDB connection failed:', (error as any)?.message || error);
    }
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected yet. Check server/.env MONGODB_URI and network/DNS access.',
      database: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    });
  }
  return next();
}, api);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error?.name === 'ZodError') return res.status(400).json({ message: 'Invalid request data', issues: error.issues });
  if (error?.code === 11000) return res.status(409).json({ message: 'A record with this value already exists.' });
  if (error?.name === 'CastError') return res.status(400).json({ message: 'Invalid identifier.' });
  const status = Number(error?.status) || 500;
  if (status >= 500) console.error('API error:', error?.message || error);
  return res.status(status).json({ message: status >= 500 ? 'An unexpected server error occurred.' : error.message });
});

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectMongoWithRetry() {
  const uri = env.MONGODB_URI.trim();
  if (!uri || /YOUR_CLUSTER_HOST|YOUR_DB_USERNAME|URL_ENCODED_PASSWORD|<db_username>|<db_password>/i.test(uri)) {
    console.warn('MongoDB is not configured. The API will stay online for health checks; database routes return HTTP 503.');
    console.warn('Set a real MONGODB_URI in server/.env to enable database-backed features.');
    return;
  }

  while (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log('MongoDB connected');
      return;
    } catch (error: any) {
      console.error(`MongoDB connection failed: ${error?.message || error}`);
      console.error('The API remains online. Retrying MongoDB connection in 15 seconds.');
      await wait(15_000);
    }
  }
}

// Vercel imports the Express app as a serverless function. Local development uses the listener.
if (process.env.VERCEL !== '1') {
  const server = app.listen(env.PORT, () => {
    console.log(`CampusMart API listening on :${env.PORT}`);
    void connectMongoWithRetry();
  });

  const shutdown = async () => {
    server.close();
    try { await mongoose.disconnect(); } catch { /* ignore shutdown cleanup errors */ }
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

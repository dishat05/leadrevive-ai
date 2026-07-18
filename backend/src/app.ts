import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
// import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env, corsOrigins } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(healthRoutes);

app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(mongoSanitize());

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/ready',
});

const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  skipSuccessfulRequests: true,
});

app.use('/api', globalLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', apiRoutes);
app.use(errorHandler);

export default app;

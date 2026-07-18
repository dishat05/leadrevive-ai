import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import app from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';

let isConnected = false;

async function bootstrap() {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(env.PORT, () => {
      console.log(`LeadRevive API running on port ${env.PORT}`);
    });
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Vercel handler
export default async function handler(req: express.Request, res: express.Response) {
  await bootstrap();
  return app(req, res);
}

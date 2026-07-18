import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';

async function bootstrap() {
  await connectDb();

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

export default app;

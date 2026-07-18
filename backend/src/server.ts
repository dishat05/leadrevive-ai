import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';

async function main() {
  await connectDb();

  app.listen(env.PORT, () => {
    console.log(`LeadRevive API running on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

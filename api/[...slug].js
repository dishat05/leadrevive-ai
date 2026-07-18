import dotenv from 'dotenv';
dotenv.config();

import app from '../backend/src/app.js';
import { connectDb } from '../backend/src/config/db.js';

let isConnected = false;

async function bootstrap() {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }
}

export default async function handler(req, res) {
  await bootstrap();
  
  const originalUrl = req.url;
  req.url = req.url?.replace(/^\/api/, '') || '/';
  
  app(req, res, (err) => {
    if (err) {
      console.error('API Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  req.url = originalUrl;
}

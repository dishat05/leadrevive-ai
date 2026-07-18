
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import app from '../backend/src/app.js';
import { connectDb } from '../backend/src/config/db.js';

let isConnected = false;

async function bootstrap() {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }
}

export default async function handler(req: express.Request, res: express.Response) {
  await bootstrap();
  
  // Rewrite req.url to strip /api prefix
  const originalUrl = req.url;
  req.url = req.url.replace(/^\/api/, '') || '/';
  
  app(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Restore original URL for potential middleware
  req.url = originalUrl;
}

import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuth(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: { message: 'No token' } });
  
  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
}
import { Response, NextFunction } from 'express';

export function requireAuth(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: { message: 'No token' } });
  
  try {
    req.user = { id: 'user-id', _id: 'user-id' };
    next();
  } catch {
    res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
}
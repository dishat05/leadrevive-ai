import { Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: any, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(err.statusCode || 500).json({ 
    success: false, 
    error: { message: err.message || 'Server error' } 
  });
}
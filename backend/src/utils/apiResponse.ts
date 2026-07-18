import { Response } from 'express';

export function apiResponse(success: boolean, data: any, message?: string) {
  if (success) return { success: true, data };
  return { success: false, error: { message: message || 'Error' } };
}

export function sendSuccess(res: Response, data: any, statusCode = 200) {
  res.status(statusCode).json({ success: true, data });
}

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
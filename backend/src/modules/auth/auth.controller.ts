import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/express.js';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { getRefreshCookieOptions } from '../../utils/jwt.js';
import { REFRESH_COOKIE_NAME } from './auth.service.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const result = await authService.register(req.body);
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());
    sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 201);
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = await authService.login(req.body);
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());
    sendSuccess(res, { user: result.user, accessToken: result.accessToken });
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!token) {
      res.status(401).json({ success: false, error: { message: 'Refresh token not found' } });
      return;
    }
    const result = await authService.refresh(token);
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());
    sendSuccess(res, { accessToken: result.accessToken });
  } catch (error: any) {
    res.status(401).json({ success: false, error: { message: error.message } });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    await authService.logout(req.user._id, token);
    res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
    sendSuccess(res, { message: 'Logged out' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
}
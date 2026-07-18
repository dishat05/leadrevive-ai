import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../types/express.js';
import * as userService from './user.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await userService.getUserById(req.user._id);
  sendSuccess(res, user);
}

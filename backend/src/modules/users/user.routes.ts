import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import * as userController from './user.controller.js';

const router = Router();

router.get('/me', requireAuth, userController.getMe);

export default router;

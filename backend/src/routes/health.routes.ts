import { Router } from 'express';
import { isDbReady } from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok' });
});

router.get('/ready', (_req, res) => {
  if (isDbReady()) {
    sendSuccess(res, { status: 'ready', database: 'connected' });
    return;
  }
  res.status(503).json({
    success: false,
    error: { code: 'NOT_READY', message: 'Database not connected' },
  });
});

router.get('/api/v1/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', database: isDbReady() ? 'connected' : 'disconnected' });
});

export default router;

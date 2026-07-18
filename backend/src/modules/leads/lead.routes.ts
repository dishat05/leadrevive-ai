import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import {
  createLeadHandler,
  listLeadsHandler,
  getLeadHandler,
  updateLeadHandler,
  deleteLeadHandler,
}  from './lead.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/', createLeadHandler);
router.get('/', listLeadsHandler);
router.get('/:id', getLeadHandler);
router.patch('/:id', updateLeadHandler);
router.delete('/:id', deleteLeadHandler);

export default router;
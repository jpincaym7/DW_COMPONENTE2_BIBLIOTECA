import { Router } from 'express';
import { ROLES } from '@biblioteca/shared';

import { getMySummary, getSummary } from '../controllers/stats.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/me', getMySummary);
router.get('/summary', authorize(ROLES.ADMIN), getSummary);

export default router;

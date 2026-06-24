import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getProfileStatsHandler } from '../controllers/profileController';

const router = Router();
router.use(authenticate);
router.get('/stats', getProfileStatsHandler);

export default router;

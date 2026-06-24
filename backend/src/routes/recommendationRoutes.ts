import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getRecommendationsHandler } from '../controllers/recommendationController';

const router = Router();
router.use(authenticate);
router.get('/', getRecommendationsHandler);

export default router;

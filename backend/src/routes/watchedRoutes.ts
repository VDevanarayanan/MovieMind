import { Router } from 'express';
import { addWatchedHandler, getWatchedHandler, removeWatchedHandler } from '../controllers/watchedController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { watchedSchema } from '../schemas/watchedSchemas';

const router = Router();
router.use(authenticate);
router.post('/', validateBody(watchedSchema), addWatchedHandler);
router.delete('/:tmdbId', removeWatchedHandler);
router.get('/', getWatchedHandler);

export default router;

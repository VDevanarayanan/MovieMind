import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { rateMovieHandler, updateRatingHandler, getRatingsHandler } from '../controllers/ratingController';
import { ratingSchema } from '../schemas/ratingSchemas';

const router = Router();
router.use(authenticate);
router.post('/', validateBody(ratingSchema), rateMovieHandler);
router.put('/:id', validateBody(ratingSchema), updateRatingHandler);
router.get('/', getRatingsHandler);

export default router;

import { Router } from 'express';
import { movieDetailsHandler, popularMoviesHandler, searchMoviesHandler, trendingMoviesHandler } from '../controllers/movieController';

const router = Router();

router.get('/search', searchMoviesHandler);
router.get('/trending', trendingMoviesHandler);
router.get('/popular', popularMoviesHandler);
router.get('/:id', movieDetailsHandler);

export default router;

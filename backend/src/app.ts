import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import watchedRoutes from './routes/watchedRoutes';
import ratingRoutes from './routes/ratingRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import profileRoutes from './routes/profileRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watched', watchedRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/profile', profileRoutes);

app.use(errorHandler);

export default app;

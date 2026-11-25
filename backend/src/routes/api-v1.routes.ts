
import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes';
import movieRoutes from '../modules/movies/movie.routes';

const router = Router();

// Authentication endpoints
router.use('/auth', authRoutes);

// Movie endpoints
router.use('/movies', movieRoutes);

export default router;

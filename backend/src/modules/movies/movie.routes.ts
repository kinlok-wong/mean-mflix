
import { Router } from 'express';

import { movieController } from './movie.controller';
import { movieQuerySchema } from './movie.schema';
import { validateQuery } from '../../middleware/validate.middleware';

const router = Router();

router.get('/', validateQuery(movieQuerySchema), movieController.getMovies);

router.get('/genres', movieController.getGenres);

router.get('/:id/related', movieController.getRelatedMovies);

router.get('/:id/details', movieController.getMovieDetails);

router.get('/:id', movieController.getMovieById);

export default router;

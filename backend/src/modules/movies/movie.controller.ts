
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { movieService } from './movie.service';
import type { MovieQuery } from './movie.schema';
import { AppError } from '../../utils/app-error';

export class MovieController {
  getMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await movieService.getMovies(
        res.locals.movieQuery as MovieQuery
      );

      res.status(200).json({
        success: true,
        data: result.movies,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const movieId = req.params.id;

      if (typeof movieId !== 'string') {
        return next(new AppError('Invalid movie ID', 400));
      }

      const movie = await movieService.getMovieById(movieId);

      res.status(200).json({
        success: true,
        data: movie,
      });
    } catch (error) {
      next(error);
    }
  };

  getGenres = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const genres = await movieService.getGenres();

      res.status(200).json({
        success: true,
        data: genres,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const movieController = new MovieController();

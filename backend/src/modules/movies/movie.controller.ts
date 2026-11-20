import type { Request, Response, NextFunction } from 'express';
import { movieService } from './movie.service';
import type { MovieQuery } from './movie.schema';
import { AppError } from '../../utils/app-error';
import {
  sendSuccess,
  sendPaginated,
} from '../../utils/api-response';

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

      sendPaginated(res, result.movies, result.pagination);
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

      sendSuccess(res, movie);
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

      sendSuccess(res, genres);
    } catch (error) {
      next(error);
    }
  };
}

export const movieController = new MovieController();
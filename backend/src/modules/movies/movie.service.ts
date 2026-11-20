
import { Types } from 'mongoose';

import {
  movieRepository,
} from './movie.repository';

import type {
  MovieFilters,
} from './movie.repository';

import type {
  MovieQuery,
} from './movie.schema';

import { AppError } from '../../utils/app-error';

export class MovieService {
  async getMovies(query: MovieQuery) {
    const filters: MovieFilters = {
      search: query.search,
      genre: query.genre,
      year: query.year,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      limit: query.limit,
    };

    return movieRepository.findAll(filters);
  }

  async getMovieById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid movie ID', 400);
    }

    const movie = await movieRepository.findById(id);

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    return movie;
  }

  async getGenres() {
    return movieRepository.findGenres();
  }

  async getMovieDetails(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid movie ID', 400);
    }

    const movie = await movieRepository.findDetailsById(id);

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    return movie;
  }

  async getRelatedMovies(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid movie ID', 400);
    }

    const movie = await movieRepository.findDetailsById(id);

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    const genres = movie.genres ?? [];

    if (genres.length === 0) {
      return [];
    }

    return movieRepository.findRelatedMovies(
      movie._id,
      genres,
      10
    );
  }
}

export const movieService = new MovieService();

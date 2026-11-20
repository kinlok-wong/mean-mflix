
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
}

export const movieService = new MovieService();

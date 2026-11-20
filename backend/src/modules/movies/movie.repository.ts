
import { Types } from 'mongoose';
import type { QueryFilter } from 'mongoose';

import { MovieModel, type Movie } from './movie.model';

export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: number;
  page: number;
  limit: number;
}

export class MovieRepository {
  async findAll(filters: MovieFilters) {
    const {
      search,
      genre,
      year,
      page,
      limit,
    } = filters;

    const query: QueryFilter<Movie> = {};

    if (search) {
      query.title = {
        $regex: escapeRegex(search),
        $options: 'i',
      };
    }

    if (genre) {
      query.genres = genre;
    }

    if (year) {
      query.year = year;
    }

    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      MovieModel.find(query)
        .select('title year genres runtime poster plot imdb')
        .sort({ year: -1, title: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      MovieModel.countDocuments(query),
    ]);

    return {
      movies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return MovieModel.findById(id)
      .select('-__v')
      .lean();
  }

  async findGenres(): Promise<string[]> {
    const genres = await MovieModel.distinct('genres');

    return genres
      .filter((genre): genre is string =>
        typeof genre === 'string'
      )
      .sort((a, b) => a.localeCompare(b));
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const movieRepository = new MovieRepository();

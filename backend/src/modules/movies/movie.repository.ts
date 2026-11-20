
import { Types } from 'mongoose';
import type { QueryFilter } from 'mongoose';

import { MovieModel, type Movie } from './movie.model';
import type { SortOrder } from 'mongoose';

export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: number;
  sortBy: 'year' | 'title' | 'rating' | 'released';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export class MovieRepository {
  async findAll(filters: MovieFilters) {
    const {
      search,
      genre,
      year,
      sortBy,
      sortOrder,
      page,
      limit,
    } = filters;

    const query: QueryFilter<Movie> = {};

    if (search) {
      const safeSearch = escapeRegex(search);

      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { plot: { $regex: safeSearch, $options: 'i' } },
        { cast: { $regex: safeSearch, $options: 'i' } },
        { directors: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (genre) {
      query.genres = {
        $regex: `^${escapeRegex(genre)}$`,
        $options: 'i',
      };
    }

    if (year !== undefined) {
      query.year = year;
    }

    const sortFieldMap = {
      year: 'year',
      title: 'title',
      rating: 'imdb.rating',
      released: 'released',
    } as const;

    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const sort: Record<string, SortOrder> = {
      [sortFieldMap[sortBy]]: sortDirection,
      _id: 1,
    };

    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      MovieModel.find(query)
        .select(
          'title year genres runtime poster plot imdb released'
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      MovieModel.countDocuments(query),
    ]);

    return {
      movies,
      pagination: {
        page,
        limit,
        total,
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

  async findDetailsById(id: string): Promise<Movie | null> {
    return MovieModel.findById(id)
      .select(
        'title year genres runtime cast directors plot fullplot poster released imdb countries languages rated awards type'
      )
      .lean<Movie>()
      .exec();
  }

  async findRelatedMovies(
    movieId: Types.ObjectId,
    genres: string[],
    limit = 10
  ): Promise<Movie[]> {
    return MovieModel.find({
      _id: { $ne: movieId },
      genres: { $in: genres },
    })
      .select(
        'title year genres runtime poster plot imdb'
      )
      .sort({
        'imdb.rating': -1,
        year: -1,
      })
      .limit(limit)
      .lean<Movie[]>()
      .exec();
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const movieRepository = new MovieRepository();

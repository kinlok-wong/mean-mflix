
import mongoose, { Schema, Types } from 'mongoose';

export interface Movie {
  _id: Types.ObjectId;
  title: string;
  year?: number;
  genres?: string[];
  runtime?: number;
  cast?: string[];
  directors?: string[];
  plot?: string;
  fullplot?: string;
  poster?: string;
  released?: Date;
  imdb?: {
    rating?: number;
    votes?: number;
    id?: number;
  };
}

const movieSchema = new Schema(
  {},
  {
    strict: false,
    versionKey: false,
    collection: 'movies',
  }
);

export const MovieModel = mongoose.model(
  'Movie',
  movieSchema,
  'movies'
);

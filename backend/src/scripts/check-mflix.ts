
import 'dotenv/config';

import mongoose from 'mongoose';
import {
  connectDatabase,
  disconnectDatabase
} from '../config/database';

async function main(): Promise<void> {
  try {
    console.log('Connecting to MongoDB Atlas...');

    await connectDatabase();

    const database = mongoose.connection.db;

    if (!database) {
      throw new Error('Database connection is unavailable');
    }

    // Verify database connectivity
    await database.admin().command({ ping: 1 });

    console.log('Database ping successful');

    // Verify Sample Mflix access
    const moviesCollection = database.collection('movies');

    const totalMovies = await moviesCollection.countDocuments();

    console.log(`Total movies: ${totalMovies}`);

    // Retrieve one movie
    const sampleMovie = await moviesCollection.findOne(
      {},
      {
        projection: {
          title: 1,
          year: 1,
          genres: 1,
          plot: 1
        }
      }
    );

    console.log('Sample movie:');

    console.log(
      JSON.stringify(sampleMovie, null, 2)
    );

    if (totalMovies === 0 || !sampleMovie) {
      throw new Error(
        'Sample Mflix movies collection is empty'
      );
    }

    console.log('MongoDB Atlas verification successful');

  } catch (error) {
    console.error('MongoDB verification failed');

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exitCode = 1;

  } finally {
    await disconnectDatabase();
  }
}

main();

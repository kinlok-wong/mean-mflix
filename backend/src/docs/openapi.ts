export const openApiDocument = {
  openapi: '3.1.0',

  info: {
    title: 'MEAN Movie Explorer API',
    version: '1.0.0',
    description:
      'REST API for searching, filtering and exploring movies from MongoDB Atlas Sample Mflix.',
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],

  tags: [
    {
      name: 'Health',
      description: 'API health checks',
    },
    {
      name: 'Movies',
      description: 'Movie search and details',
    },
  ],

  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          '200': {
            description: 'API is running',
          },
        },
      },
    },

    '/api/v1/movies': {
      get: {
        tags: ['Movies'],
        summary: 'Get movies with search, filters and pagination',

        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search movie title, plot, cast or directors',
          },
          {
            name: 'genre',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'year',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1888,
              maximum: 2100,
            },
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['year', 'title', 'rating', 'released'],
              default: 'year',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 50,
              default: 20,
            },
          },
        ],

        responses: {
          '200': {
            description: 'Movies retrieved successfully',
          },
          '400': {
            description: 'Invalid query parameters',
          },
        },
      },
    },

    '/api/v1/movies/genres': {
      get: {
        tags: ['Movies'],
        summary: 'Get available movie genres',
        responses: {
          '200': {
            description: 'Genres retrieved successfully',
          },
        },
      },
    },

    '/api/v1/movies/{id}': {
      get: {
        tags: ['Movies'],
        summary: 'Get a movie by ID',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],

        responses: {
          '200': {
            description: 'Movie retrieved successfully',
          },
          '400': {
            description: 'Invalid movie ID',
          },
          '404': {
            description: 'Movie not found',
          },
        },
      },
    },

    '/api/v1/movies/{id}/details': {
      get: {
        tags: ['Movies'],
        summary: 'Get complete movie details',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],

        responses: {
          '200': {
            description: 'Movie details retrieved successfully',
          },
          '404': {
            description: 'Movie not found',
          },
        },
      },
    },

    '/api/v1/movies/{id}/related': {
      get: {
        tags: ['Movies'],
        summary: 'Get related movies',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],

        responses: {
          '200': {
            description: 'Related movies retrieved successfully',
          },
        },
      },
    },
  },
};
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
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MovieListResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
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
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GenreResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
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
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MovieListResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid movie ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Movie not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
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
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MovieListResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid movie ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Movie not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
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
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RelatedMoviesResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid movie ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Movie not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Imdb: {
        type: 'object',
        properties: {
          rating: { type: 'number', example: 7.4 },
          votes: { type: 'integer', example: 9847 },
          id: { type: 'integer', example: 123456 },
        },
      },

      Movie: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '573a1390f29313caabcd42e8',
          },
          title: {
            type: 'string',
            example: 'The Great Train Robbery',
          },
          year: {
            type: 'integer',
            example: 1903,
          },
          genres: {
            type: 'array',
            items: { type: 'string' },
            example: ['Short', 'Western'],
          },
          runtime: {
            type: 'integer',
            example: 11,
          },
          plot: {
            type: 'string',
            example: 'A group of bandits stage a train hold-up.',
          },
          poster: {
            type: 'string',
            format: 'uri',
            nullable: true,
          },
          imdb: {
            $ref: '#/components/schemas/Imdb',
          },
        },
      },

      MovieDetails: {
        allOf: [
          { $ref: '#/components/schemas/Movie' },
          {
            type: 'object',
            properties: {
              fullplot: { type: 'string' },
              cast: {
                type: 'array',
                items: { type: 'string' },
              },
              directors: {
                type: 'array',
                items: { type: 'string' },
              },
              countries: {
                type: 'array',
                items: { type: 'string' },
              },
              languages: {
                type: 'array',
                items: { type: 'string' },
              },
              rated: { type: 'string' },
              released: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        ],
      },

      Pagination: {
        type: 'object',
        required: ['page', 'limit', 'total', 'totalPages'],
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 21349 },
          totalPages: { type: 'integer', example: 1068 },
        },
      },

      MovieListResponse: {
        type: 'object',
        required: ['success', 'data', 'pagination'],
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Movie' },
          },
          pagination: {
            $ref: '#/components/schemas/Pagination',
          },
        },
      },

      MovieDetailsResponse: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            $ref: '#/components/schemas/MovieDetails',
          },
        },
      },

      GenreResponse: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { type: 'string' },
            example: ['Action', 'Adventure', 'Comedy'],
          },
        },
      },

      ErrorResponse: {
        type: 'object',
        required: ['success', 'message'],
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Movie not found',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },

      RelatedMoviesResponse: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Movie' },
          },
        },
      },
    },
  },
};
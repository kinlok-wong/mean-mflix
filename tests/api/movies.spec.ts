import { test, expect } from '@playwright/test';

test.describe('Movie API', () => {

  test('should return paginated movies', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?page=1&limit=5'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(5);

    expect(body.pagination).toMatchObject({
      page: 1,
      limit: 5,
    });

    expect(body.pagination.total).toBeGreaterThan(0);
  });

  test('should search movies by keyword', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?search=Batman&limit=5'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('should filter movies by genre', async ({ request }) => {
    const genreResponse = await request.get(
      '/api/v1/movies/genres'
    );

    expect(genreResponse.status()).toBe(200);

    const genreBody = await genreResponse.json();
    const genre = genreBody.data[0];

    expect(genre).toBeTruthy();

    const response = await request.get(
      `/api/v1/movies?genre=${encodeURIComponent(genre)}&limit=10`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);

    for (const movie of body.data) {
      expect(movie.genres).toContain(genre);
    }
  });

  test('should filter movies by year', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?year=2000&limit=10'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);

    for (const movie of body.data) {
      expect(movie.year).toBe(2000);
    }
  });

  test('should sort movies by title ascending', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?sortBy=title&sortOrder=asc&limit=10'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    const titles = body.data.map(
      (movie: { title: string }) => movie.title
    );

    expect(titles).toEqual(
      [...titles].sort()
    );
  });

  test('should return movie details', async ({ request }) => {
    const listResponse = await request.get(
      '/api/v1/movies?page=1&limit=1'
    );

    const listBody = await listResponse.json();
    const movieId = listBody.data[0]._id;

    const response = await request.get(
      `/api/v1/movies/${movieId}/details`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data._id).toBe(movieId);
    expect(body.data).toHaveProperty('title');
    expect(body.data).toHaveProperty('genres');
  });

  test('should return related movies', async ({ request }) => {
    const listResponse = await request.get(
      '/api/v1/movies?page=1&limit=1'
    );

    const listBody = await listResponse.json();
    const movieId = listBody.data[0]._id;

    const response = await request.get(
      `/api/v1/movies/${movieId}/related`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(10);

    for (const movie of body.data) {
      expect(movie._id).not.toBe(movieId);
    }
  });

  test('should reject an invalid movie ID', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies/invalid-id'
    );

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

  test('should reject invalid query parameters', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?page=0'
    );

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

  test('should return empty results when no movie matches', async ({ request }) => {
    const response = await request.get(
        '/api/v1/movies?search=XYZMovieDoesNotExist987654'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(0);
    expect(body.pagination.total).toBe(0);
    expect(body.pagination.totalPages).toBe(0);
  });

  test('should reject invalid sorting parameters', async ({ request }) => {
    const response = await request.get(
        '/api/v1/movies?sortBy=invalidField'
    );

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

  test('should reject invalid pagination parameters', async ({ request }) => {
    const invalidPage = await request.get(
        '/api/v1/movies?page=0'
    );

    expect(invalidPage.status()).toBe(400);

    const invalidLimit = await request.get(
        '/api/v1/movies?limit=100'
    );

    expect(invalidLimit.status()).toBe(400);
  });

  test('should return 404 when movie does not exist', async ({ request }) => {
    const response = await request.get(
        '/api/v1/movies/000000000000000000000000/details'
    );

    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe('Movie not found');
  });

  test('should return different movies across pages', async ({ request }) => {
    const page1Response = await request.get(
        '/api/v1/movies?page=1&limit=10&sortBy=year&sortOrder=desc'
    );

    const page2Response = await request.get(
        '/api/v1/movies?page=2&limit=10&sortBy=year&sortOrder=desc'
    );

    expect(page1Response.status()).toBe(200);
    expect(page2Response.status()).toBe(200);

    const page1 = await page1Response.json();
    const page2 = await page2Response.json();

    const page1Ids = page1.data.map(
        (movie: { _id: string }) => movie._id
    );

    const page2Ids = page2.data.map(
        (movie: { _id: string }) => movie._id
    );

    expect(page1Ids.length).toBeGreaterThan(0);
    expect(page2Ids.length).toBeGreaterThan(0);

    const duplicatedIds = page1Ids.filter(
        (id: string) => page2Ids.includes(id)
    );

    expect(duplicatedIds).toHaveLength(0);
  });

  test('should return related movies with matching genres', async ({ request }) => {
    const listResponse = await request.get(
        '/api/v1/movies?page=1&limit=50'
    );

    expect(listResponse.status()).toBe(200);

    const listBody = await listResponse.json();

    const originalMovie = listBody.data.find(
        (movie: { genres?: string[] }) =>
        Array.isArray(movie.genres) && movie.genres.length > 0
    );

    expect(originalMovie).toBeTruthy();

    const relatedResponse = await request.get(
        `/api/v1/movies/${originalMovie._id}/related`
    );

    expect(relatedResponse.status()).toBe(200);

    const relatedBody = await relatedResponse.json();

    expect(relatedBody.success).toBe(true);
    expect(relatedBody.data.length).toBeLessThanOrEqual(10);

    for (const movie of relatedBody.data) {
        expect(movie._id).not.toBe(originalMovie._id);

        const hasMatchingGenre = movie.genres.some(
        (genre: string) => originalMovie.genres.includes(genre)
        );

        expect(hasMatchingGenre).toBe(true);
    }
  });

  test('should reject unknown query parameters', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?admin=true'
    );

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.success).toBe(false);
  });

  test('should reject excessively large page numbers', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?page=1000001'
    );

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.success).toBe(false);
  });

  test('should treat regex special characters as literal search text', async ({ request }) => {
    const response = await request.get('/api/v1/movies?search=.*');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  test('should safely handle an unmatched opening bracket in search', async ({ request }) => {
    const response = await request.get('/api/v1/movies?search=%5B');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('should not return all movies when searching for regex wildcard', async ({ request }) => {
    const response = await request.get('/api/v1/movies?search=%5E.%2A%24');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  test('should reject MongoDB operators in search query', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?search%5B%24ne%5D=null'
    );

    expect(response.status()).toBe(400);
  });

  test('should reject MongoDB operators in year query', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?year%5B%24gt%5D=1900'
    );

    expect(response.status()).toBe(400);
  });

  test('should treat JSON MongoDB operator payload as plain search text', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies?search=%7B%22%24ne%22%3Anull%7D'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

});

test.describe('ObjectId Validation & Resource Protection', () => {

  test('should return 400 for invalid movie ID', async ({ request }) => {
    const response = await request.get('/api/v1/movies/invalid-id');

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error.message).toBe('Invalid movie ID');
  });

  test('should return 404 for valid but non-existing movie ID', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies/000000000000000000000000'
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error.message).toBe('Movie not found');
  });

  test('should return 404 for non-existing movie details', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies/000000000000000000000000/details'
    );

    expect(response.status()).toBe(404);
  });

  test('should return 404 for non-existing related movies resource', async ({ request }) => {
    const response = await request.get(
      '/api/v1/movies/000000000000000000000000/related'
    );

    expect(response.status()).toBe(404);
  });

});
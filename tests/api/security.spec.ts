import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('should include security headers', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const headers = response.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');

    expect(headers['x-frame-options']).toBe('SAMEORIGIN');

    expect(headers['strict-transport-security']).toBeDefined();

    expect(headers['content-security-policy']).toBeDefined();

    expect(headers['referrer-policy']).toBe('no-referrer');

    expect(headers['x-powered-by']).toBeUndefined();
  });
});

test.describe('CORS', () => {
  test('should allow configured frontend origin', async ({ request }) => {
    const response = await request.get('/api/health', {
      headers: {
        Origin: 'http://localhost:4200',
      },
    });

    expect(response.status()).toBe(200);

    expect(
      response.headers()['access-control-allow-origin']
    ).toBe('http://localhost:4200');
  });

  test('should not allow an untrusted origin', async ({ request }) => {
    const response = await request.get('/api/health', {
      headers: {
        Origin: 'https://untrusted-example.com',
      },
    });

    expect(response.status()).toBe(200);

    expect(
      response.headers()['access-control-allow-origin']
    ).toBeUndefined();
  });

  test('should allow preflight requests from trusted origin', async ({
    request,
  }) => {
    const response = await request.fetch('/api/v1/movies', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:4200',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization',
      },
    });

    expect(response.status()).toBe(204);

    const headers = response.headers();

    expect(headers['access-control-allow-origin'])
      .toBe('http://localhost:4200');

    expect(headers['access-control-allow-methods'])
      .toContain('GET');

    expect(
      headers['access-control-allow-headers']?.toLowerCase()
    ).toContain('authorization');
  });


  test('should allow a second configured frontend origin', async ({ request }) => {
    const response = await request.get('/api/health', {
      headers: {
        Origin: 'https://example.com',
      },
    });

    expect(response.status()).toBe(200);

    expect(
      response.headers()['access-control-allow-origin'],
    ).toBe('https://example.com');
  });

  test('should reject an origin that is not configured', async ({ request }) => {
    const response = await request.get('/api/health', {
      headers: {
        Origin: 'https://untrusted-example.com',
      },
    });

    expect(response.status()).toBe(200);

    expect(
      response.headers()['access-control-allow-origin'],
    ).toBeUndefined();
  });
});


test.describe('Request Validation Security', () => {
  test('should reject malformed JSON with 400', async ({ request }) => {
    const response = await request.post('/api/v1/movies', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: '{"title":',
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error.message).toBe('Invalid JSON request body');
  });

  test('should reject oversized JSON body with 413', async ({ request }) => {
    const oversizedBody = {
      data: 'a'.repeat(1024 * 1024 + 1),
    };

    const response = await request.post('/api/v1/movies', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: oversizedBody,
    });

    expect(response.status()).toBe(413);
  });
});

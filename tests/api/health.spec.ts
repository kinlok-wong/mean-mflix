import { test, expect } from '@playwright/test';

test.describe('Health API', () => {

  test('should return API health status', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.message).toBe('Movie Explorer API is running');
    expect(body.data).toHaveProperty('environment');
    expect(body.data).toHaveProperty('timestamp');
  });

  test('should confirm database readiness', async ({ request }) => {
    const response = await request.get('/api/health/ready');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
  });

});
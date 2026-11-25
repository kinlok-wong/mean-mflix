
import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Authentication API - Registration', () => {

  test('should register a new user successfully', async ({ request }) => {
    const email = `test-${randomUUID()}@example.com`;

    const response = await request.post('/api/v1/auth/register', {
      data: {
        email,
        displayName: 'Test User',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data.user).toMatchObject({
      email,
      displayName: 'Test User',
    });

    expect(body.data.user).toHaveProperty('_id');
    expect(body.data.user).not.toHaveProperty('password');
    expect(body.data.user).not.toHaveProperty('passwordHash');
  });

  test('should reject an invalid email address', async ({ request }) => {
    const response = await request.post('/api/v1/auth/register', {
      data: {
        email: 'invalid-email',
        displayName: 'Test User',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

  test('should reject a password shorter than 12 characters', async ({ request }) => {
    const response = await request.post('/api/v1/auth/register', {
      data: {
        email: `test-${randomUUID()}@example.com`,
        displayName: 'Test User',
        password: 'Short123!',
        confirmPassword: 'Short123!',
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

  test('should reject mismatched passwords', async ({ request }) => {
    const response = await request.post('/api/v1/auth/register', {
      data: {
        email: `test-${randomUUID()}@example.com`,
        displayName: 'Test User',
        password: 'SecurePassword123!',
        confirmPassword: 'DifferentPassword123!',
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

  test('should reject duplicate email addresses', async ({ request }) => {
    const email = `duplicate-${randomUUID()}@example.com`;

    const userData = {
      email,
      displayName: 'Duplicate Test',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    };

    const firstResponse = await request.post('/api/v1/auth/register', {
      data: userData,
    });

    expect(firstResponse.status()).toBe(201);

    const secondResponse = await request.post('/api/v1/auth/register', {
      data: userData,
    });

    expect(secondResponse.status()).toBe(409);

    const body = await secondResponse.json();

    expect(body.success).toBe(false);
    expect(body.error.message).toBe('Email address is already registered');
  });

  test('should reject unexpected registration fields', async ({ request }) => {
    const response = await request.post('/api/v1/auth/register', {
      data: {
        email: `admin-${randomUUID()}@example.com`,
        displayName: 'Test Admin',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        isAdmin: true,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
  });

});

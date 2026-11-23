import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: 'list',

  timeout: 30000,

  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'line',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5000',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  webServer: {
    command: 'echo "Using existing server"',
    port: 5000,
    reuseExistingServer: true,
  },
});
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

// Path where storage state (auth cookies) will be saved
export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

// Ensure the storage state file exists on boot to prevent Playwright ENOENT errors
import * as fs from 'fs';
if (!fs.existsSync(STORAGE_STATE)) {
  const dir = path.dirname(STORAGE_STATE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORAGE_STATE, JSON.stringify({ cookies: [], origins: [] }, null, 2));
}

export default defineConfig({
  testDir: './tests',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'https://qa-tax-workpaper.cloudoffis.com.au',
    // Collect trace when retrying a failed test
    trace: 'on-first-retry',
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    // Record video on failure
    video: 'retain-on-failure',
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  projects: [
    // Global Authentication Setup project
    {
      name: 'setup',
      testMatch: /smoke\/auth\.setup\.ts/,
    },
    // Standard testing projects that run AFTER the setup project
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Load the cached storage state
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Load the cached storage state
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // Load the cached storage state
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    // Direct UI testing projects (e.g., testing the Login Page flow itself)
    // these should NOT load the cached storage state, because they test logging in
    {
      name: 'login-flow',
      testMatch: /smoke\/login\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    }
  ],
});

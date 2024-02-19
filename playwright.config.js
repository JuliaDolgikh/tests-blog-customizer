import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  retries: 3,
  testDir: './__tests__',
  outputDir: './tmp/artifacts',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    locale: 'ru-RU',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer: {
  //   command: 'cd ./blog-customizer && npm run start',
  //   url: 'http://127.0.0.1:8080',
  // },
});

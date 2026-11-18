const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.cjs',
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:8081',
    viewport: { width: 390, height: 844 },
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run web -- --localhost --port 8081 --max-workers 2',
    url: 'http://127.0.0.1:8081/status',
    reuseExistingServer: true,
    timeout: 120000,
    env: { CI: '0', BROWSER: 'none', EXPO_NO_TELEMETRY: '1', EXPO_OFFLINE: '1' },
  },
});

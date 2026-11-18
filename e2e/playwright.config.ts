import { defineConfig, devices } from '@playwright/test';

// The app is built and served with `vite preview`, so the tests run against
// the same files that get deployed (D-156).
const PORT = 4173;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: '.',
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${String(PORT)}`,
    trace: 'on-first-retry',
  },
  // Smoke tests (@humo) run on Chromium in every PR; the full suite runs on
  // Chromium and WebKit every night (D-77).
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `pnpm --filter "@lexis/web..." build && pnpm --filter @lexis/web preview --port ${String(PORT)} --strictPort`,
    url: `http://localhost:${String(PORT)}`,
    reuseExistingServer: !isCI,
  },
});

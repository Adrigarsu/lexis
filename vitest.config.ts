import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // A package joins the test run when it has its own vitest.config.ts.
    projects: ['apps/*/vitest.config.ts', 'packages/*/vitest.config.ts'],
  },
});

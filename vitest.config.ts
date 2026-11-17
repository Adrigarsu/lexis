import { defineConfig } from 'vitest/config';

// D-75: at least 80 % in the core logic: lib/, db/, sync/ and the hooks (ADR-018).
const COVERED = {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
};
const CORE_LOGIC = [
  'apps/web/src/lib/**',
  'apps/web/src/db/**',
  'apps/web/src/sync/**',
  'apps/web/src/**/use[A-Z]*.{ts,tsx}',
];

export default defineConfig({
  test: {
    // A package joins the test run when it has its own vitest.config.ts.
    projects: ['apps/*/vitest.config.ts', 'packages/*/vitest.config.ts'],
    coverage: {
      provider: 'v8',
      include: CORE_LOGIC,
      exclude: ['**/*.test.{ts,tsx}'],
      thresholds: Object.fromEntries(CORE_LOGIC.map((glob) => [glob, COVERED])),
    },
  },
});

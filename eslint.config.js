import lexis from '@lexis/config/eslint.config.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores([
    '**/dist/',
    '**/coverage/',
    'docs/diseno/pantallas/assets/',
    'e2e/test-results/',
    'e2e/playwright-report/',
    'e2e/blob-report/',
  ]),
  lexis,
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
);

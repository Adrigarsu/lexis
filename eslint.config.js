import lexis from '@lexis/config/eslint.config.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores(['**/dist/', '**/coverage/', 'docs/diseno/pantallas/assets/']),
  lexis,
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
);

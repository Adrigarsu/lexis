import lexis from '@lexis/config/stylelint.config.js';

export default {
  ...lexis,
  // Design exports keep their own colors; dist/ holds the generated tokens.
  ignoreFiles: [
    '**/dist/**',
    '**/coverage/**',
    'docs/diseno/**',
    'e2e/playwright-report/**',
  ],
};

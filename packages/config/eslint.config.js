// Shared ESLint flat config for the Lexis monorepo (D-152, ADR-025).
// The consumer adds `tsconfigRootDir` so typed rules find each package's tsconfig.
import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import prettier from 'eslint-config-prettier';
import i18next from 'eslint-plugin-i18next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { hardCodedColorRule } from './colors.js';

const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
const JS_FILES = ['**/*.{js,mjs,cjs}'];
const REACT_FILES = ['**/*.{jsx,tsx}'];

const reactHooksRecommended = reactHooks.configs.flat['recommended-latest'];
const eslintReactRecommended = eslintReact.configs['recommended-typescript'];

// @eslint-react ships its own copy of the hooks rules. The official react-hooks
// plugin owns them, so the copies are turned off to avoid reporting twice.
const hookRuleNames = new Set(
  Object.keys(reactHooksRecommended.rules ?? {}).map((name) =>
    name.replace('react-hooks/', ''),
  ),
);
const duplicatedHookRules = Object.fromEntries(
  Object.keys(eslintReactRecommended.rules ?? {})
    .filter((name) => hookRuleNames.has(name.replace('@eslint-react/', '')))
    .map((name) => [name, 'off']),
);

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },
  {
    // Config files and scripts run in Node and are not part of any tsconfig.
    files: JS_FILES,
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  {
    // Hooks can live in .ts files too (useDueCards.ts).
    files: TS_FILES,
    extends: [reactHooksRecommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: REACT_FILES,
    extends: [eslintReactRecommended, jsxA11y.flatConfigs.recommended],
    rules: duplicatedHookRules,
  },
  {
    // App code takes colors only from the tokens (ADR-010). Tests may name
    // the colors they expect.
    files: ['apps/*/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-syntax': hardCodedColorRule },
  },
  {
    // RNF-33: every interface text comes from the translation files (D-169, ADR-028).
    // jsx-only checks JSX text and the visible attributes (aria-label, title…).
    files: REACT_FILES,
    ignores: ['**/*.test.{jsx,tsx}', '**/test/**'],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': ['error', { mode: 'jsx-only' }],
    },
  },
  // Last, so it turns off every rule that would fight with Prettier.
  prettier,
);

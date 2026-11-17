// Shared Prettier config for the Lexis monorepo (D-152, ADR-025).
// Prettier defaults plus single quotes, the style the code already uses.

/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
};

export default config;

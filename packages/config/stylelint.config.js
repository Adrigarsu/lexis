// Shared Stylelint config for the Lexis monorepo (ADR-010).
// CSS uses only the Lexis tokens: no hex, no color functions, no named colors.
// The tokens themselves are generated into dist/, which is not linted.
export default {
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
    ],
  },
};

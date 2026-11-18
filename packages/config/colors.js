// Colors come only from the Lexis tokens (ADR-010). This rule catches
// hand-written colors in TS/TSX string literals, such as a Tailwind arbitrary
// value `bg-[#123456]` or an inline style `rgba(0, 0, 0, 0.5)`.
const COLOR = String.raw`/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/`;
const MESSAGE =
  'Use a Lexis color token (bg-jade, var(--lx-ink)) instead of a hand-written color.';

/** @type {import('eslint').Linter.RuleEntry} */
export const hardCodedColorRule = [
  'error',
  { selector: `Literal[value=${COLOR}]`, message: MESSAGE },
  { selector: `TemplateElement[value.raw=${COLOR}]`, message: MESSAGE },
];

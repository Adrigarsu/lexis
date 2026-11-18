import type { ThemedValue, Token, Tokens } from './tokens.ts';

type Theme = 'light' | 'dark';

const PREFIX = '--lx-';
const ROOT_FONT_SIZE_PX = 16;
const ALIAS = /^\{(.+)\}$/;

/** `16px` → `1rem`, so type follows the user's text size (RNF-23). */
function toRem(value: string): string {
  const px = /^(\d+(?:\.\d+)?)px$/.exec(value);
  return px ? `${String(Number(px[1]) / ROOT_FONT_SIZE_PX)}rem` : value;
}

function resolve(value: ThemedValue, theme: Theme, colors: Token[]): string {
  if (typeof value !== 'string') return value[theme];
  const alias = ALIAS.exec(value);
  if (!alias) return value;
  const target = colors.find((token) => token.name === alias[1]);
  if (!target) throw new Error(`Unknown token alias ${value}`);
  return resolve(target.value, theme, colors);
}

function declarations(entries: [string, string][]): string {
  return entries.map(([name, value]) => `  ${name}: ${value};\n`).join('');
}

/** Tokens whose value changes between the light and the dark theme. */
function themed(tokens: Tokens, theme: Theme): [string, string][] {
  const colors = tokens.color.tokens;
  return [...colors, ...tokens.shadow.tokens].map((token) => [
    `${PREFIX}${token.name}`,
    resolve(token.value, theme, colors),
  ]);
}

/** Tokens that are the same in both themes. */
function shared(tokens: Tokens): [string, string][] {
  const plain = [
    ...tokens.spacing.tokens,
    ...tokens.radius.tokens,
    ...tokens.border.tokens,
    ...tokens.size.tokens,
  ].map((token): [string, string] => [
    `${PREFIX}${token.name}`,
    resolve(token.value, 'light', tokens.color.tokens),
  ]);
  const fonts = Object.entries(tokens.type.families).map(
    ([family, stack]): [string, string] => [`${PREFIX}font-${family}`, stack],
  );
  return [...plain, ...fonts];
}

/**
 * CSS variables for both themes. The system theme applies unless the user
 * picks one, which sets `data-theme` on `<html>` (D-100).
 */
export function buildTokensCss(tokens: Tokens): string {
  const light = declarations([
    ['color-scheme', 'light'],
    ...themed(tokens, 'light'),
    ...shared(tokens),
  ]);
  const dark = declarations([
    ['color-scheme', 'dark'],
    ...themed(tokens, 'dark'),
  ]);
  return [
    '/* Generated from docs/diseno/tokens.json by @lexis/design-tokens. Do not edit. */',
    `:root,\n[data-theme="light"] {\n${light}}`,
    `[data-theme="dark"] {\n${dark}}`,
    `@media (prefers-color-scheme: dark) {\n:root:not([data-theme="light"]) {\n${dark}}\n}`,
    '',
  ].join('\n\n');
}

/** Drops a token's group prefix: `radius-md` → `md`, `bp-tablet` → `tablet`. */
function shortName(token: Token, prefix: string): string {
  return token.name.startsWith(prefix)
    ? token.name.slice(prefix.length)
    : token.name;
}

/**
 * Tailwind CSS v4 theme. Every value points to a Lexis variable, and the
 * default palette is removed so only token colors exist (ADR-010).
 */
export function buildThemeCss(tokens: Tokens): string {
  const variable = (token: Token) => `var(${PREFIX}${token.name})`;
  const entries: [string, string][] = [
    ['--color-*', 'initial'],
    ...tokens.color.tokens.map((token): [string, string] => [
      `--color-${token.name}`,
      variable(token),
    ]),
    ['--font-*', 'initial'],
    ...Object.keys(tokens.type.families).map((family): [string, string] => [
      `--font-${family}`,
      `var(${PREFIX}font-${family})`,
    ]),
    ['--text-*', 'initial'],
    ...tokens.type.groups
      .flatMap((group) => group.styles)
      .flatMap((style): [string, string][] => [
        [`--text-${style.name}`, toRem(style.fontSize)],
        [`--text-${style.name}--line-height`, toRem(style.lineHeight)],
        [`--text-${style.name}--font-weight`, String(style.fontWeight)],
      ]),
    ['--radius-*', 'initial'],
    ...tokens.radius.tokens.map((token): [string, string] => [
      `--radius-${shortName(token, 'radius-')}`,
      variable(token),
    ]),
    ['--shadow-*', 'initial'],
    ...tokens.shadow.tokens.map((token): [string, string] => [
      `--shadow-${token.name}`,
      variable(token),
    ]),
    ['--breakpoint-*', 'initial'],
    ...tokens.breakpoint.tokens.map((token): [string, string] => [
      `--breakpoint-${shortName(token, 'bp-')}`,
      toRem(resolve(token.value, 'light', tokens.color.tokens)),
    ]),
    ...tokens.size.tokens.map((token): [string, string] => [
      `--spacing-${token.name}`,
      variable(token),
    ]),
  ];
  return [
    '/* Generated from docs/diseno/tokens.json by @lexis/design-tokens. Do not edit. */',
    `@theme inline {\n${declarations(entries)}}`,
    '',
  ].join('\n\n');
}

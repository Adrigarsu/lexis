import { readFileSync } from 'node:fs';

/** A value that is the same in both themes, or one per theme. */
export type ThemedValue = string | { light: string; dark: string };

export interface Token {
  name: string;
  /** A literal, a per-theme pair, or an alias such as `{jade}`. */
  value: ThemedValue;
  usage?: string;
}

export interface TypeStyle {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
}

export interface Tokens {
  color: { tokens: Token[] };
  type: {
    families: Record<string, string>;
    groups: { name: string; family: string; styles: TypeStyle[] }[];
  };
  spacing: { tokens: Token[] };
  radius: { tokens: Token[] };
  shadow: { tokens: Token[] };
  size: { tokens: Token[] };
  breakpoint: { tokens: Token[] };
  border: { tokens: Token[] };
}

/** The design system export is the single source of truth (ADR-010). */
export const TOKENS_URL = new URL(
  '../../../docs/diseno/tokens.json',
  import.meta.url,
);

export function readTokens(url: URL = TOKENS_URL): Tokens {
  return JSON.parse(readFileSync(url, 'utf8')) as Tokens;
}

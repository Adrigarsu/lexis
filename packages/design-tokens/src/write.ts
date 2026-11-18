import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildThemeCss, buildTokensCss } from './build.ts';
import { readTokens } from './tokens.ts';

/** Writes `tokens.css` and `theme.css`, the two files the package exports. */
export function writeCss(outDir: string): void {
  const tokens = readTokens();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'tokens.css'), buildTokensCss(tokens));
  writeFileSync(join(outDir, 'theme.css'), buildThemeCss(tokens));
}

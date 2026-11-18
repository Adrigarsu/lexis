import { describe, expect, it } from 'vitest';
import { buildThemeCss, buildTokensCss } from './build.ts';
import { readTokens } from './tokens.ts';

const tokens = readTokens();

/** Returns the declarations inside the first block whose selector matches. */
function block(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No block for ${selector}`);
  const open = css.indexOf('{', start) + 1;
  return css.slice(open, css.indexOf('}', open));
}

describe('buildTokensCss', () => {
  const css = buildTokensCss(tokens);

  it('HU-76 builds light and dark CSS variables from tokens.json', () => {
    const light = block(css, ':root,\n[data-theme="light"]');
    const dark = block(css, '[data-theme="dark"]');
    const systemDark = block(css, ':root:not([data-theme="light"])');

    expect(light).toContain('--lx-paper: #F7F4EE;');
    expect(light).toContain('--lx-ink: #1F1E1C;');
    expect(dark).toContain('--lx-paper: #1A1917;');
    expect(dark).toContain('--lx-ink: #EDE9E2;');
    expect(systemDark).toBe(dark);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });

  it('HU-76 resolves aliases to the token they point to', () => {
    expect(block(css, ':root,\n[data-theme="light"]')).toContain(
      '--lx-success: #0E7C6B;',
    );
    expect(block(css, '[data-theme="dark"]')).toContain(
      '--lx-success: #86C9BC;',
    );
  });

  it('HU-76 keeps theme-independent tokens in the root block', () => {
    const root = block(css, ':root,\n[data-theme="light"]');

    expect(root).toContain('--lx-space-4: 16px;');
    expect(root).toContain('--lx-radius-md: 8px;');
    expect(root).toContain('--lx-border-selected: 2px;');
    expect(root).toContain('--lx-touch-min: 44px;');
    expect(root).toContain('--lx-font-kai: "LXGW WenKai"');
    expect(root).toContain(
      '--lx-focus-ring: 0 0 0 2px #FFFDF9, 0 0 0 4px #14967F;',
    );
  });
});

describe('buildThemeCss', () => {
  const css = buildThemeCss(tokens);

  it('HU-76 builds the Tailwind v4 theme', () => {
    const theme = block(css, '@theme inline');

    // Only Lexis colors exist: the default palette is removed.
    expect(theme).toContain('--color-*: initial;');
    expect(theme).toContain('--color-paper: var(--lx-paper);');
    expect(theme).toContain('--color-tone-1: var(--lx-tone-1);');
    expect(theme).toContain('--font-sans: var(--lx-font-sans);');
    expect(theme).toContain('--font-kai: var(--lx-font-kai);');
    expect(theme).toContain('--radius-md: var(--lx-radius-md);');
    expect(theme).toContain('--shadow-focus-ring: var(--lx-focus-ring);');
    expect(theme).toContain('--breakpoint-*: initial;');
    expect(theme).toContain('--breakpoint-desktop: 64rem;');
    expect(theme).toContain('--spacing-touch-min: var(--lx-touch-min);');
  });

  it('HU-76 builds the type scale in rem so text can grow to 200 %', () => {
    const theme = block(css, '@theme inline');

    expect(theme).toContain('--text-title-1: 1.75rem;');
    expect(theme).toContain('--text-title-1--line-height: 2.125rem;');
    expect(theme).toContain('--text-title-1--font-weight: 700;');
    expect(theme).toContain('--text-hanzi-hero: 6rem;');
    expect(theme).toContain('--text-hanzi-hero--line-height: 1.1;');
  });
});

import { ESLint } from 'eslint';
import stylelint from 'stylelint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import { hardCodedColorRule } from '../colors.js';
import stylelintConfig from '../stylelint.config.js';

async function cssProblems(code: string): Promise<number> {
  const { results } = await stylelint.lint({ code, config: stylelintConfig });
  return results[0]?.warnings.length ?? 0;
}

async function tsxProblems(code: string): Promise<number> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: {
      files: ['**/*.tsx'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      rules: { 'no-restricted-syntax': hardCodedColorRule },
    },
  });
  const [result] = await eslint.lintText(code, { filePath: 'Card.tsx' });
  return result?.errorCount ?? 0;
}

describe('hand-written colors', () => {
  it('HU-76 flags a hand-written color in CSS', async () => {
    expect(await cssProblems('.card { color: #1f1e1c; }')).toBe(1);
    expect(await cssProblems('.card { color: rgb(31 30 28); }')).toBe(1);
    expect(await cssProblems('.card { color: black; }')).toBe(1);
  });

  it('HU-76 accepts colors from the tokens in CSS', async () => {
    expect(await cssProblems('.card { color: var(--lx-ink); }')).toBe(0);
  });

  it('HU-76 flags a hand-written color in TSX', async () => {
    expect(
      await tsxProblems(
        'export const A = () => <p className="bg-[#123456]" />;',
      ),
    ).toBe(1);
    expect(
      await tsxProblems("export const s = { color: 'rgba(0, 0, 0, 0.5)' };"),
    ).toBe(1);
  });

  it('HU-76 accepts colors from the tokens in TSX', async () => {
    expect(
      await tsxProblems('export const A = () => <p className="bg-jade" />;'),
    ).toBe(0);
  });
});

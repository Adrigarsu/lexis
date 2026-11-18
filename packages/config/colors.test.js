import { ESLint } from 'eslint';
import stylelint from 'stylelint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import lexis from './eslint.config.js';
import stylelintConfig from './stylelint.config.js';

// The shared config, without the typed rules: the snippets below belong to no tsconfig.
const eslint = new ESLint({
  cwd: import.meta.dirname,
  overrideConfigFile: true,
  overrideConfig: [...lexis, tseslint.configs.disableTypeChecked],
});

/** @param {string} code */
async function cssProblems(code) {
  const { results } = await stylelint.lint({ code, config: stylelintConfig });
  return results[0]?.warnings.length ?? 0;
}

/** @param {string} code */
async function colorProblems(code) {
  const [result] = await eslint.lintText(code, {
    filePath: 'apps/web/src/Card.tsx',
  });
  return (result?.messages ?? []).filter(
    (message) => message.ruleId === 'no-restricted-syntax',
  ).length;
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
      await colorProblems(
        'export const A = () => <p className="bg-[#123456]" />;',
      ),
    ).toBe(1);
    expect(
      await colorProblems("export const s = { color: 'rgba(0, 0, 0, 0.5)' };"),
    ).toBe(1);
  });

  it('HU-76 accepts colors from the tokens in TSX', async () => {
    expect(
      await colorProblems('export const A = () => <p className="bg-jade" />;'),
    ).toBe(0);
  });
});

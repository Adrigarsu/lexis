import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import lexis from './eslint.config.js';

// The shared config, without the typed rules: the snippets below belong to no tsconfig.
const eslint = new ESLint({
  cwd: import.meta.dirname,
  overrideConfigFile: true,
  overrideConfig: [...lexis, tseslint.configs.disableTypeChecked],
});

/** @param {string} code */
async function lintComponent(code) {
  const [result] = await eslint.lintText(code, { filePath: 'Component.tsx' });
  return result?.messages ?? [];
}

const RULE = 'i18next/no-literal-string';

describe('shared ESLint config', () => {
  it('HU-79 lint flags a hardcoded text in JSX', async () => {
    const messages = await lintComponent(
      'export function Greeting() {\n  return <p>Hola</p>;\n}\n',
    );

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: RULE, severity: 2 }),
    );
  });

  it('HU-79 lint flags a hardcoded aria-label', async () => {
    const messages = await lintComponent(
      'export function Close() {\n  return <button type="button" aria-label="Cerrar" />;\n}\n',
    );

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: RULE, severity: 2 }),
    );
  });

  it('HU-79 lint accepts text from t()', async () => {
    const messages = await lintComponent(
      [
        "import { useTranslation } from 'react-i18next';",
        '',
        'export function Title() {',
        '  const { t } = useTranslation();',
        '  return <h1 className="title">{t(\'app.name\')}</h1>;',
        '}',
        '',
      ].join('\n'),
    );

    expect(messages).toEqual([]);
  });
});

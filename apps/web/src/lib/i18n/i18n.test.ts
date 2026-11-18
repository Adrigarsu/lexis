import { describe, expect, it } from 'vitest';
import { i18n } from '.';
import es from './locales/es.json';

// Flattens { app: { name: 'Lexis' } } into ['app.name'].
function leafKeys(node: object, prefix = ''): string[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? leafKeys(value as object, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe('i18n', () => {
  it('HU-79 uses Spanish as the only language', () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBe('es');
    expect(i18n.t('app.name')).toBe(es.app.name);
  });

  it('HU-79 groups translation keys by module', () => {
    const keys = leafKeys(es);

    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      // module.text, in camelCase, with an optional plural suffix (_one, _other).
      expect(key).toMatch(
        /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+(_[a-z]+)?$/,
      );
    }
  });
});

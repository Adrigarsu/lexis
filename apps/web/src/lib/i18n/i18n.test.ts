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

  describe('formatting with Intl', () => {
    // Test-only texts, so no interface text is invented for this story.
    const TEST_NS = 'formatTest';
    const t = i18n.getFixedT(null, TEST_NS);
    i18n.addResourceBundle('es', TEST_NS, {
      amount: '{{value, number}}',
      day: '{{value, datetime(dateStyle: long)}}',
      cards_one: '{{count}} tarjeta',
      cards_other: '{{count}} tarjetas',
    });

    it('HU-79 formats numbers in Spanish', () => {
      expect(t('amount', { value: 12345.5 })).toBe('12.345,5');
      // Spanish does not group four-digit numbers.
      expect(t('amount', { value: 1234 })).toBe('1234');
    });

    it('HU-79 formats dates in Spanish', () => {
      expect(t('day', { value: new Date(2026, 10, 18) })).toBe(
        '18 de noviembre de 2026',
      );
    });

    it('HU-79 picks the Spanish plural form', () => {
      expect(t('cards', { count: 1 })).toBe('1 tarjeta');
      expect(t('cards', { count: 0 })).toBe('0 tarjetas');
      expect(t('cards', { count: 5 })).toBe('5 tarjetas');
    });
  });
});

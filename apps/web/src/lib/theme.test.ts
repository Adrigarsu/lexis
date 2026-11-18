import { beforeEach, describe, expect, it } from 'vitest';
import {
  THEME_KEY,
  applyTheme,
  readThemePreference,
  saveThemePreference,
} from './theme';

describe('theme preference', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('HU-76 follows the system when nothing is saved', () => {
    expect(readThemePreference(localStorage)).toBe('system');
  });

  it('HU-76 reads the saved theme', () => {
    localStorage.setItem(THEME_KEY, 'dark');

    expect(readThemePreference(localStorage)).toBe('dark');
  });

  it('HU-76 falls back to the system for an unknown value', () => {
    localStorage.setItem(THEME_KEY, 'sepia');

    expect(readThemePreference(localStorage)).toBe('system');
  });

  it('HU-76 saves the chosen theme', () => {
    saveThemePreference(localStorage, 'light');

    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });

  it('HU-76 marks the page with a chosen theme', () => {
    applyTheme(document.documentElement, 'dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('HU-76 removes the mark to follow the system again', () => {
    applyTheme(document.documentElement, 'dark');

    applyTheme(document.documentElement, 'system');

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});

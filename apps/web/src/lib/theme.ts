/** `system` follows the operating system and is the default (D-100). */
export type ThemePreference = 'system' | 'light' | 'dark';

/** Also read by the inline script in index.html, so keep both in sync. */
export const THEME_KEY = 'lexis.theme';

const PREFERENCES: readonly string[] = ['system', 'light', 'dark'];

function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && PREFERENCES.includes(value);
}

export function readThemePreference(storage: Storage): ThemePreference {
  const saved = storage.getItem(THEME_KEY);
  return isThemePreference(saved) ? saved : 'system';
}

export function saveThemePreference(
  storage: Storage,
  preference: ThemePreference,
): void {
  storage.setItem(THEME_KEY, preference);
}

/**
 * A chosen theme sets `data-theme` on `<html>`; without it, the CSS follows
 * `prefers-color-scheme`, so system changes apply without reloading.
 */
export function applyTheme(
  root: HTMLElement,
  preference: ThemePreference,
): void {
  if (preference === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.dataset.theme = preference;
  }
}

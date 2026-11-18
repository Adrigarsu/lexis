/* eslint-disable @typescript-eslint/no-unused-vars -- empty stubs until the green step */
export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_KEY = 'lexis.theme';

export function readThemePreference(storage: Storage): ThemePreference {
  return 'light';
}

export function saveThemePreference(
  storage: Storage,
  preference: ThemePreference,
): void {
  return;
}

export function applyTheme(
  root: HTMLElement,
  preference: ThemePreference,
): void {
  return;
}

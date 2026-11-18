import { useCallback, useState } from 'react';
import {
  applyTheme,
  readThemePreference,
  saveThemePreference,
  type ThemePreference,
} from '../lib/theme';

/** The theme preference, for the Appearance setting in Profile (D-100). */
export function useTheme(): {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
} {
  const [preference, setState] = useState(() =>
    readThemePreference(localStorage),
  );

  const setPreference = useCallback((next: ThemePreference) => {
    saveThemePreference(localStorage, next);
    applyTheme(document.documentElement, next);
    setState(next);
  }, []);

  return { preference, setPreference };
}

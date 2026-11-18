/* eslint-disable @typescript-eslint/no-unused-vars -- empty stub until the green step */
import type { ThemePreference } from '../lib/theme';

export function useTheme(): {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
} {
  return { preference: 'system', setPreference: (preference) => undefined };
}

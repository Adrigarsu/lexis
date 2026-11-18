import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { THEME_KEY } from '../lib/theme';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('HU-76 starts from the saved preference', () => {
    localStorage.setItem(THEME_KEY, 'light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe('light');
  });

  it('HU-76 applies and remembers the theme the user picks', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setPreference('dark');
    });

    expect(result.current.preference).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
  });
});

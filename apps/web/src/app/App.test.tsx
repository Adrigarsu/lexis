import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { App } from './App';

// The translations are swapped so the test fails if the text is written in the component.
vi.mock('../lib/i18n/locales/es.json', () => ({
  default: { app: { name: 'Lexis (test)' } },
}));

describe('App', () => {
  it('HU-79 renders the app name from es.json', async () => {
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Lexis (test)' }),
    ).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

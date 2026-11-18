import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { i18n } from '../lib/i18n';
import es from '../lib/i18n/locales/es.json';
import { expectNoAxeViolations } from '../test/axe';
import { App } from './App';

describe('App', () => {
  afterEach(() => {
    i18n.addResource('es', 'translation', 'app.name', es.app.name);
  });

  it('HU-79 renders the app name from es.json', async () => {
    // The translation is swapped so the test fails if the text is written in the component.
    i18n.addResource('es', 'translation', 'app.name', 'Lexis (test)');
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Lexis (test)' }),
    ).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

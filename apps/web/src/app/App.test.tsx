import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { App } from './App';

// Infrastructure smoke test: it belongs to no user story, so it has no HU ID (D-157).
describe('App', () => {
  it('renders the app shell without axe violations', async () => {
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Lexis' }),
    ).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from './axe';

function mount(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);
  return container;
}

describe('expectNoAxeViolations', () => {
  it('passes when the markup has no violations', async () => {
    const container = mount('<img src="logo.png" alt="Lexis" />');

    await expect(expectNoAxeViolations(container)).resolves.toBeUndefined();
  });

  it('fails and names the rule when the markup has a violation', async () => {
    const container = mount('<img src="logo.png" />');

    await expect(expectNoAxeViolations(container)).rejects.toThrow('image-alt');
  });

  it('skips color-contrast, which jsdom cannot measure', async () => {
    const container = mount(
      '<p style="color: #fff; background: #fff">Lexis</p>',
    );

    await expect(expectNoAxeViolations(container)).resolves.toBeUndefined();
  });
});

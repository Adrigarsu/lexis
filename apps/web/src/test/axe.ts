import axe from 'axe-core';

/**
 * Runs axe on `container` and fails with the rule IDs and nodes it finds.
 *
 * jsdom computes no layout or styles, so axe reports color-contrast as
 * incomplete, never as a violation. Playwright + axe and Lighthouse check
 * contrast in a real browser (D-157).
 */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const { violations } = await axe.run(container);

  if (violations.length > 0) {
    const report = violations
      .map(
        ({ id, help, nodes }) =>
          `${id}: ${help}\n${nodes.map(({ html }) => `  ${html}`).join('\n')}`,
      )
      .join('\n\n');
    throw new Error(`Expected no axe violations, found:\n\n${report}`);
  }
}

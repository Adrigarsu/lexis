import { expect, test } from '@playwright/test';

test(
  'HU-76 paints the page with the paper and ink tokens',
  { tag: '@humo' },
  async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const body = page.locator('body');
    // paper #F7F4EE and ink #1F1E1C (D-104).
    await expect(body).toHaveCSS('background-color', 'rgb(247, 244, 238)');
    await expect(body).toHaveCSS('color', 'rgb(31, 30, 28)');
  },
);

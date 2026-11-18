import { expect, test } from '@playwright/test';

// paper in each theme (D-104).
const LIGHT_PAPER = 'rgb(247, 244, 238)';
const DARK_PAPER = 'rgb(26, 25, 23)';
const THEME_KEY = 'lexis.theme';

test(
  'HU-76 follows the system theme without reloading',
  { tag: '@humo' },
  async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', LIGHT_PAPER);

    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(body).toHaveCSS('background-color', DARK_PAPER);
  },
);

test(
  'HU-76 keeps the chosen theme over the system one',
  { tag: '@humo' },
  async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.evaluate((key) => {
      localStorage.setItem(key, 'dark');
    }, THEME_KEY);
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      DARK_PAPER,
    );
  },
);

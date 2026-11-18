import { expect, test } from '@playwright/test';

// The four families and a sample each one must render (D-106).
const FAMILIES: [family: string, sample: string][] = [
  ['Inter', 'Lexis'],
  ['Noto Sans SC', '学'],
  ['Noto Serif SC', '学'],
  ['LXGW WenKai', '学'],
];

test(
  'HU-76 loads every font from the app itself',
  { tag: '@humo' },
  async ({ page, baseURL }) => {
    const appOrigin = new URL(baseURL ?? '').origin;
    const fontOrigins = new Set<string>();
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const origin = new URL(request.url()).origin;
      if (request.resourceType() === 'font') fontOrigins.add(origin);
      if (origin !== appOrigin) externalRequests.push(request.url());
    });

    await page.goto('/');
    const loadedFaces = await page.evaluate(async (families) => {
      const counts: Record<string, number> = {};
      for (const [family, sample] of families) {
        const faces = await document.fonts.load(`16px "${family}"`, sample);
        counts[family] = faces.length;
      }
      return counts;
    }, FAMILIES);

    for (const [family] of FAMILIES) {
      expect(loadedFaces[family], family).toBeGreaterThan(0);
    }
    expect([...fontOrigins]).toEqual([appOrigin]);
    expect(externalRequests).toEqual([]);
  },
);

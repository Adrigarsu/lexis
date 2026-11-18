// Node, not jsdom: the WOFF2 tools need Node's own typed arrays.
// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { charactersOf, subsetTo, verifyChecksum } from './lib';

const wenkai = readFileSync(
  join(import.meta.dirname, '../../src/assets/fonts/lxgw-wenkai-lexis.woff2'),
);

describe('font subsetting', () => {
  it('HU-76 reads the course characters from the WenKai subset', () => {
    const characters = charactersOf(wenkai);

    expect(characters).toContain('学');
    expect(characters.length).toBeGreaterThan(100);
  });

  it('HU-76 keeps only the given characters in a subset', async () => {
    const subset = await subsetTo(wenkai, '学习');

    const characters = charactersOf(subset);
    expect(characters).toHaveLength(2);
    expect(characters).toContain('学');
    expect(characters).toContain('习');
    expect(subset.length).toBeLessThan(wenkai.length);
  });

  it('HU-76 accepts a download with the expected checksum', () => {
    const data = Buffer.from('lexis');
    const sha256 =
      '8dec98d96b81a2b501b48aa39968146c458841ae53d8601d23fd3b571d09032f';

    expect(() => {
      verifyChecksum(data, sha256);
    }).not.toThrow();
  });

  it('HU-76 rejects a download with another checksum', () => {
    expect(() => {
      verifyChecksum(Buffer.from('lexis'), '0'.repeat(64));
    }).toThrow(/checksum/i);
  });
});

import { createHash } from 'node:crypto';
import { create } from 'fontkit';
import subsetFont from 'subset-font';

/** Every character the font can draw, as one string. */
export function charactersOf(font: Buffer): string {
  const parsed = create(font);
  if (!('characterSet' in parsed)) {
    throw new Error('Expected a single font, not a collection');
  }
  return String.fromCodePoint(...parsed.characterSet);
}

/** A WOFF2 font with only the given characters. */
export async function subsetTo(
  font: Buffer,
  characters: string,
): Promise<Buffer> {
  return subsetFont(font, characters, { targetFormat: 'woff2' });
}

/** Stops a build from using a font that is not the pinned release. */
export function verifyChecksum(data: Buffer, sha256: string): void {
  const actual = createHash('sha256').update(data).digest('hex');
  if (actual !== sha256) {
    throw new Error(
      `Font checksum mismatch: expected ${sha256}, got ${actual}`,
    );
  }
}

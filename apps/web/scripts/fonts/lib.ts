/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/require-await -- empty stubs until the green step */
export function charactersOf(font: Buffer): string {
  return '';
}

export async function subsetTo(
  font: Buffer,
  characters: string,
): Promise<Buffer> {
  return Buffer.alloc(0);
}

export function verifyChecksum(data: Buffer, sha256: string): void {
  return;
}

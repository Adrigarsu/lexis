// Builds the Noto subsets in src/assets/fonts with the characters of the
// LXGW WenKai subset, so every Chinese font weighs only what the course uses
// (D-106). Run it with `pnpm fonts:subset` when the course characters change.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { charactersOf, subsetTo, verifyChecksum } from './fonts/lib.ts';

const NOTO_CJK = 'https://raw.githubusercontent.com/notofonts/noto-cjk';
const FONTS_DIR = join(import.meta.dirname, '../src/assets/fonts');
const CACHE_DIR = join(tmpdir(), 'lexis-fonts');

// Pinned releases of notofonts/noto-cjk, checked by SHA-256.
const SOURCES = [
  {
    output: 'noto-sans-sc-400.woff2',
    path: 'Sans2.004/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf',
    sha256: 'faa6c9df652116dde789d351359f3d7e5d2285a2b2a1f04a2d7244df706d5ea9',
  },
  {
    output: 'noto-sans-sc-700.woff2',
    path: 'Sans2.004/Sans/SubsetOTF/SC/NotoSansSC-Bold.otf',
    sha256: 'c6cb5a93abaa9edc8ee7463b7ebb7f42d618d40e6ed2f7a5371c97b0b64767c0',
  },
  {
    output: 'noto-serif-sc-400.woff2',
    path: 'Serif2.003/Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf',
    sha256: 'e8f396decc1f0963a016a989c3d8852e863d1350996f573860a80767c83a1cd3',
  },
];

async function download(path: string): Promise<Buffer> {
  const cached = join(CACHE_DIR, path.replaceAll('/', '_'));
  if (existsSync(cached)) return readFileSync(cached);
  const response = await fetch(`${NOTO_CJK}/${path}`);
  if (!response.ok) {
    throw new Error(`Download failed (${String(response.status)}): ${path}`);
  }
  const data = Buffer.from(await response.arrayBuffer());
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cached, data);
  return data;
}

const characters = charactersOf(
  readFileSync(join(FONTS_DIR, 'lxgw-wenkai-lexis.woff2')),
);

for (const source of SOURCES) {
  const font = await download(source.path);
  verifyChecksum(font, source.sha256);
  const subset = await subsetTo(font, characters);
  writeFileSync(join(FONTS_DIR, source.output), subset);
  console.log(
    `${source.output}: ${String(Math.round(subset.length / 1024))} KB`,
  );
}

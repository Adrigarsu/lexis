import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeCss } from './write.ts';

describe('writeCss', () => {
  it('HU-76 writes tokens.css and theme.css to the output folder', () => {
    const outDir = join(mkdtempSync(join(tmpdir(), 'lexis-tokens-')), 'dist');

    writeCss(outDir);

    expect(readFileSync(join(outDir, 'tokens.css'), 'utf8')).toContain(
      '--lx-paper: #F7F4EE;',
    );
    expect(readFileSync(join(outDir, 'theme.css'), 'utf8')).toContain(
      '@theme inline',
    );
  });
});

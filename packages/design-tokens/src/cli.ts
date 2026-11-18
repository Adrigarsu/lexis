import { fileURLToPath } from 'node:url';
import { writeCss } from './write.ts';

writeCss(fileURLToPath(new URL('../dist', import.meta.url)));

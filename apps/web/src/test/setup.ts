import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no canvas: axe-core probes it for icon fonts and jsdom logs
// "Not implemented" on every run. Returning null is what axe expects then.
HTMLCanvasElement.prototype.getContext = () => null;

// Vitest runs without globals, so Testing Library cannot clean up on its own.
afterEach(() => {
  cleanup();
});

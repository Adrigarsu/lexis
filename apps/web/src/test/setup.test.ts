import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('extends expect with the jest-dom matchers', () => {
    const heading = document.createElement('h1');
    document.body.append(heading);

    expect(heading).toBeInTheDocument();
  });

  it('provides an in-memory IndexedDB for Dexie', async () => {
    const request = indexedDB.open('setup-test');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error ?? new Error('IndexedDB open failed'));
      };
    });

    expect(db.name).toBe('setup-test');
    db.close();
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { LexisDb } from './LexisDb';

const NAME = 'lexis-schema-test';

describe('LexisDb', () => {
  let db: LexisDb | undefined;

  afterEach(async () => {
    await db?.delete();
    db = undefined;
  });

  it('HU-80 creates the local database at version 1 with the outbox table', async () => {
    db = new LexisDb(NAME);
    await db.open();

    expect(db.verno).toBe(1);
    expect(db.tables.map((table) => table.name)).toEqual(['outbox']);
    expect(db.outbox.schema.primKey.auto).toBe(true);
    expect(db.outbox.schema.indexes.map((index) => index.name)).toEqual([
      'table',
    ]);
  });

  it('HU-80 keeps outbox entries in the order they were written', async () => {
    db = new LexisDb(NAME);
    const base = { op: 'insert', payload: {}, attempts: 0 } as const;

    await db.outbox.bulkAdd([
      {
        ...base,
        table: 'profile',
        rowId: 'a',
        createdAt: '2026-11-18T10:00:00Z',
      },
      {
        ...base,
        table: 'reminder',
        rowId: 'b',
        createdAt: '2026-11-18T10:00:01Z',
      },
    ]);

    const rows = await db.outbox.orderBy('seq').toArray();
    expect(rows.map((row) => row.rowId)).toEqual(['a', 'b']);
    expect(rows[0]?.seq).toBeLessThan(rows[1]?.seq ?? 0);
  });
});

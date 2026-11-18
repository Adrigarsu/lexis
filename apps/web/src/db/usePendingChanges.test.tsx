import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LexisDb, OutboxEntry } from './LexisDb';
import { LocalDbProvider } from './LocalDbProvider';
import { useLocalDb } from './useLocalDb';
import { usePendingChanges } from './usePendingChanges';
import { deleteUserDb, openUserDb } from './userDb';

const USER = '0195f0a0-0000-7000-8000-0000000000c1';

// A new object each time: Dexie writes the generated `seq` into what it adds.
function change(createdAt: string): Omit<OutboxEntry, 'seq'> {
  return {
    table: 'profile',
    rowId: USER,
    op: 'update',
    payload: { new_per_day: 10 },
    attempts: 0,
    createdAt,
  };
}

function withDb(db: LexisDb) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <LocalDbProvider db={db}>{children}</LocalDbProvider>;
  };
}

describe('local database in React', () => {
  afterEach(async () => {
    await deleteUserDb(USER);
  });

  it('HU-80 gives the account database to the components inside LocalDbProvider', async () => {
    const db = await openUserDb(USER);

    const { result } = renderHook(() => useLocalDb(), { wrapper: withDb(db) });

    expect(result.current).toBe(db);
  });

  it('HU-80 useLocalDb throws outside LocalDbProvider', () => {
    // React logs the error thrown while rendering; it is expected here.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useLocalDb())).toThrow(
      'useLocalDb must be used inside LocalDbProvider',
    );
  });

  it('HU-80 updates the pending changes count when the outbox changes', async () => {
    const db = await openUserDb(USER);
    const { result } = renderHook(() => usePendingChanges(), {
      wrapper: withDb(db),
    });
    expect(result.current).toBe(0);

    let seq = 0;
    await act(async () => {
      seq = await db.outbox.add(change('2026-11-18T10:00:00Z'));
      await db.outbox.add(change('2026-11-18T10:00:01Z'));
    });
    await waitFor(() => {
      expect(result.current).toBe(2);
    });

    await act(async () => {
      await db.outbox.delete(seq);
    });
    await waitFor(() => {
      expect(result.current).toBe(1);
    });
  });
});

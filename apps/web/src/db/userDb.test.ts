import { Dexie } from 'dexie';
import { afterEach, describe, expect, it } from 'vitest';
import type { OutboxEntry } from './LexisDb';
import { deleteUserDb, localDbName, openUserDb } from './userDb';

const ALICE = '0195f0a0-0000-7000-8000-00000000000a';
const BOB = '0195f0a0-0000-7000-8000-00000000000b';

const change: Omit<OutboxEntry, 'seq'> = {
  table: 'profile',
  rowId: ALICE,
  op: 'update',
  payload: { username: 'alice' },
  attempts: 0,
  createdAt: '2026-11-18T10:00:00Z',
};

describe('userDb', () => {
  afterEach(async () => {
    await deleteUserDb(ALICE);
    await deleteUserDb(BOB);
  });

  it('HU-80 opens a separate local database for each account', async () => {
    const alice = await openUserDb(ALICE);
    const bob = await openUserDb(BOB);

    await alice.outbox.add(change);

    expect(alice.name).toBe(localDbName(ALICE));
    expect(bob.name).toBe(localDbName(BOB));
    expect(alice.name).not.toBe(bob.name);
    expect(await alice.outbox.count()).toBe(1);
    expect(await bob.outbox.count()).toBe(0);
  });

  it('HU-80 deletes the account database on sign out and keeps the others', async () => {
    const alice = await openUserDb(ALICE);
    await openUserDb(BOB);
    await alice.outbox.add(change);

    await deleteUserDb(ALICE);

    expect(await Dexie.exists(localDbName(ALICE))).toBe(false);
    expect(await Dexie.exists(localDbName(BOB))).toBe(true);
    expect(alice.isOpen()).toBe(false);
  });

  it('HU-80 starts empty when the same account signs in again', async () => {
    const before = await openUserDb(ALICE);
    await before.outbox.add(change);
    await deleteUserDb(ALICE);

    const after = await openUserDb(ALICE);

    expect(await after.outbox.count()).toBe(0);
  });

  it('HU-80 rejects an empty user id', async () => {
    await expect(openUserDb('')).rejects.toThrow('user id');
    await expect(deleteUserDb(' ')).rejects.toThrow('user id');
  });
});

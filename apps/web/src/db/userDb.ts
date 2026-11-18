import { Dexie } from 'dexie';
import { LexisDb } from './LexisDb';

// Each account has its own local database, so another person who signs in on
// the same device never sees someone else's data (ADR-023).
const openDbs = new Map<string, LexisDb>();

function assertUserId(userId: string): void {
  if (userId.trim() === '') {
    throw new Error('A local database needs a non-empty user id');
  }
}

/** Name of the local database of one account. */
export function localDbName(userId: string): string {
  assertUserId(userId);
  return `lexis-${userId}`;
}

/** Opens the local database of the account that has just signed in. */
export async function openUserDb(userId: string): Promise<LexisDb> {
  const name = localDbName(userId);
  const db = openDbs.get(userId) ?? new LexisDb(name);
  openDbs.set(userId, db);
  await db.open();
  return db;
}

/** Closes and deletes the local database of the account that signs out. */
export async function deleteUserDb(userId: string): Promise<void> {
  const name = localDbName(userId);
  openDbs.get(userId)?.close();
  openDbs.delete(userId);
  await Dexie.delete(name);
}

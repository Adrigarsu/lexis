import type { LexisDb } from './LexisDb';

/** Name of the local database of one account. */
export function localDbName(userId: string): string {
  throw new Error(`Not implemented: ${userId}`);
}

/** Opens the local database of the account that has just signed in. */
export function openUserDb(userId: string): Promise<LexisDb> {
  return Promise.reject(new Error(`Not implemented: ${userId}`));
}

/** Closes and deletes the local database of the account that signs out. */
export function deleteUserDb(userId: string): Promise<void> {
  return Promise.reject(new Error(`Not implemented: ${userId}`));
}

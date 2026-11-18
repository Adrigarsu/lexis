import { use } from 'react';
import type { LexisDb } from './LexisDb';
import { LocalDbContext } from './localDbContext';

/** The local database of the signed-in account. */
export function useLocalDb(): LexisDb {
  const db = use(LocalDbContext);
  if (!db) {
    throw new Error('useLocalDb must be used inside LocalDbProvider');
  }
  return db;
}

import type { ReactNode } from 'react';
import type { LexisDb } from './LexisDb';
import { LocalDbContext } from './localDbContext';

interface LocalDbProviderProps {
  db: LexisDb;
  children: ReactNode;
}

/** Gives the local database of the signed-in account to the app. */
export function LocalDbProvider({ db, children }: LocalDbProviderProps) {
  return <LocalDbContext value={db}>{children}</LocalDbContext>;
}

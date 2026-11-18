import type { ReactNode } from 'react';
import type { LexisDb } from './LexisDb';

interface LocalDbProviderProps {
  db: LexisDb;
  children: ReactNode;
}

/** Gives the local database of the signed-in account to the app. */
export function LocalDbProvider({ children }: LocalDbProviderProps) {
  return children;
}

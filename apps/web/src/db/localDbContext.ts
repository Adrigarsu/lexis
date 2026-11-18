import { createContext } from 'react';
import type { LexisDb } from './LexisDb';

/** The local database of the signed-in account, or null outside the provider. */
export const LocalDbContext = createContext<LexisDb | null>(null);

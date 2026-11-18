import { useLiveQuery } from 'dexie-react-hooks';
import { useLocalDb } from './useLocalDb';

/**
 * Number of local changes still waiting to be pushed to the cloud. It is a
 * live query (ADR-008): the component re-renders whenever the outbox changes.
 */
export function usePendingChanges(): number {
  const db = useLocalDb();
  return useLiveQuery(() => db.outbox.count(), [db], 0);
}

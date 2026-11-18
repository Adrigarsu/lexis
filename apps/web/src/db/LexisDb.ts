import { Dexie, type EntityTable } from 'dexie';

export type OutboxOperation = 'insert' | 'update' | 'delete';

/** A local change waiting to be pushed to Supabase (ADR-023). */
export interface OutboxEntry {
  /** Push order: auto-incremented by IndexedDB. */
  seq: number;
  /** Supabase table the change belongs to, e.g. `profile`. */
  table: string;
  /** UUID of the changed row, created on the device. */
  rowId: string;
  op: OutboxOperation;
  payload: Record<string, unknown>;
  /** Failed push attempts so far. */
  attempts: number;
  /** ISO 8601 timestamp of the change. */
  createdAt: string;
}

export class LexisDb extends Dexie {
  declare outbox: EntityTable<OutboxEntry, 'seq'>;
}

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

/**
 * The local database of one account (ADR-003). Each story that needs new
 * tables adds a new `this.version(n)` below with only its changes, plus an
 * `.upgrade()` when existing rows have to be migrated. Never edit a version
 * that has shipped.
 */
export class LexisDb extends Dexie {
  declare outbox: EntityTable<OutboxEntry, 'seq'>;

  constructor(name: string) {
    super(name);

    // v1 (HU-80): the outbox of the sync queue, indexed by table.
    this.version(1).stores({
      outbox: '++seq, table',
    });
  }
}

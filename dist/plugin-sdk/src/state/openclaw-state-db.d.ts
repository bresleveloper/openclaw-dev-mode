import type { DatabaseSync } from "node:sqlite";
import { type SqliteWalMaintenance } from "../infra/sqlite-wal.js";
/** Shared timeout used by state and agent SQLite handles before surfacing busy errors. */
export declare const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 30000;
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
export type OpenClawStateDatabase = {
    db: DatabaseSync;
    path: string;
    walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving or overriding the shared state database path. */
export type OpenClawStateDatabaseOptions = {
    env?: NodeJS.ProcessEnv;
    path?: string;
};
export type OpenClawStateDatabaseSchemaMigration = {
    kind: "agent-databases-composite-primary-key";
    path: string;
};
export declare function detectOpenClawStateDatabaseSchemaMigrations(options?: OpenClawStateDatabaseOptions): OpenClawStateDatabaseSchemaMigration[];
export declare function repairOpenClawStateDatabaseSchema(options?: OpenClawStateDatabaseOptions): {
    changes: string[];
    warnings: string[];
};
/** Open or return a cached shared state database after schema and migration checks. */
export declare function openOpenClawStateDatabase(options?: OpenClawStateDatabaseOptions): OpenClawStateDatabase;
/** Run a synchronous immediate transaction against the shared state database. */
export declare function runOpenClawStateWriteTransaction<T>(operation: (database: OpenClawStateDatabase) => T, options?: OpenClawStateDatabaseOptions): T;
/** Close all cached shared state database handles. */
export declare function closeOpenClawStateDatabase(): void;
/** Test whether any cached shared state database handle is still open. */
export declare function isOpenClawStateDatabaseOpen(): boolean;
/** Test alias for closing shared state handles from teardown code. */
export declare const closeOpenClawStateDatabaseForTest: typeof closeOpenClawStateDatabase;

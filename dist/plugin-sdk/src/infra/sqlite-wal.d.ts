import type { DatabaseSync } from "node:sqlite";
export declare const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1000;
export declare const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS: number;
/**
 * @deprecated Use DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS.
 * Periodic checkpoints default to PASSIVE.
 */
export declare const DEFAULT_SQLITE_WAL_TRUNCATE_INTERVAL_MS: number;
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
export type SqliteWalMaintenance = {
    checkpoint: () => boolean;
    close: () => boolean;
};
/** Options controlling WAL autocheckpoint and periodic checkpoint behavior. */
export type SqliteWalMaintenanceOptions = {
    autoCheckpointPages?: number;
    checkpointIntervalMs?: number;
    checkpointMode?: SqliteWalCheckpointMode;
    databaseLabel?: string;
    databasePath?: string;
    onCheckpointError?: (error: unknown) => void;
};
export type SqliteConnectionPragmaOptions = SqliteWalMaintenanceOptions & {
    busyTimeoutMs?: number;
    foreignKeys?: boolean;
    synchronous?: "NORMAL";
};
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
export declare function configureSqliteWalMaintenance(db: DatabaseSync, options?: SqliteWalMaintenanceOptions): SqliteWalMaintenance;
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
export declare function configureSqliteConnectionPragmas(db: DatabaseSync, options?: SqliteConnectionPragmaOptions): SqliteWalMaintenance;
export {};

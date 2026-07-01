/** SQLite-backed cron run-log storage helpers. */
import type { DatabaseSync } from "node:sqlite";
import type { Selectable } from "kysely";
import type { DB as OpenClawStateKyselyDatabase } from "../../state/openclaw-state-db.generated.js";
import type { CronRunLogEntry } from "../run-log-types.js";
import type { CronDeliveryStatus, CronRunStatus } from "../types.js";
type CronRunLogsTable = OpenClawStateKyselyDatabase["cron_run_logs"];
type CronRunLogRow = Selectable<CronRunLogsTable>;
/** Rehydrates a cron run-log row, preferring indexed SQLite columns over JSON payload values. */
export declare function parseStoredRunLogEntry(row: CronRunLogRow): CronRunLogEntry | null;
/** Reads run-log rows for one store, optionally scoped to one job, in chronological order. */
export declare function readCronRunLogRows(db: DatabaseSync, storeKey: string, jobId?: string): CronRunLogRow[];
/** Counts run-log rows after applying the same filters used by paged reads. */
export declare function countCronRunLogRows(params: {
    db: DatabaseSync;
    storeKey: string;
    jobId?: string;
    statuses: CronRunStatus[] | null;
    deliveryStatuses: CronDeliveryStatus[] | null;
    runId?: string;
}): number;
/** Reads a sorted, filtered page of cron run-log rows. */
export declare function readCronRunLogRowsPage(params: {
    db: DatabaseSync;
    storeKey: string;
    jobId?: string;
    statuses: CronRunStatus[] | null;
    deliveryStatuses: CronDeliveryStatus[] | null;
    runId?: string;
    sortDir: "asc" | "desc";
    offset?: number;
    limit?: number;
}): CronRunLogRow[];
/** Appends a cron run-log entry with a per-job monotonic sequence number. */
export declare function insertCronRunLogEntry(db: DatabaseSync, storeKey: string, entry: CronRunLogEntry): void;
/** Prunes old cron run-log rows for one job, retaining the newest keepLines rows. */
export declare function pruneCronRunLogRows(db: DatabaseSync, storeKey: string, jobId: string, keepLines: number): void;
export {};

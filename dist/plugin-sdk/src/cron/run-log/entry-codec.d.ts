import type { CronRunLogEntry } from "../run-log-types.js";
/** Parses a persisted cron run-log entry object and drops invalid or wrong-job rows. */
export declare function parseCronRunLogEntryObject(obj: unknown, opts?: {
    jobId?: string;
}): CronRunLogEntry | null;

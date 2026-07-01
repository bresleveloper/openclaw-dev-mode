/** Legacy JSONL run-log parser used during migrations/imports. */
import type { CronRunLogEntry } from "./run-log-types.js";
/** Parses legacy cron run-log JSONL, skipping malformed or non-matching rows. */
export declare function parseCronRunLogEntriesFromJsonl(raw: string, opts?: {
    jobId?: string;
}): CronRunLogEntry[];

/** SQLite column codec for mutable cron runtime state. */
import type { CronJobState } from "../types.js";
import type { CronJobInsert, CronJobRow } from "./schema.js";
/** Maps mutable cron runtime state into normalized SQLite columns. */
export declare function bindStateColumns(state: CronJobState): Pick<CronJobInsert, "consecutive_errors" | "consecutive_skipped" | "last_delivered" | "last_delivery_error" | "last_delivery_status" | "last_duration_ms" | "last_error" | "last_failure_alert_at_ms" | "last_run_at_ms" | "last_run_status" | "next_run_at_ms" | "running_at_ms" | "schedule_error_count">;
/** Reconstructs cron runtime state from JSON plus split indexed columns. */
export declare function stateFromRow(row: CronJobRow): CronJobState;

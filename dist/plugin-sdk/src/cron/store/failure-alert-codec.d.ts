/** SQLite column codec for cron failure-alert configuration. */
import type { CronFailureAlert } from "../types.js";
import type { CronJobInsert, CronJobRow } from "./schema.js";
/** Maps cron failure-alert config into normalized SQLite columns. */
export declare function bindFailureAlertColumns(failureAlert: CronFailureAlert | false | undefined): Pick<CronJobInsert, "failure_alert_account_id" | "failure_alert_after" | "failure_alert_channel" | "failure_alert_cooldown_ms" | "failure_alert_disabled" | "failure_alert_include_skipped" | "failure_alert_mode" | "failure_alert_to">;
/** Reconstructs failure-alert config, distinguishing disabled from omitted config. */
export declare function failureAlertFromRow(row: CronJobRow): CronFailureAlert | false | undefined;

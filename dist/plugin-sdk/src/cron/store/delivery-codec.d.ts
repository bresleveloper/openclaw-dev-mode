/** SQLite column codec for cron delivery configuration. */
import type { CronDelivery } from "../types.js";
import type { CronJobInsert, CronJobRow } from "./schema.js";
/** Maps cron delivery config into normalized SQLite columns. */
export declare function bindDeliveryColumns(delivery: CronDelivery | undefined): Pick<CronJobInsert, "delivery_account_id" | "delivery_best_effort" | "delivery_channel" | "delivery_completion_mode" | "delivery_completion_to" | "delivery_mode" | "delivery_thread_id" | "delivery_to" | "failure_delivery_account_id" | "failure_delivery_channel" | "failure_delivery_mode" | "failure_delivery_to">;
/** Reconstructs delivery config from split SQLite columns, preserving legacy partial rows. */
export declare function deliveryFromRow(row: CronJobRow): CronDelivery | undefined;

/** Resolves create-time default delivery for new cron jobs. */
import type { CronDelivery, CronJobCreate } from "../types.js";
/** Resolves default cron delivery for new jobs when callers omit explicit delivery config. */
export declare function resolveInitialCronDelivery(input: CronJobCreate): CronDelivery | undefined;

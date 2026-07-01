import type { CronConfig } from "./types.cron.js";
/** Default maximum number of cron jobs allowed to run at once. */
export declare const DEFAULT_CRON_MAX_CONCURRENT_RUNS = 8;
/** Resolves cron concurrency config, flooring finite values and clamping to at least one. */
export declare function resolveCronMaxConcurrentRuns(cronConfig?: Pick<CronConfig, "maxConcurrentRuns">): number;

import type { CronSchedule } from "./types.js";
export { coerceFiniteScheduleNumber } from "./schedule-number.js";
/** Computes the next scheduled run timestamp after now for at/every/cron schedules. */
export declare function computeNextRunAtMs(schedule: CronSchedule, nowMs: number): number | undefined;
/** Computes the previous cron-expression run timestamp before now. */
export declare function computePreviousRunAtMs(schedule: CronSchedule, nowMs: number): number | undefined;
/** Clears the Croner expression cache for deterministic tests. */
export declare function clearCronScheduleCacheForTest(): void;
/** Returns the Croner expression cache size for tests. */
export declare function getCronScheduleCacheSizeForTest(): number;
/** Returns the Croner expression cache capacity for tests. */
export declare function getCronScheduleCacheMaxForTest(): number;
/** Returns whether an expression/timezone pair is present in the Croner cache for tests. */
export declare function hasCronInCacheForTest(expr: string, tz: string): boolean;

import type { CronSchedule } from "./types.js";
/** Returns whether a cron expression fires recurring jobs exactly at the top of an hour. */
export declare function isRecurringTopOfHourCronExpr(expr: string): boolean;
/** Normalizes explicit stagger values from config, preserving zero as "run exactly on schedule". */
export declare function normalizeCronStaggerMs(raw: unknown): number | undefined;
/** Returns the default anti-thundering-herd stagger for top-of-hour recurring schedules. */
export declare function resolveDefaultCronStaggerMs(expr: string): number | undefined;
/** Resolves the effective stagger for a cron schedule, preferring explicit values over defaults. */
export declare function resolveCronStaggerMs(schedule: Extract<CronSchedule, {
    kind: "cron";
}>): number;

import type { CronJob, CronJobCreate, CronJobPatch } from "../types.js";
import type { CronServiceState } from "./state.js";
/** Default retry delays applied after consecutive cron execution errors. */
export declare const DEFAULT_ERROR_BACKOFF_SCHEDULE_MS: number[];
/** Returns whether a stored next-run timestamp is finite and schedulable. */
export declare function hasScheduledNextRunAtMs(value: unknown): value is number;
/** Resolves the newest persisted cron run status while older state is still readable. */
export declare function resolveJobLastRunStatus(job: Pick<CronJob, "state">): import("../types.js").CronRunStatus | undefined;
/** Resolves the retry backoff delay for a one-based consecutive error count. */
export declare function errorBackoffMs(consecutiveErrors: number, scheduleMs?: number[]): number;
/** Returns the earliest retry timestamp after a failed cron run and its runtime duration. */
export declare function resolveJobErrorBackoffUntilMs(job: CronJob, scheduleMs?: number[]): number | undefined;
/** Validates that session target and payload kind form a supported cron job shape. */
export declare function assertSupportedJobSpec(job: Pick<CronJob, "sessionTarget" | "payload">): void;
/** Finds an in-memory cron job or throws the public unknown-id error. */
export declare function findJobOrThrow(state: CronServiceState, id: string): CronJob;
/** Returns the effective enabled flag, defaulting missing values to enabled. */
export declare function isJobEnabled(job: Pick<CronJob, "enabled">): boolean;
/** Computes the next run timestamp for enabled jobs across every/at/cron schedules. */
export declare function computeJobNextRunAtMs(job: CronJob, nowMs: number): number | undefined;
/** Computes the previous effective cron timestamp, including per-job staggering. */
export declare function computeJobPreviousRunAtMs(job: CronJob, nowMs: number): number | undefined;
/** Records a schedule-computation failure and auto-disables after repeated errors. */
export declare function recordScheduleComputeError(params: {
    state: CronServiceState;
    job: CronJob;
    err: unknown;
}): boolean;
/** Recomputes missing, due, or repairable next-run timestamps for all schedulable jobs. */
export declare function recomputeNextRuns(state: CronServiceState): boolean;
/**
 * Maintenance-only version of recomputeNextRuns that handles disabled jobs
 * and stuck markers, but does NOT recompute nextRunAtMs for enabled jobs
 * with existing values. Used during timer ticks when no due jobs were found
 * to prevent silently advancing past-due nextRunAtMs values without execution
 * (see #13992).
 */
export declare function recomputeNextRunsForMaintenance(state: CronServiceState, opts?: {
    recomputeExpired?: boolean;
    nowMs?: number;
    repairFutureCronNextRunAtMs?: boolean;
    skipFutureRepairJobIds?: ReadonlySet<string>;
}): boolean;
/** Returns the next enabled wake timestamp from the in-memory cron store. */
export declare function nextWakeAtMs(state: CronServiceState): number | undefined;
/** Creates a normalized cron job row from public add input and computes its initial schedule. */
export declare function createJob(state: CronServiceState, input: CronJobCreate): CronJob;
/** Applies a public cron patch in-place, preserving omitted nested fields and validating the result. */
export declare function applyJobPatch(job: CronJob, patch: CronJobPatch, opts?: {
    defaultAgentId?: string;
    scheduleValidationNowMs?: number;
}): void;
/** Returns whether a cron job should execute at `nowMs`, honoring force mode and active runs. */
export declare function isJobDue(job: CronJob, nowMs: number, opts: {
    forced: boolean;
}): boolean;
/** Returns main-session queue text for system-event jobs, or undefined when empty/unsupported. */
export declare function resolveJobPayloadTextForMain(job: CronJob): string | undefined;

import type { CronSchedule } from "./types.js";
type TimestampValidationError = {
    ok: false;
    message: string;
};
type TimestampValidationSuccess = {
    ok: true;
};
type TimestampValidationResult = TimestampValidationSuccess | TimestampValidationError;
/**
 * Validates one-shot cron timestamps with a small past grace window and far-future cap.
 */
export declare function validateScheduleTimestamp(schedule: CronSchedule, nowMs?: number): TimestampValidationResult;
export {};

import type { CronJobCreate, CronJobPatch } from "./types.js";
type UnknownRecord = Record<string, unknown>;
type NormalizeOptions = {
    applyDefaults?: boolean;
    /** Session context used to resolve "current" sessionTarget during create-time defaulting. */
    sessionContext?: {
        sessionKey?: string;
    };
};
/** Normalizes raw cron job input without deciding whether create-time defaults apply. */
export declare function normalizeCronJobInput(raw: unknown, options?: NormalizeOptions): UnknownRecord | null;
/** Normalizes a raw cron create request and applies create-time defaults. */
export declare function normalizeCronJobCreate(raw: unknown, options?: Omit<NormalizeOptions, "applyDefaults">): CronJobCreate | null;
/** Normalizes a raw cron patch request without filling omitted fields. */
export declare function normalizeCronJobPatch(raw: unknown, options?: NormalizeOptions): CronJobPatch | null;
export {};

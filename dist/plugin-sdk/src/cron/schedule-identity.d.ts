type CronScheduleIdentityInput = {
    schedule?: unknown;
    enabled?: unknown;
} & Record<string, unknown>;
/** Builds a stable scheduling identity for deciding whether stored timer state is still valid. */
export declare function tryCronScheduleIdentity(job: CronScheduleIdentityInput): string | undefined;
/** Compares two cron jobs by the normalized inputs that affect next-run computation. */
export declare function cronSchedulingInputsEqual(previous: CronScheduleIdentityInput, next: CronScheduleIdentityInput): boolean;
export {};

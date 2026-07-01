/** Structural rejection code for persisted cron jobs that cannot be loaded safely. */
export type InvalidPersistedCronJobReason = "missing-id" | "missing-schedule" | "invalid-schedule" | "missing-payload" | "invalid-payload";
/** Returns the first structural reason a persisted cron job cannot be loaded safely. */
export declare function getInvalidPersistedCronJobReason(candidate: Record<string, unknown>): InvalidPersistedCronJobReason | null;

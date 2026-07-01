export type CronActiveJobMarker = {
    jobId: string;
    generation: number;
    token: number;
    legacy?: boolean;
    preserveAcrossGenerationAdvance?: boolean;
};
/** Marks a cron job id as currently executing for duplicate-run suppression. */
export declare function markCronJobActive(jobId: string, opts?: {
    preserveAcrossGenerationAdvance?: boolean;
}): CronActiveJobMarker | undefined;
/** Clears the active marker when a cron run exits or is abandoned. */
export declare function clearCronJobActive(jobId: string, marker?: CronActiveJobMarker): void;
/** Returns whether the given cron job id is currently executing in this process. */
export declare function isCronJobActive(jobId: string): boolean;
export declare function isCronActiveJobMarkerCurrent(marker: CronActiveJobMarker | undefined): boolean;
/** Returns whether any cron run is active in this process. */
export declare function hasActiveCronJobs(): boolean;
/** Returns the number of active cron runs in this process. */
export declare function getActiveCronJobCount(): number;
export declare function waitForActiveCronJobs(timeoutMs: number): Promise<{
    drained: boolean;
    active: number;
}>;
/** Starts a new process-lifecycle generation without clearing still-finalizing old runs. */
export declare function advanceCronActiveJobGeneration(): void;
/** Clears process-global cron active-job state at process-lifecycle boundaries. */
export declare function resetCronActiveJobs(): void;

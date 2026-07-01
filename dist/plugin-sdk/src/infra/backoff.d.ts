/** Exponential backoff settings for retry loops that need bounded jitter. */
export type BackoffPolicy = {
    /** Delay in milliseconds for attempt 1 and any lower attempt value. */
    initialMs: number;
    /** Hard upper bound in milliseconds after exponential growth and jitter. */
    maxMs: number;
    /** Multiplier applied once per retry attempt after the first. */
    factor: number;
    /** Fraction of the current base delay used as additive random jitter. */
    jitter: number;
};
/** Computes a bounded exponential delay for a 1-based retry attempt. */
export declare function computeBackoff(policy: BackoffPolicy, attempt: number): number;
/** Sleeps for a clamped timer duration and rejects with a stable aborted error on abort. */
export declare function sleepWithAbort(ms: number, abortSignal?: AbortSignal): Promise<void>;

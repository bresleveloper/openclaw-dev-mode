/** Readiness probe outcome with timing data for diagnosing event-loop stalls. */
export type EventLoopReadyResult = {
    ready: boolean;
    elapsedMs: number;
    maxDriftMs: number;
    checks: number;
    aborted: boolean;
};
/** Controls how aggressively the client waits for low-drift timer checks before starting IO. */
export type EventLoopReadyOptions = {
    maxWaitMs?: number;
    intervalMs?: number;
    driftThresholdMs?: number;
    consecutiveReadyChecks?: number;
    signal?: AbortSignal;
};
/** Waits until timer drift stays low for consecutive checks, or aborts/times out. */
export declare function waitForEventLoopReady(options?: EventLoopReadyOptions): Promise<EventLoopReadyResult>;

/** Retry timing configuration with optional jitter. */
export type RetryConfig = {
    attempts?: number;
    minDelayMs?: number;
    maxDelayMs?: number;
    jitter?: number;
};
/** Retry callback payload. */
export type RetryInfo = {
    attempt: number;
    maxAttempts: number;
    delayMs: number;
    err: unknown;
    label?: string;
};
/** Retry options for retryAsync. */
export type RetryOptions = RetryConfig & {
    label?: string;
    shouldRetry?: (err: unknown, attempt: number) => boolean;
    retryAfterMs?: (err: unknown) => number | undefined;
    onRetry?: (info: RetryInfo) => void;
};
/** Resolve retry settings with clamped positive timeout values. */
export declare function resolveRetryConfig(defaults?: Required<RetryConfig>, overrides?: RetryConfig): Required<RetryConfig>;
/** Run an async operation with exponential backoff retry handling. */
export declare function retryAsync<T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number): Promise<T>;

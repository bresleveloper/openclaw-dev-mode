import { type RetryConfig } from "./retry.js";
/** Runs an async operation with a policy-specific retry wrapper and optional log label. */
export type RetryRunner = <T>(fn: () => Promise<T>, label?: string) => Promise<T>;
/** Default retry envelope for channel API operations that hit transient network edges. */
export declare const CHANNEL_API_RETRY_DEFAULTS: {
    attempts: number;
    minDelayMs: number;
    maxDelayMs: number;
    jitter: number;
};
/** Creates a generic rate-limit-aware retry runner from explicit retry policy pieces. */
export declare function createRateLimitRetryRunner(params: {
    retry?: RetryConfig;
    configRetry?: RetryConfig;
    verbose?: boolean;
    defaults: Required<RetryConfig>;
    logLabel: string;
    shouldRetry: (err: unknown) => boolean;
    retryAfterMs?: (err: unknown) => number | undefined;
}): RetryRunner;
/** Creates the channel API retry runner used by outbound messaging integrations. */
export declare function createChannelApiRetryRunner(params: {
    retry?: RetryConfig;
    configRetry?: RetryConfig;
    verbose?: boolean;
    shouldRetry?: (err: unknown) => boolean;
    /**
     * When true, the custom shouldRetry predicate is used exclusively —
     * the default channel API fallback regex is NOT OR'd in.
     * Use this for non-idempotent operations (e.g. sendMessage) where
     * the regex fallback would cause duplicate message delivery.
     */
    strictShouldRetry?: boolean;
}): RetryRunner;

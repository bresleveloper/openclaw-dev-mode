/** In-memory fixed-window limiter used by webhook ingress handlers. */
export type FixedWindowRateLimiter = {
    /** Return true once the key exceeds its allowed request count in the current window. */
    isRateLimited: (key: string, nowMs?: number) => boolean;
    /** Number of tracked keys currently retained in memory. */
    size: () => number;
    /** Drop all tracked keys and reset pruning state. */
    clear: () => void;
};
/** Bounded keyed counter for sampled webhook anomaly tracking. */
export type BoundedCounter = {
    /** Increment one key and return its current count, or zero for empty keys. */
    increment: (key: string, nowMs?: number) => number;
    /** Number of tracked keys currently retained in memory. */
    size: () => number;
    /** Drop all tracked keys and reset pruning state. */
    clear: () => void;
};
/** Default webhook ingress rate-limit settings for plugin monitors. */
export declare const WEBHOOK_RATE_LIMIT_DEFAULTS: Readonly<{
    windowMs: 60000;
    maxRequests: 120;
    maxTrackedKeys: 4096;
}>;
/** Default cardinality and sampling settings for webhook anomaly counters. */
export declare const WEBHOOK_ANOMALY_COUNTER_DEFAULTS: Readonly<{
    maxTrackedKeys: 4096;
    ttlMs: number;
    logEvery: 25;
}>;
/** HTTP status codes counted as anomalous webhook request outcomes. */
export declare const WEBHOOK_ANOMALY_STATUS_CODES: readonly number[];
/** Records repeated webhook failures and exposes bounded in-memory state controls. */
export type WebhookAnomalyTracker = {
    /** Count one tracked status for a key; returns zero when the status/key is ignored. */
    record: (params: {
        /** Stable anomaly key, typically route plus sender or remote identity. */
        key: string;
        /** HTTP status to count when it is in the tracked status-code set. */
        statusCode: number;
        /** Build the sampled log message from the current key count. */
        message: (count: number) => string;
        /** Optional log sink invoked for the first hit and every sampled repeat. */
        log?: (message: string) => void;
        /** Clock override for deterministic tests. */
        nowMs?: number;
    }) => number;
    /** Number of tracked anomaly keys currently retained in memory. */
    size: () => number;
    /** Drop all tracked anomaly keys and reset pruning state. */
    clear: () => void;
};
/** Create a simple fixed-window rate limiter for in-memory webhook protection. */
export declare function createFixedWindowRateLimiter(options: {
    /** Duration of one fixed window in milliseconds. */
    windowMs: number;
    /** Maximum accepted requests per key during one window. */
    maxRequests: number;
    /** Maximum number of keys retained before oldest entries are pruned. */
    maxTrackedKeys: number;
    /** Optional interval for expired-window pruning. Defaults to `windowMs`. */
    pruneIntervalMs?: number;
}): FixedWindowRateLimiter;
/** Count keyed events in memory with optional TTL pruning and bounded cardinality. */
export declare function createBoundedCounter(options: {
    /** Maximum number of keys retained before oldest entries are pruned. */
    maxTrackedKeys: number;
    /** Optional key TTL in milliseconds; zero disables TTL expiry. */
    ttlMs?: number;
    /** Optional interval for TTL pruning. */
    pruneIntervalMs?: number;
}): BoundedCounter;
/** Track repeated webhook failures and emit sampled logs for suspicious request patterns. */
export declare function createWebhookAnomalyTracker(options?: {
    /** Maximum number of anomaly keys retained before oldest entries are pruned. */
    maxTrackedKeys?: number;
    /** Key TTL in milliseconds; zero disables TTL expiry. */
    ttlMs?: number;
    /** Log every Nth repeat after the first hit. */
    logEvery?: number;
    /** HTTP status codes that should be counted as anomalies. */
    trackedStatusCodes?: readonly number[];
}): WebhookAnomalyTracker;

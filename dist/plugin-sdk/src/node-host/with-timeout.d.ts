/**
 * AbortSignal-based timeout wrapper for node-host operations.
 *
 * The wrapper races work against an abort promise, clears timers/listeners on
 * completion, and preserves object-shaped abort reasons as Error properties.
 */
/** Run work with an optional timeout and AbortSignal. */
export declare function withTimeout<T>(work: (signal: AbortSignal | undefined) => Promise<T>, timeoutMs?: number, label?: string): Promise<T>;

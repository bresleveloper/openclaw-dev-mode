/**
 * Wraps fetch so Node-compatible duplex bodies, normalized headers, and foreign
 * AbortSignal implementations work against runtimes expecting native signals.
 */
export declare function wrapFetchWithAbortSignal(fetchImpl: typeof fetch): typeof fetch;
/** Resolves an optional fetch implementation, wrapping it when fetch is available. */
export declare function resolveFetch(fetchImpl?: typeof fetch): typeof fetch | undefined;

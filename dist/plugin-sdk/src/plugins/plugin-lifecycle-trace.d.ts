type TraceDetails = Record<string, boolean | number | string | undefined>;
/** Traces a synchronous plugin lifecycle phase when tracing is enabled. */
export declare function tracePluginLifecyclePhase<T>(phase: string, fn: () => T, details?: TraceDetails): T;
/** Traces an async plugin lifecycle phase when tracing is enabled. */
export declare function tracePluginLifecyclePhaseAsync<T>(phase: string, fn: () => Promise<T>, details?: TraceDetails): Promise<T>;
export {};

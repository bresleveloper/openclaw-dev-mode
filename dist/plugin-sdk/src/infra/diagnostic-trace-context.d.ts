export type DiagnosticTraceContext = {
    /** W3C trace id, 32 lowercase hex chars. */
    readonly traceId: string;
    /** Current span id, 16 lowercase hex chars. */
    readonly spanId?: string;
    /** Parent span id, 16 lowercase hex chars. */
    readonly parentSpanId?: string;
    /** W3C trace flags, 2 lowercase hex chars. Defaults to sampled. */
    readonly traceFlags?: string;
};
type DiagnosticTraceContextInput = Partial<DiagnosticTraceContext> & {
    traceparent?: string;
};
/** Returns whether a value is a non-zero W3C trace id. */
export declare function isValidDiagnosticTraceId(value: unknown): value is string;
/** Returns whether a value is a non-zero W3C span id. */
export declare function isValidDiagnosticSpanId(value: unknown): value is string;
/** Returns whether a value is a valid W3C trace-flags byte. */
export declare function isValidDiagnosticTraceFlags(value: unknown): value is string;
/** Parses a W3C `traceparent` header into a normalized diagnostic trace context. */
export declare function parseDiagnosticTraceparent(traceparent: string | undefined): DiagnosticTraceContext | undefined;
/** Formats a diagnostic trace context as a W3C `traceparent` header. */
export declare function formatDiagnosticTraceparent(context: DiagnosticTraceContext | undefined): string | undefined;
/** Creates a normalized trace context from explicit fields, traceparent, or generated ids. */
export declare function createDiagnosticTraceContext(input?: DiagnosticTraceContextInput): DiagnosticTraceContext;
/** Creates a child context that preserves the parent trace id and records the parent span id. */
export declare function createChildDiagnosticTraceContext(parent: DiagnosticTraceContext, input?: Omit<DiagnosticTraceContextInput, "traceId" | "traceparent">): DiagnosticTraceContext;
/** Creates a child of the active trace scope, or a new root context when no scope is active. */
export declare function createDiagnosticTraceContextFromActiveScope(input?: Omit<DiagnosticTraceContextInput, "traceId" | "traceparent">): DiagnosticTraceContext;
/** Returns an immutable defensive copy of a trace context. */
export declare function freezeDiagnosticTraceContext(context: DiagnosticTraceContext): DiagnosticTraceContext;
/** Returns the trace context bound to the current async scope. */
export declare function getActiveDiagnosticTraceContext(): DiagnosticTraceContext | undefined;
/** Runs a callback with a frozen trace context bound to async-local storage. */
export declare function runWithDiagnosticTraceContext<T>(trace: DiagnosticTraceContext, callback: () => T): T;
/** Clears async-local trace context state between tests. */
export declare function resetDiagnosticTraceContextForTest(): void;
export {};

import type { OpenClawConfig } from "../config/types.openclaw.js";
type DiagnosticsTimelineEventType = "span.start" | "span.end" | "span.error" | "mark" | "eventLoop.sample" | "provider.request" | "childProcess.exit";
type DiagnosticsTimelineAttributes = Record<string, string | number | boolean | null>;
type DiagnosticsTimelineEvent = {
    type: DiagnosticsTimelineEventType;
    name: string;
    timestamp?: string;
    runId?: string;
    envName?: string;
    pid?: number;
    phase?: string;
    spanId?: string;
    parentSpanId?: string;
    durationMs?: number;
    attributes?: DiagnosticsTimelineAttributes;
    errorName?: string;
    errorMessage?: string;
    p50Ms?: number;
    p95Ms?: number;
    p99Ms?: number;
    maxMs?: number;
    activeSpanName?: string;
    provider?: string;
    operation?: string;
    ok?: boolean;
    command?: string;
    exitCode?: number | null;
    signal?: string | null;
};
type DiagnosticsTimelineSpanOptions = {
    phase?: string;
    parentSpanId?: string;
    attributes?: DiagnosticsTimelineAttributes;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    omitErrorMessage?: boolean;
};
type DiagnosticsTimelineOptions = {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
};
/** Active timeline span carried through async-local scope for nested diagnostics. */
type ActiveDiagnosticsTimelineSpan = {
    name: string;
    phase?: string;
    spanId: string;
    parentSpanId?: string;
    attributes?: DiagnosticsTimelineAttributes;
};
/** Returns true when diagnostics flags and a JSONL output path both allow timeline writes. */
export declare function isDiagnosticsTimelineEnabled(options?: DiagnosticsTimelineOptions): boolean;
/** Appends one normalized diagnostics timeline event to the configured JSONL file. */
export declare function emitDiagnosticsTimelineEvent(event: DiagnosticsTimelineEvent, options?: DiagnosticsTimelineOptions): void;
/** Returns the currently active span so callers can preserve parentage across memoized work. */
export declare function getActiveDiagnosticsTimelineSpan(): ActiveDiagnosticsTimelineSpan | undefined;
/** Measures async work as a start/end timeline span, emitting an error span before rethrowing. */
export declare function measureDiagnosticsTimelineSpan<T>(name: string, run: () => Promise<T> | T, options?: DiagnosticsTimelineSpanOptions): Promise<T>;
/** Measures sync work as a start/end timeline span, emitting an error span before rethrowing. */
export declare function measureDiagnosticsTimelineSpanSync<T>(name: string, run: () => T, options?: DiagnosticsTimelineSpanOptions): T;
export {};

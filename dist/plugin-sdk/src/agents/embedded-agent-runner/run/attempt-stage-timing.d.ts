/** Timing for one named stage, including both stage duration and run-relative elapsed time. */
type EmbeddedRunStageTiming = {
    name: string;
    durationMs: number;
    elapsedMs: number;
};
/** Snapshot of all marked stages plus total elapsed time at snapshot creation. */
type EmbeddedRunStageSummary = {
    totalMs: number;
    stages: EmbeddedRunStageTiming[];
};
/** Lightweight monotonic-ish stage tracker used for embedded run startup diagnostics. */
type EmbeddedRunStageTracker = {
    mark: (name: string) => void;
    snapshot: () => EmbeddedRunStageSummary;
};
/** Canonical stage names for dispatch-time embedded attempt diagnostics. */
export declare const EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE: {
    readonly workspace: "attempt-workspace";
    readonly prompt: "attempt-prompt";
    readonly runtimePlan: "attempt-runtime-plan";
    readonly dispatch: "attempt-dispatch";
};
/**
 * Creates an append-only stage tracker. `mark` records time since the previous
 * mark while `snapshot` reports current total elapsed time without mutating the
 * recorded stage list.
 */
export declare function createEmbeddedRunStageTracker(options?: {
    now?: () => number;
}): EmbeddedRunStageTracker;
/** Returns true when either total runtime or any single stage exceeds warning thresholds. */
export declare function shouldWarnEmbeddedRunStageSummary(summary: EmbeddedRunStageSummary, options?: {
    totalThresholdMs?: number;
    stageThresholdMs?: number;
}): boolean;
/** Formats stage timing into compact log text for startup/attempt diagnostics. */
export declare function formatEmbeddedRunStageSummary(prefix: string, summary: EmbeddedRunStageSummary): string;
export {};

import type { RunRecord, RunState, TerminationReason } from "./types.js";
export type RunRegistry = {
    add: (record: RunRecord) => void;
    get: (runId: string) => RunRecord | undefined;
    updateState: (runId: string, state: RunState, patch?: Partial<Pick<RunRecord, "pid" | "terminationReason" | "exitCode" | "exitSignal">>) => RunRecord | undefined;
    touchOutput: (runId: string) => void;
    finalize: (runId: string, exit: {
        reason: TerminationReason;
        exitCode: number | null;
        exitSignal: NodeJS.Signals | number | null;
    }) => {
        record: RunRecord;
        firstFinalize: boolean;
    } | null;
};
/**
 * Create the supervisor's mutable run registry. Exited records are retained
 * only for diagnostics, so the cap bounds memory without touching live runs.
 */
export declare function createRunRegistry(options?: {
    maxExitedRecords?: number;
}): RunRegistry;

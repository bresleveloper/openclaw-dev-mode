/**
 * Guards against repeated tool-loop compactions that never make progress.
 */
import type { ToolLoopPostCompactionGuardConfig } from "../../config/types.tools.js";
type PostCompactionGuardObservation = {
    toolName: string;
    argsHash: string;
    resultHash: string;
};
type PostCompactionGuardVerdict = {
    shouldAbort: false;
    armed: boolean;
    remainingAttempts: number;
} | {
    shouldAbort: true;
    armed: boolean;
    remainingAttempts: number;
    detector: "compaction_loop_persisted";
    count: number;
    toolName: string;
    message: string;
};
type PostCompactionLoopGuard = {
    armPostCompaction: () => void;
    observe: (call: PostCompactionGuardObservation) => PostCompactionGuardVerdict;
    snapshot: () => {
        armed: boolean;
        remainingAttempts: number;
    };
};
/** Creates a stateful post-compaction loop detector for one embedded run. */
export declare function createPostCompactionLoopGuard(config?: ToolLoopPostCompactionGuardConfig, options?: {
    enabled?: boolean;
}): PostCompactionLoopGuard;
/** Error raised when the post-compaction loop guard aborts a run. */
export declare class PostCompactionLoopPersistedError extends Error {
    readonly detector: "compaction_loop_persisted";
    readonly count: number;
    readonly toolName: string;
    constructor(message: string, details: {
        detector: "compaction_loop_persisted";
        count: number;
        toolName: string;
    });
    static fromVerdict(verdict: Extract<PostCompactionGuardVerdict, {
        shouldAbort: true;
    }>): PostCompactionLoopPersistedError;
}
export {};

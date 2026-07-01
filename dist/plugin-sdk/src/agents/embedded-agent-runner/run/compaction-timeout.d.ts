/**
 * Computes run timeout behavior while compaction is in progress.
 */
import type { AgentMessage } from "../../runtime/index.js";
/** Timeout state used to distinguish normal run deadlines from compaction stalls. */
type CompactionTimeoutSignal = {
    isTimeout: boolean;
    isCompactionPendingOrRetrying: boolean;
    isCompactionInFlight: boolean;
};
/** Flags only run-timeout events that overlap pending, retrying, or active compaction work. */
export declare function shouldFlagCompactionTimeout(signal: CompactionTimeoutSignal): boolean;
/**
 * Grants a single timeout grace window when compaction is still responsible for
 * the delay. A second timeout, or a timeout unrelated to compaction, aborts the
 * run instead of extending indefinitely.
 */
export declare function resolveRunTimeoutDuringCompaction(params: {
    isCompactionPendingOrRetrying: boolean;
    isCompactionInFlight: boolean;
    graceAlreadyUsed: boolean;
}): "extend" | "abort";
/** Candidate transcript snapshots available when a timeout fires during compaction. */
type SnapshotSelectionParams = {
    timedOutDuringCompaction: boolean;
    preCompactionSnapshot: AgentMessage[] | null;
    preCompactionSessionId: string;
    currentSnapshot: AgentMessage[];
    currentSessionId: string;
};
/** Snapshot chosen for retry/replay after a compaction-related timeout. */
type SnapshotSelection = {
    messagesSnapshot: AgentMessage[];
    sessionIdUsed: string;
    source: "pre-compaction" | "current";
};
/**
 * Selects the transcript snapshot used after a compaction timeout. Prefer the
 * pre-compaction view when it can be continued cleanly; otherwise fall back to a
 * trimmed current snapshot so retry does not replay past an unsafe tail.
 */
export declare function selectCompactionTimeoutSnapshot(params: SnapshotSelectionParams): SnapshotSelection;
export {};

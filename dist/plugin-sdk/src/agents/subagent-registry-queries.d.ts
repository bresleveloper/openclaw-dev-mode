/**
 * Pure subagent registry query helpers.
 *
 * Keeps tree traversal and filtering independent from persistence and mutable process state.
 */
import type { DeliveryContext } from "../utils/delivery-context.types.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Lists requester-owned runs, optionally scoped to the lifetime of a requester run. */
export declare function listRunsForRequesterFromRuns(runs: Map<string, SubagentRunRecord>, requesterSessionKey: string, options?: {
    requesterRunId?: string;
}): SubagentRunRecord[];
/** Lists runs controlled by the normalized controller session key. */
export declare function listRunsForControllerFromRuns(runs: Map<string, SubagentRunRecord>, controllerSessionKey: string): SubagentRunRecord[];
/** Cached read index for display, controller grouping, and descendant counts. */
export type SubagentRunReadIndex = {
    getDisplaySubagentRun(childSessionKey: string): SubagentRunRecord | null;
    countActiveDescendantRuns(rootSessionKey: string): number;
    runsByControllerSessionKey: ReadonlyMap<string, readonly SubagentRunRecord[]>;
};
/** Builds a read index from snapshot and optional in-memory runs. */
export declare function buildSubagentRunReadIndexFromRuns(params: {
    runs: Map<string, SubagentRunRecord>;
    inMemoryRuns?: Iterable<SubagentRunRecord>;
    now?: number;
}): SubagentRunReadIndex;
/** Returns whether the latest run for a child session is still live. */
export declare function isSubagentSessionRunActiveFromRuns(runs: Map<string, SubagentRunRecord>, childSessionKey: string): boolean;
/** Returns the preferred run for a child session, active first then latest ended. */
export declare function getSubagentRunByChildSessionKeyFromRuns(runs: Map<string, SubagentRunRecord>, childSessionKey: string): SubagentRunRecord | null;
/** Resolves the requester and delivery origin for the latest child-session run. */
export declare function resolveRequesterForChildSessionFromRuns(runs: Map<string, SubagentRunRecord>, childSessionKey: string): {
    requesterSessionKey: string;
    requesterOrigin?: DeliveryContext;
} | null;
/** Returns whether post-completion announce should be skipped for a cleaned-up run. */
export declare function shouldIgnorePostCompletionAnnounceForSessionFromRuns(runs: Map<string, SubagentRunRecord>, childSessionKey: string): boolean;
/** Counts active direct child runs plus completed children that still have pending descendants. */
export declare function countActiveRunsForSessionFromRuns(runs: Map<string, SubagentRunRecord>, controllerSessionKey: string): number;
/** Counts live descendants under a requester/session tree. */
export declare function countActiveDescendantRunsFromRuns(runs: Map<string, SubagentRunRecord>, rootSessionKey: string): number;
/** Counts descendants that are live or ended but not yet cleaned up. */
export declare function countPendingDescendantRunsFromRuns(runs: Map<string, SubagentRunRecord>, rootSessionKey: string): number;
/** Counts pending descendants while excluding one run id from the total. */
export declare function countPendingDescendantRunsExcludingRunFromRuns(runs: Map<string, SubagentRunRecord>, rootSessionKey: string, excludeRunId: string): number;
/** Lists latest descendant runs under a requester/session tree. */
export declare function listDescendantRunsForRequesterFromRuns(runs: Map<string, SubagentRunRecord>, rootSessionKey: string): SubagentRunRecord[];

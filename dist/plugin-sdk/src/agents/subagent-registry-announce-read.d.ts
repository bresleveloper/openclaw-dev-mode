import type { DeliveryContext } from "../utils/delivery-context.types.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Resolves the requester session and origin for a child subagent session. */
export declare function resolveRequesterForChildSession(childSessionKey: string): {
    requesterSessionKey: string;
    requesterOrigin?: DeliveryContext;
} | null;
/** True when a subagent session still has an active run record. */
export declare function isSubagentSessionRunActive(childSessionKey: string): boolean;
/** True when post-completion announce should be skipped for a child session. */
export declare function shouldIgnorePostCompletionAnnounceForSession(childSessionKey: string): boolean;
/** Lists subagent runs requested by one session key. */
export declare function listSubagentRunsForRequester(requesterSessionKey: string, options?: {
    requesterRunId?: string;
}): SubagentRunRecord[];
/** Counts pending descendant subagent runs below a root session. */
export declare function countPendingDescendantRuns(rootSessionKey: string): number;
/** Counts pending descendant runs while excluding one run id. */
export declare function countPendingDescendantRunsExcludingRun(rootSessionKey: string, excludeRunId: string): number;

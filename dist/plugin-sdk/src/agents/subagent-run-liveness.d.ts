/**
 * Subagent run liveness policy.
 *
 * Ages out stale unended runs while keeping recent/composed child links visible.
 */
import type { SubagentRunRecord } from "./subagent-registry.types.js";
export declare const RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS: number;
/** Return whether a subagent run has a finite endedAt timestamp. */
export declare function hasSubagentRunEnded<T extends Pick<SubagentRunRecord, "endedAt">>(entry: T): entry is T & {
    endedAt: number;
};
/** Return whether an unended subagent run is stale enough to hide as inactive. */
export declare function isStaleUnendedSubagentRun(entry: Pick<SubagentRunRecord, "createdAt" | "startedAt" | "sessionStartedAt" | "endedAt" | "runTimeoutSeconds">, now?: number): boolean;
/** Return whether a subagent run is still live and unended. */
export declare function isLiveUnendedSubagentRun(entry: Pick<SubagentRunRecord, "createdAt" | "startedAt" | "sessionStartedAt" | "endedAt" | "runTimeoutSeconds">, now?: number): boolean;
/** Return whether a child-session link should still appear in subagent listings. */
export declare function shouldKeepSubagentRunChildLink(entry: Pick<SubagentRunRecord, "createdAt" | "startedAt" | "sessionStartedAt" | "endedAt" | "runTimeoutSeconds">, options?: {
    activeDescendants?: number;
    now?: number;
}): boolean;

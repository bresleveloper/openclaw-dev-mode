import { type SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SubagentRunOutcome } from "./subagent-announce-output.js";
import { type SubagentLifecycleEndedReason } from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
export type SubagentSessionStoreCache = Map<string, Record<string, SessionEntry>>;
export type SubagentRunOrphanReason = "missing-session-entry" | "missing-session-id" | "stale-unended-run";
/** Completion inferred from the child session store. */
export type SubagentSessionCompletion = {
    startedAt?: number;
    endedAt: number;
    outcome: SubagentRunOutcome;
    reason: SubagentLifecycleEndedReason;
};
/** Load a child session entry using the agent-specific session store path. */
export declare function loadSubagentSessionEntry(params: {
    childSessionKey: string;
    storeCache?: SubagentSessionStoreCache;
    cfg?: OpenClawConfig;
}): SessionEntry | undefined;
/** Resolves whether a registry row is orphaned from its child session entry. */
export declare function resolveSubagentRunOrphanReason(params: {
    entry: SubagentRunRecord;
    includeStaleUnended?: boolean;
    now?: number;
    cfg?: OpenClawConfig;
}): SubagentRunOrphanReason | null;
/** Convert persisted session status into a subagent completion outcome. */
export declare function resolveCompletionFromSessionEntry(sessionEntry: SessionEntry | undefined, fallbackEndedAt: number, opts?: {
    notBeforeMs?: number;
}): SubagentSessionCompletion | null;
/** Resolve child completion by reading its persisted session entry. */
export declare function resolveSubagentSessionCompletion(params: {
    childSessionKey: string;
    fallbackEndedAt: number;
    notBeforeMs?: number;
    storeCache?: SubagentSessionStoreCache;
    cfg?: OpenClawConfig;
}): SubagentSessionCompletion | null;
/** Resolve a fresh child session start time for lifecycle reconciliation. */
export declare function resolveSubagentSessionStartedAt(params: {
    childSessionKey: string;
    notBeforeMs?: number;
    storeCache?: SubagentSessionStoreCache;
    cfg?: OpenClawConfig;
}): number | undefined;

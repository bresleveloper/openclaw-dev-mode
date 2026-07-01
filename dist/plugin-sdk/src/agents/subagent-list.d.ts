import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
type SubagentListItem = {
    index: number;
    line: string;
    runId: string;
    sessionKey: string;
    taskName?: string;
    label: string;
    task: string;
    status: string;
    pendingDescendants: number;
    runtime: string;
    runtimeMs: number;
    childSessions?: string[];
    model?: string;
    totalTokens?: number;
    startedAt?: number;
    endedAt?: number;
};
type BuiltSubagentList = {
    total: number;
    active: SubagentListItem[];
    recent: SubagentListItem[];
    text: string;
};
type SessionEntryResolution = {
    storePath: string;
    entry: SessionEntry | undefined;
};
/** Resolve persisted session metadata for a session key, caching per store path. */
export declare function resolveSessionEntryForKey(params: {
    cfg: OpenClawConfig;
    key: string;
    cache: Map<string, Record<string, SessionEntry>>;
}): SessionEntryResolution;
/** Build child-session indexes from the latest run associated with each child key. */
export declare function buildLatestSubagentRunIndex(runs: Map<string, SubagentRunRecord>, options?: {
    now?: number;
}): {
    latestByChildSessionKey: Map<string, SubagentRunRecord>;
    childSessionsByController: Map<string, string[]>;
};
/** Build structured and text views for active and recent subagent runs. */
export declare function buildSubagentList(params: {
    cfg: OpenClawConfig;
    runs: SubagentRunRecord[];
    recentMinutes: number;
    taskMaxChars?: number;
}): BuiltSubagentList;
export {};

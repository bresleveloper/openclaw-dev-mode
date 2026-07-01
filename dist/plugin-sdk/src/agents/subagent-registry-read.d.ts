import { type SubagentRunReadIndex } from "./subagent-registry-queries.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
export { getSubagentSessionRuntimeMs, getSubagentSessionStartedAt, resolveSubagentSessionStatus, } from "./subagent-session-metrics.js";
/** Builds a reusable read index from the current persisted and in-memory run state. */
export declare function buildSubagentRunReadIndex(now?: number): SubagentRunReadIndex;
/** Lists runs controlled by a session key. */
export declare function listSubagentRunsForController(controllerSessionKey: string): SubagentRunRecord[];
/** Counts active descendant runs for a requester/session tree. */
export declare function countActiveDescendantRuns(rootSessionKey: string): number;
/** Lists descendant runs under a requester/session tree. */
export declare function listDescendantRunsForRequester(rootSessionKey: string): SubagentRunRecord[];
/** Returns the preferred run for a child session, favoring active over ended runs. */
export declare function getSubagentRunByChildSessionKey(childSessionKey: string): SubagentRunRecord | null;
/** Returns whether a registry entry still has a live agent run context. */
export declare function isSubagentRunLive(entry: Pick<SubagentRunRecord, "runId" | "endedAt"> | null | undefined): boolean;
/** Returns the run to display for a child session, using live memory before snapshot state. */
export declare function getSessionDisplaySubagentRunByChildSessionKey(childSessionKey: string): SubagentRunRecord | null;
/** Returns the most recently created run for a child session from readable registry state. */
export declare function getLatestSubagentRunByChildSessionKey(childSessionKey: string): SubagentRunRecord | null;

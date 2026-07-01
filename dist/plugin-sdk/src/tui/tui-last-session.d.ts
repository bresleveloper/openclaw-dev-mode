import type { TuiSessionList } from "./tui-backend.js";
import type { SessionScope } from "./tui-types.js";
/** Resolves the private state file for remembered TUI sessions. */
export declare function resolveTuiLastSessionStatePath(stateDir?: string): string;
/** Builds a stable private-store key for the current TUI connection, agent, and session scope. */
export declare function buildTuiLastSessionScopeKey(params: {
    connectionUrl: string;
    agentId: string;
    sessionScope: SessionScope;
}): string;
/** Detects heartbeat/system sessions that should not become the remembered human session. */
export declare function isHeartbeatLikeTuiSession(session: TuiSessionList["sessions"][number]): boolean;
/** Reads the remembered session key for a scope, ignoring missing or malformed stores. */
export declare function readTuiLastSessionKey(params: {
    scopeKey: string;
    stateDir?: string;
}): Promise<string | null>;
/** Writes the remembered session key unless it is empty, unknown, or heartbeat-owned. */
export declare function writeTuiLastSessionKey(params: {
    scopeKey: string;
    sessionKey: string;
    stateDir?: string;
}): Promise<void>;
/** Resolves a remembered key to a currently listed session for the active agent. */
export declare function resolveRememberedTuiSessionKey(params: {
    rememberedKey: string | null | undefined;
    currentAgentId: string;
    sessions: TuiSessionList["sessions"];
}): string | null;

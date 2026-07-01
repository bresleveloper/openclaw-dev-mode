import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolved role for a main session, orchestrating subagent, or leaf subagent. */
export type SubagentSessionRole = "main" | "orchestrator" | "leaf";
type SubagentControlScope = "children" | "none";
type SessionCapabilityEntry = {
    sessionId?: unknown;
    spawnDepth?: unknown;
    subagentRole?: unknown;
    subagentControlScope?: unknown;
    spawnedBy?: unknown;
    inheritedToolAllow?: unknown;
    inheritedToolDeny?: unknown;
};
/** Minimal persisted session-store shape needed to resolve subagent capabilities. */
export type SessionCapabilityStore = Record<string, {
    sessionId?: unknown;
    spawnDepth?: unknown;
    subagentRole?: unknown;
    subagentControlScope?: unknown;
    spawnedBy?: unknown;
    inheritedToolAllow?: unknown;
    inheritedToolDeny?: unknown;
}>;
/** Resolve the session-store subset used for subagent capability lookup. */
export declare function resolveSubagentCapabilityStore(sessionKey: string | undefined | null, opts?: {
    cfg?: OpenClawConfig;
    store?: SessionCapabilityStore;
}): SessionCapabilityStore | undefined;
/** Resolve depth-derived role, scope, and spawn/control booleans. */
export declare function resolveSubagentCapabilities(params: {
    depth: number;
    maxSpawnDepth?: number;
}): {
    depth: number;
    role: SubagentSessionRole;
    controlScope: SubagentControlScope;
    canSpawn: boolean;
    canControlChildren: boolean;
};
/** Return true when a session key or persisted ACP envelope represents a subagent. */
export declare function isSubagentEnvelopeSession(sessionKey: string | undefined | null, opts?: {
    cfg?: OpenClawConfig;
    store?: SessionCapabilityStore;
    entry?: SessionCapabilityEntry;
}): boolean;
/**
 * Resolve the effective subagent role/scope, combining stored envelope metadata
 * with depth-derived fallback behavior.
 */
export declare function resolveStoredSubagentCapabilities(sessionKey: string | undefined | null, opts?: {
    cfg?: OpenClawConfig;
    store?: SessionCapabilityStore;
}): {
    depth: number;
    role: SubagentSessionRole;
    controlScope: SubagentControlScope;
    canSpawn: boolean;
    canControlChildren: boolean;
};
/** Resolve inherited tool deny rules stored on a subagent envelope. */
export declare function resolveStoredSubagentInheritedToolDenylist(sessionKey: string | undefined | null, opts?: {
    cfg?: OpenClawConfig;
    store?: SessionCapabilityStore;
}): string[];
/** Resolve inherited tool allow rules stored on a subagent envelope. */
export declare function resolveStoredSubagentInheritedToolAllowlist(sessionKey: string | undefined | null, opts?: {
    cfg?: OpenClawConfig;
    store?: SessionCapabilityStore;
}): string[];
export {};

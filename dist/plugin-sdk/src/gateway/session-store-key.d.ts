import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Canonicalize an opaque session key into the agent-scoped store namespace. */
export declare function canonicalizeSessionKeyForAgent(agentId: string, key: string): string;
/** Resolve any incoming session key into the canonical key used in persisted session stores. */
export declare function resolveSessionStoreKey(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    storeAgentId?: string;
}): string;
/** Resolve the agent that owns a canonical session-store key. */
export declare function resolveSessionStoreAgentId(cfg: OpenClawConfig, canonicalKey: string): string;
/** Resolve a session key for lookup inside a specific agent's store. */
export declare function resolveStoredSessionKeyForAgentStore(params: {
    cfg: OpenClawConfig;
    agentId: string;
    sessionKey: string;
}): string;
/** Resolve the owner agent for a stored session key, returning null for global/unknown keys. */
export declare function resolveStoredSessionOwnerAgentId(params: {
    cfg: OpenClawConfig;
    agentId: string;
    sessionKey: string;
}): string | null;
/** Canonicalize spawned-by parent references while preserving main-session aliases. */
export declare function canonicalizeSpawnedByForAgent(cfg: OpenClawConfig, agentId: string, spawnedBy?: string): string | undefined;

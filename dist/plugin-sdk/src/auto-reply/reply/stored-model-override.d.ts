import type { SessionEntry } from "../../config/sessions/types.js";
/** Model override loaded from the current session or its parent session. */
export type StoredModelOverride = {
    provider?: string;
    model: string;
    source: "session" | "parent";
};
/** Resolves the persisted model override visible to the current session. */
export declare function resolveStoredModelOverride(params: {
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    parentSessionKey?: string;
    defaultProvider: string;
}): StoredModelOverride | null;
/** Detects heartbeat auto-fallback overrides that no longer match the primary model. */
export declare function isStaleHeartbeatAutoFallbackOverride(params: {
    isHeartbeat?: boolean;
    hasResolvedHeartbeatModelOverride?: boolean;
    sessionEntry?: SessionEntry;
    storedOverride?: StoredModelOverride | null;
    defaultProvider: string;
    defaultModel: string;
    primaryProvider?: string;
    primaryModel?: string;
}): boolean;

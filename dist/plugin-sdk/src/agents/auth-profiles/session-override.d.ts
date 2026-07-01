/**
 * Session-level auth profile override rotation.
 * Keeps automatic profile choice stable within a session while still rotating
 * across new sessions, compactions, provider changes, and cooldowns.
 */
import type { SessionEntry } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Clears an auth-profile override from a session and persists it when possible. */
export declare function clearSessionAuthProfileOverride(params: {
    sessionEntry: SessionEntry;
    sessionStore: Record<string, SessionEntry>;
    sessionKey: string;
    storePath?: string;
}): Promise<void>;
/** Resolves and optionally rotates the session auth-profile override. */
export declare function resolveSessionAuthProfileOverride(params: {
    cfg: OpenClawConfig;
    provider: string;
    agentDir: string;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
    isNewSession: boolean;
    acceptedProviderIds?: string[];
}): Promise<string | undefined>;

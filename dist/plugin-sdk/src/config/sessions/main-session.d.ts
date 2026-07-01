import { resolveAgentIdFromSessionKey } from "../../routing/session-key.js";
import type { SessionScope } from "./types.js";
/** Resolves the configured main session key, honoring global session scope. */
export declare function resolveMainSessionKey(cfg?: {
    session?: {
        scope?: SessionScope;
        mainKey?: string;
    };
    agents?: {
        list?: Array<{
            id?: string;
            default?: boolean;
        }>;
    };
}): string;
export { resolveAgentIdFromSessionKey };
/** Resolves the main session key for one explicit agent. */
export declare function resolveAgentMainSessionKey(params: {
    cfg?: {
        session?: {
            mainKey?: string;
        };
    };
    agentId: string;
}): string;
/** Resolves an explicit agent id to its canonical main session key. */
export declare function resolveExplicitAgentSessionKey(params: {
    cfg?: {
        session?: {
            scope?: SessionScope;
            mainKey?: string;
        };
    };
    agentId?: string | null;
}): string | undefined;
/** Canonicalizes main-session aliases to the current scoped session key. */
export declare function canonicalizeMainSessionAlias(params: {
    cfg?: {
        session?: {
            scope?: SessionScope;
            mainKey?: string;
        };
    };
    agentId: string;
    sessionKey: string;
}): string;

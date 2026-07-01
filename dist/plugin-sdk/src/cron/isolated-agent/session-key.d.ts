import type { SessionScope } from "../../config/sessions/types.js";
/** Resolves a cron session key into the canonical agent-scoped session-store key. */
export declare function resolveCronAgentSessionKey(params: {
    sessionKey: string;
    agentId: string;
    mainKey?: string | undefined;
    cfg?: {
        session?: {
            scope?: SessionScope;
            mainKey?: string;
        };
    };
}): string;

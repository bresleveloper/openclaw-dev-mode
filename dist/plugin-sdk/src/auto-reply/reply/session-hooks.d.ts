import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginHookSessionEndEvent, PluginHookSessionEndReason, PluginHookSessionStartEvent } from "../../plugins/hook-types.js";
/** Session identity attached to plugin session hook payloads. */
type SessionHookContext = {
    sessionId: string;
    sessionKey: string;
    agentId: string;
};
/** Builds the payload for plugin session-start hooks. */
export declare function buildSessionStartHookPayload(params: {
    sessionId: string;
    sessionKey: string;
    cfg: OpenClawConfig;
    resumedFrom?: string;
}): {
    event: PluginHookSessionStartEvent;
    context: SessionHookContext;
};
/** Builds the payload for plugin session-end hooks. */
export declare function buildSessionEndHookPayload(params: {
    sessionId: string;
    sessionKey: string;
    cfg: OpenClawConfig;
    messageCount?: number;
    durationMs?: number;
    reason?: PluginHookSessionEndReason;
    sessionFile?: string;
    transcriptArchived?: boolean;
    nextSessionId?: string;
    nextSessionKey?: string;
}): {
    event: PluginHookSessionEndEvent;
    context: SessionHookContext;
};
export {};

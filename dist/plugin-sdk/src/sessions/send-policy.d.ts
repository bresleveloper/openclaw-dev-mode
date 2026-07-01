import type { SessionChatType, SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Session send-policy decision after config and per-session overrides are evaluated. */
export type SessionSendPolicyDecision = "allow" | "deny";
/** Normalizes raw send-policy text into a decision. */
export declare function normalizeSendPolicy(raw?: string | null): SessionSendPolicyDecision | undefined;
/** Resolves whether a session send is allowed by entry override and config rules. */
export declare function resolveSendPolicy(params: {
    cfg: OpenClawConfig;
    entry?: SessionEntry;
    sessionKey?: string;
    channel?: string;
    chatType?: SessionChatType;
}): SessionSendPolicyDecision;

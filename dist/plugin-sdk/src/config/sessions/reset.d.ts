import type { SessionConfig, SessionResetConfig } from "../types.base.js";
/** Public reset policy exports plus helpers that classify direct, group, and thread sessions. */
export { DEFAULT_RESET_AT_HOUR, DEFAULT_RESET_MODE, evaluateSessionFreshness, resolveDailyResetAtMs, resolveSessionResetPolicy, type SessionFreshness, type SessionResetMode, type SessionResetPolicy, type SessionResetType, } from "./reset-policy.js";
import type { SessionResetType } from "./reset-policy.js";
/** Returns true when a session key is known to represent a thread. */
export declare function isThreadSessionKey(sessionKey?: string | null): boolean;
export declare function resolveSessionResetType(params: {
    sessionKey?: string | null;
    isGroup?: boolean;
    isThread?: boolean;
}): SessionResetType;
export declare function resolveThreadFlag(params: {
    sessionKey?: string | null;
    messageThreadId?: string | number | null;
    threadLabel?: string | null;
    threadStarterBody?: string | null;
    parentSessionKey?: string | null;
}): boolean;
export declare function resolveChannelResetConfig(params: {
    sessionCfg?: SessionConfig;
    channel?: string | null;
}): SessionResetConfig | undefined;

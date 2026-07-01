import type { SessionConfig, SessionResetConfig } from "../types.base.js";
export type SessionResetMode = "daily" | "idle";
export type SessionResetType = "direct" | "group" | "thread";
export type SessionResetPolicy = {
    mode: SessionResetMode;
    atHour: number;
    idleMinutes?: number;
    configured?: boolean;
};
export type SessionFreshness = {
    fresh: boolean;
    dailyResetAt?: number;
    idleExpiresAt?: number;
    staleReason?: SessionResetMode;
};
export declare const DEFAULT_RESET_MODE: SessionResetMode;
export declare const DEFAULT_RESET_AT_HOUR = 4;
/** Returns the most recent daily reset boundary for the supplied wall-clock time. */
export declare function resolveDailyResetAtMs(now: number, atHour: number): number;
/** Resolves the effective reset policy for direct, group, or thread sessions. */
export declare function resolveSessionResetPolicy(params: {
    sessionCfg?: SessionConfig;
    resetType: SessionResetType;
    resetOverride?: SessionResetConfig;
}): SessionResetPolicy;
/** Evaluates whether a persisted session is still fresh under the resolved reset policy. */
export declare function evaluateSessionFreshness(params: {
    updatedAt: number;
    sessionStartedAt?: number;
    lastInteractionAt?: number;
    now: number;
    policy: SessionResetPolicy;
}): SessionFreshness;

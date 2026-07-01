import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { FailoverReason } from "./embedded-agent-helpers/types.js";
export declare const DEFAULT_QUOTA_SUSPENSION_RESUME_MS: number;
export type SessionSuspensionReason = "quota_exhausted" | "manual" | "circuit_open";
export type SessionSuspensionTarget = {
    mode: "defer";
    defer: (params: SessionSuspensionParams) => void;
} | {
    mode: "suspend";
};
export type SessionSuspensionParams = {
    cfg: OpenClawConfig | undefined;
    agentDir?: string;
    sessionId: string;
    laneId?: string;
    reason: SessionSuspensionReason;
    failedProvider: string;
    failedModel: string;
    summary?: string;
    ttlMs?: number;
};
declare function resolveLaneResumeConcurrency(cfg: OpenClawConfig | undefined, laneId: string): number;
export declare function resolveSessionSuspensionReason(reason: FailoverReason): SessionSuspensionReason;
export declare function runWithDeferredSessionSuspension<T>(run: () => Promise<T>, onDeferred?: (params: SessionSuspensionParams) => void): Promise<T>;
export declare function resolveSessionSuspensionTarget(): SessionSuspensionTarget;
export declare function suspendSession(params: SessionSuspensionParams): Promise<void>;
export declare const testing: {
    readonly resolveLaneResumeConcurrency: typeof resolveLaneResumeConcurrency;
    readonly resolveSessionSuspensionReason: typeof resolveSessionSuspensionReason;
};
export { testing as __testing };

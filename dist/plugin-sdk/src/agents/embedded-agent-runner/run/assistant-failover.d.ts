import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { AssistantMessage } from "../../../llm/types.js";
import type { AuthProfileFailureReason } from "../../auth-profiles.js";
import { type FailoverReason } from "../../embedded-agent-helpers.js";
import { FailoverError } from "../../failover-error.js";
import { type AssistantFailoverDecision } from "./failover-policy.js";
type AssistantFailoverOutcome = {
    action: "continue_normal";
    overloadProfileRotations: number;
} | {
    action: "retry";
    overloadProfileRotations: number;
    lastRetryFailoverReason: FailoverReason | null;
    retryKind?: "same_model_idle_timeout" | "same_model_rate_limit";
} | {
    action: "throw";
    overloadProfileRotations: number;
    error: FailoverError;
};
type ShortWindowRateLimitRetry = {
    retryAfterSeconds?: number;
};
export declare function isShortWindowRateLimitMessage(message: string | undefined): boolean;
/**
 * Applies an assistant-stage failover decision and returns the next run action.
 * It owns auth-profile rotation, overload/rate-limit escalation, same-model
 * idle-timeout retry, and FailoverError construction for outer model fallback.
 */
export declare function handleAssistantFailover(params: {
    initialDecision: AssistantFailoverDecision;
    aborted: boolean;
    externalAbort: boolean;
    fallbackConfigured: boolean;
    failoverFailure: boolean;
    failoverReason: FailoverReason | null;
    timedOut: boolean;
    idleTimedOut: boolean;
    timedOutDuringCompaction: boolean;
    timedOutDuringToolExecution: boolean;
    allowSameModelIdleTimeoutRetry: boolean;
    allowSameModelRateLimitRetry: boolean;
    assistantProfileFailureReason: AuthProfileFailureReason | null;
    lastProfileId?: string;
    modelId: string;
    provider: string;
    activeErrorContext: {
        provider: string;
        model: string;
    };
    lastAssistant: AssistantMessage | undefined;
    config: OpenClawConfig | undefined;
    sessionKey?: string;
    authFailure: boolean;
    rateLimitFailure: boolean;
    billingFailure: boolean;
    /** Credential auth mode (e.g. "oauth", "token", "api_key") for billing copy (#80877). */
    authMode?: string;
    cloudCodeAssistFormatError: boolean;
    isProbeSession: boolean;
    overloadProfileRotations: number;
    overloadProfileRotationLimit: number;
    previousRetryFailoverReason: FailoverReason | null;
    logAssistantFailoverDecision: (decision: "rotate_profile" | "fallback_model" | "surface_error", extra?: {
        status?: number;
    }) => void;
    warn: (message: string) => void;
    maybeMarkAuthProfileFailure: (failure: {
        profileId?: string;
        reason?: AuthProfileFailureReason | null;
        modelId?: string;
    }) => Promise<void>;
    maybeEscalateRateLimitProfileFallback: (params: {
        failoverProvider: string;
        failoverModel: string;
        logFallbackDecision: (decision: "fallback_model", extra?: {
            status?: number;
        }) => void;
    }) => void;
    maybeRetrySameModelRateLimit: (retry?: ShortWindowRateLimitRetry) => Promise<boolean>;
    maybeBackoffBeforeOverloadFailover: (reason: FailoverReason | null) => Promise<void>;
    advanceAuthProfile: () => Promise<boolean>;
}): Promise<AssistantFailoverOutcome>;
export {};

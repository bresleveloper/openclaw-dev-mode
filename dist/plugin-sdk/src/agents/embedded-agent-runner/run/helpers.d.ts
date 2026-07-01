/**
 * Shared run helpers for retry limits, model reporting, and final text.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { AssistantMessage } from "../../../llm/types.js";
import type { EmbeddedAgentMeta } from "../types.js";
import { type UsageAccumulator } from "../usage-accumulator.js";
type UsageSnapshot = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
};
export type RuntimeAuthState = {
    generation: number;
    sourceApiKey: string;
    authMode: string;
    profileId?: string;
    expiresAt?: number;
    refreshTimer?: ReturnType<typeof setTimeout>;
    refreshInFlight?: Promise<void>;
};
export declare const RUNTIME_AUTH_REFRESH_MARGIN_MS: number;
export declare const RUNTIME_AUTH_REFRESH_RETRY_MS: number;
export declare const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS: number;
export declare const MAX_SAME_MODEL_RATE_LIMIT_RETRIES = 3;
export declare function resolveOverloadFailoverBackoffMs(cfg?: OpenClawConfig): number;
export declare function resolveOverloadProfileRotationLimit(cfg?: OpenClawConfig): number;
export declare function resolveRateLimitProfileRotationLimit(cfg?: OpenClawConfig): number;
/**
 * Backoff before the next same-model rate_limit retry, given how many such
 * retries already happened. Linear and deterministic (no jitter) so RPM
 * windows clear predictably and tests can assert exact values.
 */
export declare function resolveSameModelRateLimitRetryDelayMs(params: {
    retriesSoFar: number;
    retryAfterSeconds?: number;
}): number;
export declare function resolveNextSameModelRateLimitRetryCount(params: {
    retriesSoFar: number;
    retriedSameModelRateLimit: boolean;
}): number;
export declare function scrubAnthropicRefusalMagic(prompt: string): string;
export declare function createCompactionDiagId(): string;
export declare function resolveMaxRunRetryIterations(profileCandidateCount: number, cfg?: OpenClawConfig, agentId?: string): number;
export declare function resolveActiveErrorContext(params: {
    provider: string;
    model: string;
    assistant?: {
        provider?: string;
        model?: string;
    };
}): {
    provider: string;
    model: string;
};
export declare function isAssistantForModelRef(assistant: {
    provider?: string;
    model?: string;
} | undefined, ref: {
    provider: string;
    model: string;
}): boolean;
export declare function resolveReportedModelRef(params: {
    provider: string;
    model: string;
    assistant?: {
        provider?: string;
        model?: string;
    } | null;
}): {
    provider: string;
    model: string;
};
export declare function buildUsageAgentMetaFields(params: {
    usageAccumulator: UsageAccumulator;
    lastAssistantUsage?: UsageSnapshot | null;
    lastRunPromptUsage: UsageSnapshot | undefined;
    lastTurnTotal?: number;
}): Pick<EmbeddedAgentMeta, "usage" | "lastCallUsage" | "promptTokens">;
/**
 * Build agentMeta for error return paths, preserving accumulated usage so that
 * session totalTokens reflects the actual context size rather than going stale.
 * Without this, error returns omit usage and the session keeps whatever
 * totalTokens was set by the previous successful run.
 */
export declare function buildErrorAgentMeta(params: {
    sessionId: string;
    sessionFile?: string;
    provider: string;
    model: string;
    contextTokens?: number;
    usageAccumulator: UsageAccumulator;
    lastRunPromptUsage: UsageSnapshot | undefined;
    lastAssistant?: {
        usage?: unknown;
    } | null;
    lastTurnTotal?: number;
}): EmbeddedAgentMeta;
export declare function resolveFinalAssistantVisibleText(lastAssistant: AssistantMessage | undefined): string | undefined;
export declare function resolveFinalAssistantRawText(lastAssistant: AssistantMessage | undefined): string | undefined;
export {};

import type { FailoverReason } from "./embedded-agent-helpers.js";
import type { FallbackAttempt, ModelCandidate } from "./model-fallback.types.js";
/** Return whether fallback decision logging is enabled for warn-level events. */
export declare function isModelFallbackDecisionLogEnabled(): boolean;
export declare function resetModelFallbackDecisionLogCoalescingForTest(): void;
type FallbackStepOutcome = "next_fallback" | "succeeded" | "chain_exhausted";
/** Structured fields that describe one fallback-chain transition. */
export type ModelFallbackStepFields = {
    fallbackStepType: "fallback_step";
    fallbackStepFromModel: string;
    fallbackStepToModel?: string;
    fallbackStepFromFailureReason?: FailoverReason;
    fallbackStepFromFailureDetail?: string;
    fallbackStepChainPosition?: number;
    fallbackStepFinalOutcome: FallbackStepOutcome;
};
/** Input payload for logging one model fallback decision. */
export type ModelFallbackDecisionParams = {
    decision: "skip_candidate" | "probe_cooldown_candidate" | "candidate_failed" | "candidate_succeeded";
    runId?: string;
    sessionId?: string;
    lane?: string;
    requestedProvider: string;
    requestedModel: string;
    candidate: ModelCandidate;
    attempt?: number;
    total?: number;
    reason?: FailoverReason | null;
    status?: number;
    code?: string;
    error?: string;
    nextCandidate?: ModelCandidate;
    isPrimary?: boolean;
    requestedModelMatched?: boolean;
    fallbackConfigured?: boolean;
    allowTransientCooldownProbe?: boolean;
    profileCount?: number;
    previousAttempts?: FallbackAttempt[];
};
/** Log one model fallback decision and return structured fallback-step fields. */
export declare function logModelFallbackDecision(params: ModelFallbackDecisionParams): ModelFallbackStepFields | undefined;
export {};

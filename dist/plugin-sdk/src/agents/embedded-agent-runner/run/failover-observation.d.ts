import type { AuthProfileFailureReason } from "../../auth-profiles.js";
import type { FailoverReason } from "../../embedded-agent-helpers.js";
/** Structured fields emitted whenever embedded run failover chooses an action. */
type FailoverDecisionLoggerInput = {
    stage: "prompt" | "assistant";
    decision: "rotate_profile" | "fallback_model" | "surface_error";
    runId?: string;
    rawError?: string;
    failoverReason: FailoverReason | null;
    profileFailureReason?: AuthProfileFailureReason | null;
    provider: string;
    model: string;
    sourceProvider?: string;
    sourceModel?: string;
    profileId?: string;
    fallbackConfigured: boolean;
    timedOut?: boolean;
    aborted?: boolean;
    status?: number;
};
/** Stable context captured before a concrete failover decision is known. */
type FailoverDecisionLoggerBase = Omit<FailoverDecisionLoggerInput, "decision" | "status">;
/**
 * Derives timeout failure reasons for logs that were built from timeout state
 * before the normal provider error classifier had a raw error to inspect.
 */
export declare function normalizeFailoverDecisionObservationBase(base: FailoverDecisionLoggerBase): FailoverDecisionLoggerBase;
/**
 * Captures sanitized failover context and returns a decision logger. The closure
 * keeps prompt/assistant failover branches consistent while still allowing the
 * final decision and HTTP status to be supplied at the action point.
 */
export declare function createFailoverDecisionLogger(base: FailoverDecisionLoggerBase): (decision: FailoverDecisionLoggerInput["decision"], extra?: Pick<FailoverDecisionLoggerInput, "status">) => void;
export {};

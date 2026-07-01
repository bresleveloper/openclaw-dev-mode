/**
 * Shared candidate and attempt types for model fallback execution.
 */
import type { FailoverReason } from "./embedded-agent-helpers/types.js";
export type ModelCandidate = {
    provider: string;
    model: string;
};
export type FallbackAttempt = {
    provider: string;
    model: string;
    error: string;
    reason?: FailoverReason;
    authMode?: string;
    status?: number;
    code?: string;
};

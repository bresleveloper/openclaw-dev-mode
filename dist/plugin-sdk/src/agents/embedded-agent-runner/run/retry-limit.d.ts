import type { EmbeddedRunLivenessState } from "../types.js";
import type { EmbeddedAgentMeta, EmbeddedAgentRunResult } from "../types.js";
import type { RetryLimitFailoverDecision } from "./failover-policy.js";
/**
 * Converts retry-limit exhaustion into either a failover escalation or a local
 * user-visible error payload. Replay-safe provider failures throw FailoverError
 * so the outer run loop can switch models; non-escalating reasons preserve
 * retry metadata on the returned run result.
 */
export declare function handleRetryLimitExhaustion(params: {
    message: string;
    decision: RetryLimitFailoverDecision;
    provider: string;
    model: string;
    profileId?: string;
    durationMs: number;
    agentMeta: EmbeddedAgentMeta;
    replayInvalid?: boolean;
    livenessState?: EmbeddedRunLivenessState;
}): EmbeddedAgentRunResult;

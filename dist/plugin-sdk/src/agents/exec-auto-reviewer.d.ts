import type { AgentModelConfig } from "../config/types.agents-shared.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ExecAutoReviewDecision, type ExecAutoReviewer } from "../infra/exec-auto-review.js";
import { completeWithPreparedSimpleCompletionModel, prepareSimpleCompletionModelForAgent } from "./simple-completion-runtime.js";
/** Config for the optional model-backed exec reviewer. */
export type ExecReviewerConfig = {
    model?: AgentModelConfig;
    timeoutMs?: number;
};
type ExecReviewerDeps = {
    prepareSimpleCompletionModelForAgent?: typeof prepareSimpleCompletionModelForAgent;
    completeWithPreparedSimpleCompletionModel?: typeof completeWithPreparedSimpleCompletionModel;
};
/** Parses and validates reviewer JSON into a conservative exec decision. */
export declare function parseExecAutoReviewResponse(text: string): ExecAutoReviewDecision;
/** Resolves the reviewer timeout with a low minimum to avoid hanging exec approval. */
export declare function resolveExecReviewerTimeoutMs(config?: ExecReviewerConfig): number;
/** Creates an exec auto-reviewer that uses a configured model when available. */
export declare function createModelExecAutoReviewer(params: {
    cfg?: OpenClawConfig;
    agentId?: string;
    reviewer?: ExecReviewerConfig;
    deps?: ExecReviewerDeps;
}): ExecAutoReviewer;
export {};

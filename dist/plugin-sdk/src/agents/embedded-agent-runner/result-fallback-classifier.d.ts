import type { ModelFallbackResultClassification } from "../model-fallback.js";
import type { EmbeddedAgentRunResult } from "./types.js";
/** Keeps final-candidate bookkeeping while surfacing the best trusted terminal payload. */
export declare function mergeEmbeddedAgentRunResultForModelFallbackExhaustion(params: {
    latestResult: EmbeddedAgentRunResult;
    preferredResult: EmbeddedAgentRunResult;
}): EmbeddedAgentRunResult;
/** Returns a fallback classification when an embedded run failed without user-visible output. */
export declare function classifyEmbeddedAgentRunResultForModelFallback(params: {
    provider: string;
    model: string;
    result: unknown;
    hasDirectlySentBlockReply?: boolean;
    hasBlockReplyPipelineOutput?: boolean;
}): ModelFallbackResultClassification;

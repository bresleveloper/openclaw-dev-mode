import { qt as DecisionProviderV2 } from "../config-contracts-hzlacViZ.js";
import { r as ProviderDecisionOutcomeV2, u as DecisionBatchV2, y as DecisionReasoning } from "../provider-context-BvC7EnIY.js";
/** Validate before transport or credential-scoped discovery. Malformed caller data still throws. */
export declare function supportsOpenAIDecisionBatch(batch: DecisionBatchV2, reasoning: DecisionReasoning | undefined): batch is DecisionBatchV2 & {
  state: Exclude<DecisionBatchV2["state"], {
    type: "list";
  }>;
};
type Context = Parameters<DecisionProviderV2["evaluate"]>[1];
/** Execute the OpenAI Decisions wire format; never fall back to conversational inference. */
export declare function evaluateOpenAICompatibleDecision(batch: DecisionBatchV2, context: Context, route: {
  provider: string;
  baseUrl: string;
  modelId?: string;
}): Promise<ProviderDecisionOutcomeV2>;
export {};
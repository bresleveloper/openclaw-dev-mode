import { A as ModelCostConfig, M as ModelRequestHeaders, Q as RawModelCostConfig, a as AssistantMessage, gt as Usage } from "./types-B1ZIh9Ch.mjs";
import "./event-stream-MivcTu-M.mjs";
import "./validation-B1JSCy-N.mjs";
declare function normalizeModelCostConfig(cost: RawModelCostConfig): ModelCostConfig;
declare function normalizeResolvedPricing(cost: Partial<RawModelCostConfig>): ModelCostConfig;
/** Price one model call, selecting its tier before billing the separate token buckets. */
declare function calculateUsageCost(usage: Partial<Pick<Usage, "input" | "output" | "cacheRead" | "cacheWrite" | "cacheWrite1h">>, pricing: RawModelCostConfig): Usage["cost"];
/** Provider-reported token counts for one embedding request. */
type EmbeddingUsage = {
  promptTokens: number;
  totalTokens: number;
};
declare function extractEmbeddingUsage(payload: unknown): EmbeddingUsage | undefined;
declare function appendTextDeltaToAssistantMessage(message: AssistantMessage, contentIndex: number, delta: string): AssistantMessage;
/** Materialize merged overrides for HTTP clients that cannot consume SDK deletion sentinels. */
declare function omitNullRequestHeaders(headers: ModelRequestHeaders | undefined): Record<string, string> | undefined;
export { extractEmbeddingUsage as a, calculateUsageCost as i, appendTextDeltaToAssistantMessage as n, normalizeModelCostConfig as o, EmbeddingUsage as r, normalizeResolvedPricing as s, omitNullRequestHeaders as t };
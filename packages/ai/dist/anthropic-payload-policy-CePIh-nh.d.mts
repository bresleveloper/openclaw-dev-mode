import { k as Model, tt as SimpleStreamOptions, z as PreparedSystemPrompt } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import { r as AnthropicOptions, t as AnthropicContextManagementOptions } from "./provider-options-BOGPCBFr.mjs";
import { TextBlockParam } from "@anthropic-ai/sdk/resources/messages.js";
/** Keep both entry points on one thinking mode while retaining their output-budget policies. */
declare function applyAnthropicThinkingOptions(model: Model<"anthropic-messages">, resolved: Pick<AnthropicOptions, "thinkingEnabled" | "thinkingBudgetTokens" | "effort"> & {
  maxTokens: number;
}, options: Pick<SimpleStreamOptions, "reasoning" | "thinkingBudgets"> | undefined, profile: "provider" | "transport"): SimpleStreamOptions["reasoning"];
/**
 * Largest completion a request may ask for once transport thinking options
 * apply, for callers that size the prompt before dispatch. Claude transports
 * (Anthropic Messages, Vertex, Bedrock, Bedrock Mantle) may add a thinking
 * budget to `maxTokens`, capped at the model's output limit; some add it even
 * for adaptive models, and their Claude detection is plugin-owned, so every
 * request on these APIs reserves the default budget for its level. Other
 * transports keep `maxTokens` as the total output limit. Over-reserving only
 * shrinks the prompt; it never overflows the window.
 */
declare function resolveCompletionTokenReservation(model: Model, maxTokens: number, reasoning: SimpleStreamOptions["reasoning"]): number;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
type AnthropicServiceTier = "auto" | "standard_only";
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
type AnthropicEphemeralCacheControl = {
  type: "ephemeral";
  ttl?: "1h" | "5m";
};
type AnthropicPayloadPolicyInput = {
  api?: string;
  baseUrl?: string;
  cacheRetention?: "short" | "long" | "none";
  cacheTtlPruning?: AnthropicContextManagementOptions["cacheTtlPruning"];
  contextWindow?: unknown;
  enableCacheControl?: boolean;
  enableServerCompaction?: boolean;
  extraParams?: Record<string, unknown>;
  provider?: string;
  serviceTier?: AnthropicServiceTier;
};
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
type AnthropicPayloadPolicy = ReturnType<typeof resolveAnthropicPayloadPolicy>;
/** Resolve the server-compaction gate and effective threshold for an Anthropic route. */
declare function resolveAnthropicServerCompactionPlan(model: {
  id?: string;
  params?: Record<string, unknown>;
  provider?: unknown;
  api?: unknown;
  baseUrl?: string;
  contextTokens?: unknown;
  contextWindow?: unknown;
}, extraParams?: Record<string, unknown>, apiKey?: string): {
  enabled: boolean;
  threshold?: number;
};
declare function isDirectAnthropicModel(model: {
  provider?: unknown;
  baseUrl?: string;
}, env?: {
  ANTHROPIC_BASE_URL?: string;
}): boolean;
declare function supportsAnthropicServerSideFallback(model: Model<"anthropic-messages">): boolean;
declare function isAnthropicServerToolClearingEnabled(model: {
  provider?: unknown;
  api?: unknown;
  baseUrl?: string;
}, apiKey?: string): boolean;
/** Resolve Anthropic cache-control marker retention for a request endpoint. */
declare function resolveAnthropicEphemeralCacheControl(baseUrl: string | undefined, cacheRetention: AnthropicPayloadPolicyInput["cacheRetention"]): AnthropicEphemeralCacheControl | undefined;
declare function resolveAnthropicCacheOptions(model: Model<"anthropic-messages">, cacheRetention?: "short" | "long" | "none"): {
  cacheControl: AnthropicEphemeralCacheControl | undefined;
  supportsCacheControlOnTools: boolean;
};
declare function buildAnthropicSystemBlocks(systemPrompt: string | undefined, isOAuthToken: boolean, cacheControl: AnthropicEphemeralCacheControl | undefined, claudeCodeVersion?: string, preparedSystemPrompt?: PreparedSystemPrompt): TextBlockParam[] | undefined;
/** Allocate tool and history checkpoints around the prepared stable system blocks. */
declare function applyAnthropicRequestCacheControl(payload: {
  system?: unknown;
  tools?: unknown;
  messages?: unknown;
}, cacheControl: AnthropicEphemeralCacheControl | undefined, supportsCacheControlOnTools: boolean, cacheBreakpointOptOutMessageIndexes?: ReadonlySet<number>): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function resolveAnthropicPayloadPolicy(input: AnthropicPayloadPolicyInput, model?: Model): {
  allowsServiceTier: boolean;
  cacheControl: AnthropicEphemeralCacheControl | undefined;
  compactThreshold: number;
  serviceTier: AnthropicServiceTier | undefined;
  useServerCompaction: boolean;
  toolClearing?: {
    trigger: number;
    clearAtLeast: number;
    tools: {
      allow?: string[];
      deny?: string[];
    } | undefined;
  } | undefined;
};
type AnthropicContextManagementPayload = {
  context_management?: unknown;
  tools?: unknown;
  messages?: unknown;
};
declare function applyAnthropicContextManagementToRequest(payload: AnthropicContextManagementPayload, model: Model, options: AnthropicContextManagementOptions | undefined, directApiKeyBetaHeader: string | undefined): void;
declare function resolveAnthropicRequestBetaHeader(payload: AnthropicContextManagementPayload & {
  fallbacks?: unknown;
}, directApiKeyBetaHeader: string | undefined): string | undefined;
declare function logAnthropicContextEdits(event: unknown): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function applyAnthropicPayloadPolicyToParams(payloadObj: Record<string, unknown>, policy: AnthropicPayloadPolicy, cacheBreakpointOptOutMessageIndexes: ReadonlySet<number>): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function applyAnthropicEphemeralCacheControlMarkers(payloadObj: Record<string, unknown>, cacheControl?: AnthropicEphemeralCacheControl | null): void;
export { buildAnthropicSystemBlocks as a, logAnthropicContextEdits as c, resolveAnthropicPayloadPolicy as d, resolveAnthropicRequestBetaHeader as f, resolveCompletionTokenReservation as g, applyAnthropicThinkingOptions as h, applyAnthropicRequestCacheControl as i, resolveAnthropicCacheOptions as l, supportsAnthropicServerSideFallback as m, applyAnthropicEphemeralCacheControlMarkers as n, isAnthropicServerToolClearingEnabled as o, resolveAnthropicServerCompactionPlan as p, applyAnthropicPayloadPolicyToParams as r, isDirectAnthropicModel as s, applyAnthropicContextManagementToRequest as t, resolveAnthropicEphemeralCacheControl as u };
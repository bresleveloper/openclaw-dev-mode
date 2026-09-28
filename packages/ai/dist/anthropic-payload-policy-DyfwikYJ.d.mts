import "./index-C25RT6bP.mjs";
import { O as Model } from "./types-qZFbaDbK.mjs";
import { t as AnthropicContextManagementOptions } from "./provider-options-DZYq53lj.mjs";
import { TextBlockParam } from "@anthropic-ai/sdk/resources/messages.js";
//#region packages/ai/src/transports/anthropic-payload-policy.d.ts
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
type AnthropicPayloadPolicy = {
  allowsServiceTier: boolean;
  cacheControl: AnthropicEphemeralCacheControl | undefined;
  compactThreshold: number;
  serviceTier: AnthropicServiceTier | undefined;
  useServerCompaction: boolean;
  toolClearing?: {
    trigger: number;
    clearAtLeast: number;
    tools: NonNullable<AnthropicContextManagementOptions["cacheTtlPruning"]>["tools"];
  };
};
/** Resolve the server-compaction gate and effective threshold for an Anthropic route. */
declare function resolveAnthropicServerCompactionPlan(model: {
  provider?: unknown;
  api?: unknown;
  baseUrl?: string;
  contextWindow?: unknown;
}, extraParams?: Record<string, unknown>, apiKey?: string): {
  enabled: boolean;
  threshold?: number;
};
declare function isDirectAnthropicModel(model: {
  provider?: unknown;
  baseUrl?: string;
}): boolean;
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
declare function buildAnthropicSystemBlocks(systemPrompt: string | undefined, isOAuthToken: boolean, cacheControl: AnthropicEphemeralCacheControl | undefined, claudeCodeVersion?: string): TextBlockParam[] | undefined;
/** Allocate tool and history checkpoints around the prepared stable system blocks. */
declare function applyAnthropicRequestCacheControl(payload: {
  system?: unknown;
  tools?: unknown;
  messages?: unknown;
}, cacheControl: AnthropicEphemeralCacheControl | undefined, supportsCacheControlOnTools: boolean, cacheBreakpointOptOutMessageIndexes?: ReadonlySet<number>): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function resolveAnthropicPayloadPolicy(input: AnthropicPayloadPolicyInput, model?: Model): AnthropicPayloadPolicy;
type AnthropicContextManagementPayload = {
  context_management?: unknown;
  tools?: unknown;
  messages?: unknown;
};
declare function applyAnthropicContextManagementToRequest(payload: AnthropicContextManagementPayload, model: Model, options: AnthropicContextManagementOptions | undefined, directApiKeyBetaHeader: string | undefined): void;
declare function resolveAnthropicContextManagementBetaHeader(payload: AnthropicContextManagementPayload, directApiKeyBetaHeader: string | undefined): string | undefined;
declare function logAnthropicContextEdits(event: unknown): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function applyAnthropicPayloadPolicyToParams(payloadObj: Record<string, unknown>, policy: AnthropicPayloadPolicy, cacheBreakpointOptOutMessageIndexes: ReadonlySet<number>): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function applyAnthropicEphemeralCacheControlMarkers(payloadObj: Record<string, unknown>, cacheControl?: AnthropicEphemeralCacheControl | null): void;
//#endregion
export { buildAnthropicSystemBlocks as a, logAnthropicContextEdits as c, resolveAnthropicEphemeralCacheControl as d, resolveAnthropicPayloadPolicy as f, applyAnthropicRequestCacheControl as i, resolveAnthropicCacheOptions as l, applyAnthropicEphemeralCacheControlMarkers as n, isAnthropicServerToolClearingEnabled as o, resolveAnthropicServerCompactionPlan as p, applyAnthropicPayloadPolicyToParams as r, isDirectAnthropicModel as s, applyAnthropicContextManagementToRequest as t, resolveAnthropicContextManagementBetaHeader as u };
import { D as supportsClaudeNativeMaxEffort, O as supportsClaudeNativeXhighEffort, S as resolveClaudeSonnet5ModelIdentity, _ as resolveClaudeMythos5ModelIdentity, b as resolveClaudeOpus5ModelIdentity, c as bindsClaudeThinkingPrefix, d as requiresClaudeBetweenToolsThinking, f as requiresClaudeDefaultSampling, g as resolveClaudeModelIdentity, h as resolveClaudeHaiku55ModelIdentity, m as resolveClaudeFable5ModelIdentity, p as requiresClaudeMandatoryAdaptiveThinking, v as resolveClaudeNativeThinkingLevelMap, w as supportsClaudeAdaptiveThinking, x as resolveClaudeSonnet55ModelIdentity, y as resolveClaudeOpus55ModelIdentity } from "../observe-async-iterator-DeB_Vxes.mjs";
import { M as ModelRequestHeaders, d as Context, gt as Usage, it as StreamFunction, k as Model, kt as AssistantMessageDiagnostic, nt as StopReason, tt as SimpleStreamOptions } from "../types-B1ZIh9Ch.mjs";
import "../index-94l3uJ39.mjs";
import "../types-CeCl7cJZ.mjs";
import { i as AnthropicThinkingDisplay, n as AnthropicEffort, r as AnthropicOptions, t as AnthropicContextManagementOptions } from "../provider-options-BOGPCBFr.mjs";
import { a as prepareAnthropicInputSchema, c as resolveOriginalAnthropicToolName, i as normalizeAnthropicToolChoice, l as toClaudeCodeToolName, n as AnthropicToolProjection, o as projectAnthropicTools, r as normalizeAnthropicToolCallId, s as reconcileAnthropicToolChoice, t as AnthropicProjectedToolChoice } from "../anthropic-tool-projection-u94eGqZM.mjs";
import { a as buildAnthropicSystemBlocks, h as applyAnthropicThinkingOptions, p as resolveAnthropicServerCompactionPlan, s as isDirectAnthropicModel } from "../anthropic-payload-policy-CePIh-nh.mjs";
type AnthropicCompactionOptions = AnthropicOptions & {
  authProfileId?: string;
};
export declare const streamAnthropic: StreamFunction<"anthropic-messages", AnthropicCompactionOptions>;
export declare const streamSimpleAnthropic: StreamFunction<"anthropic-messages", SimpleStreamOptions & AnthropicContextManagementOptions & {
  authProfileId?: string;
  toolChoice?: AnthropicCompactionOptions["toolChoice"];
  thinkingDisplay?: AnthropicOptions["thinkingDisplay"];
  onClaudeCodeVersionRequired?: AnthropicOptions["onClaudeCodeVersionRequired"];
  onFastModeUnsupported?: AnthropicOptions["onFastModeUnsupported"];
}>;
/** Inspect resolved credential shape for auth routing without exposing its value. */
export declare function isAnthropicOAuthApiKey(apiKey: unknown): boolean;
export declare function usesFoundryBearerAuth(model: {
  provider?: string;
  authHeader?: boolean;
  headers?: ModelRequestHeaders;
}): boolean;
export declare function omitFoundryBearerCredentialHeaders(headers?: ModelRequestHeaders): ModelRequestHeaders | undefined;
export declare const ANTHROPIC_CLAUDE_CODE_VERSION = "2.1.280";
/**
 * Read the Claude Code version Anthropic requires from a
 * claude_code_version_too_old rejection (SDK APIError or transport error body).
 */
export declare function readRequiredClaudeCodeVersion(error: unknown): string | undefined;
/** Adopt a version Anthropic required; true when it raised the floor and a retry can help. */
export declare function raiseClaudeCodeVersionFloor(required: string): boolean;
/** Test seam: forget the learned requirement. */
export declare function resetLearnedClaudeCodeVersionForTest(): void;
/** Whether Anthropic rejected a request because the model has no native fast mode. */
export declare function isUnsupportedClaudeFastModeError(error: unknown): boolean;
/** Build OAuth headers and the matching billing identity from one request snapshot. */
export declare function buildAnthropicClaudeCodeIdentity(betaHeader: string | undefined, ...headerSources: (ModelRequestHeaders | undefined)[]): {
  headers: Record<string, string>;
  version: string;
};
type ReplayModelRef = {
  provider?: string;
  api?: string;
  modelId?: string;
  responseModelId?: string;
  modelParams?: Record<string, unknown>;
};
export declare function usesClaudeFable5MessagesContract(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
/** Return whether streamed output must wait for the terminal refusal decision. */
export declare function usesClaudeStreamingRefusalContract(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
export declare function requiresClaudeAdaptiveThinking(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
/** Return whether omitted thinking should default to adaptive mode. */
export declare function defaultsClaudeAdaptiveThinking(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
/** Resolve provider-native effort once for direct and managed Claude requests. */
export declare function resolveAnthropicThinkingEffort(model: Model<"anthropic-messages">, level: SimpleStreamOptions["reasoning"]): AnthropicEffort;
/** Normalize Anthropic and Anthropic-compatible terminal reasons identically. */
export declare function mapAnthropicStopReason(reason: string | undefined): StopReason;
/** Remove unsupported assistant prefills while preserving completed tool-use turns. */
export declare function prepareClaudeNoPrefillRequestContext(model: Model, context: Context): Context;
export declare function applyClaudeRequestContract(params: {
  temperature?: unknown;
  top_p?: unknown;
  top_k?: unknown;
  service_tier?: unknown;
}, model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): void;
/** The destination is fixed during one synchronous history transform. */
export declare function prepareModelBoundThinkingReplay(target: Pick<Model, "api" | "provider" | "id" | "params">): (source: ReplayModelRef) => "default" | "preserve" | "drop";
export declare function applyAnthropicRefusal(output: {
  stopReason: string;
  errorMessage?: string;
  diagnostics?: AssistantMessageDiagnostic[];
}, stopDetails: unknown, provider: string): void;
/** Anthropic beta that re-serves safety refusals on an allowed fallback model. */
export declare const ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-07-01";
/** Let Anthropic select the recommended model for each refusal category. */
export declare const ANTHROPIC_SERVER_SIDE_FALLBACKS: "default";
export declare const CLAUDE_OPUS_FALLBACK_MODEL_COST: {
  readonly input: 5;
  readonly output: 25;
  readonly cacheRead: 0.5;
  readonly cacheWrite: 6.25;
};
export type AnthropicFallbackBoundary = {
  fromModel: string | null;
  toModel: string | null;
};
/** Resolve billed rates from the serving model reported by Anthropic's fallback stream. */
export declare function resolveAnthropicFallbackServingModelCost(params: {
  requestedModelId: string;
  servingModelId: string | null;
  requestedCost: Model["cost"];
}): Model["cost"];
/** Reads a `fallback` content block marking where one model's output gives way to the next. */
export declare function readAnthropicFallbackBoundary(block: unknown): AnthropicFallbackBoundary | null;
/**
 * Drops pre-fallback thinking/tool calls while preserving the text prefix that
 * the serving model continued. Dropped tool calls must never execute or replay.
 */
export declare function applyAnthropicFallbackBoundary(params: {
  output: {
    content: Array<{
      type: string;
    }>;
    responseModel?: string;
    diagnostics?: AssistantMessageDiagnostic[];
  };
  boundary: AnthropicFallbackBoundary;
  provider: string;
}): void;
export declare const ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
export declare function applyAnthropicThinkingBindingControls(params: {
  thinking?: unknown;
}, directApiKeyBetaHeader: string | undefined): Record<string, string> | undefined;
export declare function readAnthropicInputTransformations(event: unknown): unknown[] | undefined;
export declare function logAnthropicThinkingDrops(transformations: unknown[] | undefined): void;
/**
 * Anthropic tool results continue the preceding assistant turn. Preserve that
 * turn's signed thinking even when the next request disables new thinking.
 */
export declare function findActiveAnthropicToolTurnAssistantIndex(messages: readonly unknown[]): number;
type AnthropicUsagePayload = {
  input_tokens?: unknown;
  output_tokens?: unknown;
  cache_read_input_tokens?: unknown;
  cache_creation_input_tokens?: unknown;
  cache_creation?: unknown;
  iterations?: unknown;
};
export type AnthropicCacheWriteUsage = {
  cacheWrite5m?: number;
  cacheWrite1h?: number;
};
export type AnthropicPromptUsageSnapshot = {
  input: number;
  cacheRead: number;
  cacheWrite: number;
};
export type AnthropicIterationUsageSnapshot = {
  contextPromptTokens: number;
  totalTokens: number;
};
export type AnthropicIterationUsageResult = {
  state: "absent";
} | {
  state: "invalid";
} | {
  state: "valid";
  usage: AnthropicIterationUsageSnapshot;
};
export declare function readAnthropicUsageTokenCount(value: unknown): number | undefined;
export declare function readAnthropicCacheWriteUsage(usage: AnthropicUsagePayload): AnthropicCacheWriteUsage;
export declare function readAnthropicPromptUsageSnapshot(usage: AnthropicUsagePayload): AnthropicPromptUsageSnapshot | undefined;
export declare function readLastAnthropicIterationUsage(usage: AnthropicUsagePayload): AnthropicIterationUsageResult;
/** Record independent billing buckets without treating zero placeholders as context proof. */
export declare function applyAnthropicMessageStartUsage(target: Usage, payload: AnthropicUsagePayload): AnthropicPromptUsageSnapshot | undefined;
/** Keep billing and context distinct; omitted usage preserves the last snapshot. */
export declare function applyAnthropicMessageDeltaUsage(target: Usage, usage: AnthropicUsagePayload | undefined, messageStartPromptUsage: AnthropicPromptUsageSnapshot | undefined): void;
export { type AnthropicEffort, type AnthropicOptions, AnthropicProjectedToolChoice, type AnthropicThinkingDisplay, AnthropicToolProjection, applyAnthropicThinkingOptions, bindsClaudeThinkingPrefix, buildAnthropicSystemBlocks, isDirectAnthropicModel, normalizeAnthropicToolCallId, normalizeAnthropicToolChoice, prepareAnthropicInputSchema, projectAnthropicTools, reconcileAnthropicToolChoice, requiresClaudeBetweenToolsThinking, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveAnthropicServerCompactionPlan, resolveClaudeFable5ModelIdentity, resolveClaudeHaiku55ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeOpus55ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet55ModelIdentity, resolveClaudeSonnet5ModelIdentity, resolveOriginalAnthropicToolName, supportsClaudeAdaptiveThinking, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, toClaudeCodeToolName };
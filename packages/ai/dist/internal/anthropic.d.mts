import { S as supportsClaudeAdaptiveThinking, T as supportsClaudeNativeXhighEffort, _ as resolveClaudeNativeThinkingLevelMap, b as resolveClaudeSonnet5ModelIdentity, d as bindsClaudeThinkingPrefix, f as requiresClaudeDefaultSampling, g as resolveClaudeMythos5ModelIdentity, h as resolveClaudeModelIdentity, m as resolveClaudeFable5ModelIdentity, p as requiresClaudeMandatoryAdaptiveThinking, v as resolveClaudeOpus55ModelIdentity, w as supportsClaudeNativeMaxEffort, y as resolveClaudeOpus5ModelIdentity } from "../index-C25RT6bP.mjs";
import { G as SimpleStreamOptions, J as StreamFunction, K as StopReason, O as Model, d as Context, ot as Usage, ut as AssistantMessageDiagnostic } from "../types-qZFbaDbK.mjs";
import { i as AnthropicThinkingDisplay, n as AnthropicEffort, r as AnthropicOptions, t as AnthropicContextManagementOptions } from "../provider-options-DZYq53lj.mjs";
import "../types-DTvddOfm.mjs";
import { p as resolveAnthropicServerCompactionPlan } from "../anthropic-payload-policy-DyfwikYJ.mjs";
import { Tool } from "@anthropic-ai/sdk/resources/messages.js";
//#region packages/ai/src/providers/anthropic.d.ts
type AnthropicCompactionOptions = AnthropicOptions & {
  authProfileId?: string;
};
export declare const streamAnthropic: StreamFunction<"anthropic-messages", AnthropicCompactionOptions>;
type AnthropicSimpleStreamOptions = SimpleStreamOptions & AnthropicContextManagementOptions & {
  authProfileId?: string;
  toolChoice?: AnthropicCompactionOptions["toolChoice"];
};
export declare const streamSimpleAnthropic: StreamFunction<"anthropic-messages", AnthropicSimpleStreamOptions>;
//#endregion
//#region packages/ai/src/providers/anthropic-auth-headers.d.ts
/** Inspect resolved credential shape for auth routing without exposing its value. */
export declare function isAnthropicOAuthApiKey(apiKey: unknown): boolean;
type AnthropicAuthModel = {
  provider?: string;
  authHeader?: boolean;
  headers?: Record<string, string>;
};
export declare function usesFoundryBearerAuth(model: AnthropicAuthModel): boolean;
export declare function omitFoundryBearerCredentialHeaders(headers?: Record<string, string>): Record<string, string> | undefined;
//#endregion
//#region packages/ai/src/providers/anthropic-model-contract.d.ts
export declare const ANTHROPIC_CLAUDE_CODE_VERSION = "2.1.278";
/** Build OAuth headers and the matching billing identity from one request snapshot. */
export declare function buildAnthropicClaudeCodeIdentity(betaHeader: string | undefined, ...headerSources: (Record<string, string> | undefined)[]): {
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
type ClaudeSamplingRequestParams = {
  temperature?: unknown;
  top_p?: unknown;
  top_k?: unknown;
  service_tier?: unknown;
};
export declare function applyClaudeRequestContract(params: ClaudeSamplingRequestParams, model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): void;
export declare function resolveModelBoundThinkingReplayMode(params: {
  source: ReplayModelRef;
  target: ReplayModelRef;
}): "default" | "preserve" | "drop";
//#endregion
//#region packages/ai/src/providers/anthropic-refusal.d.ts
type AnthropicRefusalOutput = {
  stopReason: string;
  errorMessage?: string;
  diagnostics?: AssistantMessageDiagnostic[];
};
export declare function applyAnthropicRefusal(output: AnthropicRefusalOutput, stopDetails: unknown, provider: string): void;
//#endregion
//#region packages/ai/src/providers/anthropic-server-fallback.d.ts
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
//#endregion
//#region packages/ai/src/providers/anthropic-thinking-replay.d.ts
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
//#endregion
//#region packages/ai/src/providers/anthropic-tool-projection.d.ts
type AnthropicToolDescriptor = {
  readonly name: string;
  readonly description: string;
  readonly parameters: unknown;
};
type AnthropicProjectedTool = {
  readonly originalName: string;
  readonly wireName: string;
  readonly description?: string;
  readonly inputSchema: Tool["input_schema"] & {
    readonly properties: Record<string, unknown>;
    readonly required: string[];
  };
};
export type AnthropicToolProjection = {
  readonly inputToolCount: number;
  readonly unavailableOriginalNames: ReadonlySet<string>;
  readonly tools: readonly AnthropicProjectedTool[];
};
type AnthropicParallelToolChoice = {
  readonly disable_parallel_tool_use?: boolean;
};
export type AnthropicProjectedToolChoice = ({
  readonly type: "auto";
} & AnthropicParallelToolChoice) | ({
  readonly type: "any";
} & AnthropicParallelToolChoice) | {
  readonly type: "none";
} | ({
  readonly type: "tool";
  readonly name: string;
} & AnthropicParallelToolChoice);
/** Preserve Claude Code's canonical tool casing for subscription OAuth requests. */
export declare function toClaudeCodeToolName(name: string): string;
/** Anthropic rejects forced tools while extended thinking is enabled. */
export declare function normalizeAnthropicToolChoice(thinkingEnabled: boolean, toolChoice: NonNullable<AnthropicOptions["toolChoice"]>): AnthropicProjectedToolChoice;
/** Anthropic tool identifiers accept only ASCII word characters and dashes. */
export declare function normalizeAnthropicToolCallId(id: string): string;
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
export declare function projectAnthropicTools(tools: readonly AnthropicToolDescriptor[], toWireName: (name: string) => string): AnthropicToolProjection;
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
export declare function reconcileAnthropicToolChoice(choice: AnthropicProjectedToolChoice, projection: AnthropicToolProjection): AnthropicProjectedToolChoice | undefined;
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
export declare function resolveOriginalAnthropicToolName(name: string, projection: AnthropicToolProjection | undefined): string;
//#endregion
//#region packages/ai/src/providers/anthropic-usage.d.ts
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
//#endregion
export { type AnthropicEffort, type AnthropicOptions, type AnthropicThinkingDisplay, bindsClaudeThinkingPrefix, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveAnthropicServerCompactionPlan, resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeOpus55ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity, supportsClaudeAdaptiveThinking, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort };
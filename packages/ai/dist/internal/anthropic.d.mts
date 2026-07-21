import { a as resolveClaudeFable5ModelIdentity, c as resolveClaudeNativeThinkingLevelMap, d as supportsClaudeNativeMaxEffort, f as supportsClaudeNativeXhighEffort, i as requiresClaudeMandatoryAdaptiveThinking, l as resolveClaudeSonnet5ModelIdentity, o as resolveClaudeModelIdentity, r as requiresClaudeDefaultSampling, s as resolveClaudeMythos5ModelIdentity, u as supportsClaudeAdaptiveThinking } from "../index-BoTnz8cv.mjs";
import { t as AssistantMessageDiagnostic } from "../diagnostics-BaTA9eVl.mjs";
import { E as Model, F as SimpleStreamOptions, R as StreamFunction, u as Context, z as StreamOptions } from "../types-DRgdPqaZ.mjs";
import Anthropic from "@anthropic-ai/sdk";

//#region packages/ai/src/providers/anthropic.d.ts
type AnthropicEffort = "low" | "medium" | "high" | "xhigh" | "max";
type AnthropicThinkingDisplay = "summarized" | "omitted";
interface AnthropicOptions extends StreamOptions {
  /**
   * Enable extended thinking.
   * For Opus 4.6+ and Sonnet 4.6: uses adaptive thinking (model decides when/how much to think).
   * For older models: uses budget-based thinking with thinkingBudgetTokens.
   */
  thinkingEnabled?: boolean;
  /**
   * Token budget for extended thinking (older models only).
   * Ignored for Opus 4.6+ and Sonnet 4.6, which use adaptive thinking.
   */
  thinkingBudgetTokens?: number;
  /**
   * Effort level for adaptive thinking (Opus 4.6+ and Sonnet 4.6).
   * Controls how much thinking Claude allocates:
   * - "max": Always thinks with no constraints (Opus 4.6 only)
   * - "xhigh": Highest reasoning level (Opus 4.7+)
   * - "high": Always thinks, deep reasoning (default)
   * - "medium": Moderate thinking, may skip for simple queries
   * - "low": Minimal thinking, skips for simple tasks
   * Ignored for older models.
   */
  effort?: AnthropicEffort;
  /**
   * Controls how thinking content is returned in API responses.
   * - "summarized": Thinking blocks contain summarized thinking text (default here).
   * - "omitted": Thinking blocks return an empty thinking field; the encrypted
   *   signature still travels back for multi-turn continuity. Use for faster
   *   time-to-first-text-token when your UI does not surface thinking.
   *
   * Note: Anthropic's API default for Claude Opus 4.7+ and Claude Mythos Preview
   * is "omitted". We default to "summarized" here to keep behavior consistent
   * with older Claude 4 models. Set this explicitly to "omitted" to opt in.
   */
  thinkingDisplay?: AnthropicThinkingDisplay;
  interleavedThinking?: boolean;
  toolChoice?: "auto" | "any" | "none" | {
    type: "tool";
    name: string;
  };
  /**
   * Pre-built Anthropic client instance. When provided, skips internal client
   * construction entirely. Use this to inject alternative SDK clients such as
   * `AnthropicVertex` that shares the same messaging API.
   */
  client?: Anthropic;
}
declare const streamAnthropic: StreamFunction<"anthropic-messages", AnthropicOptions>;
type AnthropicSimpleStreamOptions = SimpleStreamOptions & {
  toolChoice?: AnthropicOptions["toolChoice"];
};
declare const streamSimpleAnthropic: StreamFunction<"anthropic-messages", AnthropicSimpleStreamOptions>;
//#endregion
//#region packages/ai/src/providers/anthropic-auth-headers.d.ts
type AnthropicAuthModel = {
  provider?: string;
  authHeader?: boolean;
  headers?: Record<string, string>;
};
declare function usesFoundryBearerAuth(model: AnthropicAuthModel): boolean;
declare function omitFoundryBearerCredentialHeaders(headers?: Record<string, string>): Record<string, string> | undefined;
//#endregion
//#region packages/ai/src/providers/anthropic-model-contract.d.ts
type ReplayModelRef = {
  provider?: string;
  api?: string;
  modelId?: string;
  responseModelId?: string;
  modelParams?: Record<string, unknown>;
};
declare function usesClaudeFable5MessagesContract(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
/** Return whether streamed output must wait for the terminal refusal decision. */
declare function usesClaudeStreamingRefusalContract(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
declare function requiresClaudeAdaptiveThinking(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
/** Return whether omitted thinking should default to adaptive/high. */
declare function defaultsClaudeAdaptiveThinking(model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): boolean;
/** Remove Sonnet 5 assistant prefills while preserving completed tool-use turns. */
declare function prepareClaudeSonnet5RequestContext(model: Model, context: Context): Context;
declare function applyClaudeRequestContract(params: Record<string, unknown>, model: {
  id?: string;
  params?: Record<string, unknown>;
  api?: string;
}): void;
declare function resolveModelBoundThinkingReplayMode(params: {
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
declare function applyAnthropicRefusal(output: AnthropicRefusalOutput, stopDetails: unknown, provider: string): void;
//#endregion
//#region packages/ai/src/providers/anthropic-server-fallback.d.ts
/** Anthropic beta that re-serves safety refusals on an allowed fallback model. */
declare const ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-06-01";
declare const CLAUDE_FABLE_5_FALLBACK_MODEL = "claude-opus-4-8";
declare const CLAUDE_FABLE_5_FALLBACK_MODEL_COST: {
  readonly input: 5;
  readonly output: 25;
  readonly cacheRead: 0.5;
  readonly cacheWrite: 6.25;
};
declare function buildAnthropicServerSideFallbacks(): Array<{
  model: string;
}>;
type AnthropicFallbackBoundary = {
  fromModel: string | null;
  toModel: string | null;
};
/** Reads a `fallback` content block marking where one model's output gives way to the next. */
declare function readAnthropicFallbackBoundary(block: unknown): AnthropicFallbackBoundary | null;
/**
 * Drops pre-fallback thinking/tool calls while preserving the text prefix that
 * the serving model continued. Dropped tool calls must never execute or replay.
 */
declare function applyAnthropicFallbackBoundary(params: {
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
declare const ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
/**
 * Anthropic tool results continue the preceding assistant turn. Preserve that
 * turn's signed thinking even when the next request disables new thinking.
 */
declare function findActiveAnthropicToolTurnAssistantIndex(messages: readonly unknown[]): number;
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
  readonly inputSchema: {
    readonly type: "object";
    readonly properties: Record<string, unknown>;
    readonly required: string[];
  };
};
type AnthropicToolProjection = {
  readonly inputToolCount: number;
  readonly unavailableOriginalNames: ReadonlySet<string>;
  readonly tools: readonly AnthropicProjectedTool[];
};
type AnthropicParallelToolChoice = {
  readonly disable_parallel_tool_use?: boolean;
};
type AnthropicProjectedToolChoice = ({
  readonly type: "auto";
} & AnthropicParallelToolChoice) | ({
  readonly type: "any";
} & AnthropicParallelToolChoice) | {
  readonly type: "none";
} | ({
  readonly type: "tool";
  readonly name: string;
} & AnthropicParallelToolChoice);
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
declare function projectAnthropicTools(tools: readonly AnthropicToolDescriptor[], toWireName: (name: string) => string): AnthropicToolProjection;
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
declare function reconcileAnthropicToolChoice(choice: AnthropicProjectedToolChoice, projection: AnthropicToolProjection): AnthropicProjectedToolChoice | undefined;
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
declare function resolveOriginalAnthropicToolName(name: string, projection: AnthropicToolProjection | undefined): string;
//#endregion
//#region packages/ai/src/providers/anthropic-usage.d.ts
type AnthropicUsagePayload = {
  input_tokens?: unknown;
  output_tokens?: unknown;
  cache_read_input_tokens?: unknown;
  cache_creation_input_tokens?: unknown;
  iterations?: unknown;
};
type AnthropicPromptUsageSnapshot = {
  input: number;
  cacheRead: number;
  cacheWrite: number;
};
type AnthropicIterationUsageSnapshot = {
  contextPromptTokens: number;
  totalTokens: number;
};
type AnthropicIterationUsageResult = {
  state: "absent";
} | {
  state: "invalid";
} | {
  state: "valid";
  usage: AnthropicIterationUsageSnapshot;
};
declare function readAnthropicUsageTokenCount(value: unknown): number | undefined;
declare function readAnthropicPromptUsageSnapshot(usage: AnthropicUsagePayload): AnthropicPromptUsageSnapshot | undefined;
declare function readLastAnthropicIterationUsage(usage: AnthropicUsagePayload): AnthropicIterationUsageResult;
//#endregion
export { ANTHROPIC_OMITTED_REASONING_TEXT, ANTHROPIC_SERVER_SIDE_FALLBACK_BETA, AnthropicEffort, AnthropicFallbackBoundary, AnthropicIterationUsageResult, AnthropicIterationUsageSnapshot, AnthropicOptions, AnthropicProjectedToolChoice, AnthropicPromptUsageSnapshot, AnthropicThinkingDisplay, AnthropicToolProjection, CLAUDE_FABLE_5_FALLBACK_MODEL, CLAUDE_FABLE_5_FALLBACK_MODEL_COST, applyAnthropicFallbackBoundary, applyAnthropicRefusal, applyClaudeRequestContract, buildAnthropicServerSideFallbacks, defaultsClaudeAdaptiveThinking, findActiveAnthropicToolTurnAssistantIndex, omitFoundryBearerCredentialHeaders, prepareClaudeSonnet5RequestContext, projectAnthropicTools, readAnthropicFallbackBoundary, readAnthropicPromptUsageSnapshot, readAnthropicUsageTokenCount, readLastAnthropicIterationUsage, reconcileAnthropicToolChoice, requiresClaudeAdaptiveThinking, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeSonnet5ModelIdentity, resolveModelBoundThinkingReplayMode, resolveOriginalAnthropicToolName, streamAnthropic, streamSimpleAnthropic, supportsClaudeAdaptiveThinking, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, usesClaudeFable5MessagesContract, usesClaudeStreamingRefusalContract, usesFoundryBearerAuth };
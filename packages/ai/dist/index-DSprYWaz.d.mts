import { $ as StopReason, A as ModelCostConfig, At as extractDiagnosticError, B as ProviderImagesOptions, C as KnownApi, Ct as readRuntimeContextMetadata, D as MaybePromise, Dt as DiagnosticErrorInfo, E as MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE, Et as AssistantMessageDiagnostic, F as OpenRouterRouting, G as RUNTIME_CONTEXT_CUSTOM_TYPE, H as ProviderResponse, I as PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, J as RUNTIME_CONTEXT_HEADER, K as RUNTIME_CONTEXT_END_MARKER, L as PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE, M as ModelThinkingLevel, Mt as isProviderRefusalAssistantError, N as OpenAICompletionsCompat, O as Message, Ot as appendAssistantMessageDiagnostic, P as OpenAIResponsesCompat, Q as SimpleStreamOptions, R as PricingTier, S as ImagesStopReason, St as labelRuntimeContextText, T as KnownImagesProvider, Tt as setRuntimeContextRetention, U as ProviderStreamOptions, V as ProviderReplayState, W as RUNTIME_CONTEXT_BEGIN_MARKER, X as RawPricingTier, Y as RawModelCostConfig, Z as RuntimeContextMessage, _ as ImagesInputContent, _t as escapeRuntimeContextFooter, a as AssistantMessage, at as ThinkingBudgets, b as ImagesOutputContent, bt as isRuntimeContextMessage, c as AssistantMessageEventStreamLike, ct as ThinkingLevelMap, d as Context, dt as ToolResultMessage, et as StreamFn, f as DEFAULT_MISSING_TOOL_RESULT_TEXT, ft as Transport, g as ImagesFunction, gt as VercelGatewayRouting, h as ImagesContext, ht as ValidateToolArgumentsFn, i as AssistantImages, it as TextSignatureV1, j as ModelCostRates, jt as formatThrownValue, k as Model, kt as createAssistantMessageDiagnostic, l as CacheRetention, lt as Tool, m as ImagesApi, mt as UserMessage, n as Api, nt as StreamOptions, o as AssistantMessageEvent, ot as ThinkingContent, p as ImageContent, pt as Usage, q as RUNTIME_CONTEXT_FOOTER, r as AssistantDeliveryTtsFacts, rt as TextContent, s as AssistantMessageEventStreamContract, st as ThinkingLevel, t as AnthropicMessagesCompat, tt as StreamFunction, u as CompleteSimpleFn, ut as ToolCall, v as ImagesModel, vt as hasLegacyRuntimeContextEnvelope, w as KnownImagesApi, wt as runtimeContextContentToText, x as ImagesProvider, xt as labelRuntimeContextContent, y as ImagesOptions, yt as hasRuntimeContextMarker, z as Provider } from "./types-CVYzKrMl.mjs";
import { n as EventStream, r as createAssistantMessageEventStream, t as AssistantMessageEventStream } from "./event-stream-CzpE1g_o.mjs";
import { n as validateToolCall, t as validateToolArguments } from "./validation-BQ5u20Ru.mjs";
//#region packages/llm-core/src/model-contracts/anthropic.d.ts
type ClaudeModelRef = {
  id?: string;
  params?: Record<string, unknown>;
};
type ClaudeEffortModelRef = ClaudeModelRef & {
  thinkingLevelMap?: Record<string, string | null | undefined>;
};
declare const CLAUDE_FABLE_5_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
  readonly preserveWhenCatalogReasoningFalse: true;
};
declare const CLAUDE_SONNET_5_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "minimal";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "adaptive";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "high";
};
declare const CLAUDE_OPUS_5_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "minimal";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "adaptive";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "high";
};
declare const CLAUDE_OPUS_55_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
  readonly preserveWhenCatalogReasoningFalse: true;
};
declare const CLAUDE_SONNET_55_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "high";
};
declare const CLAUDE_HAIKU_55_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
};
/** Resolve Haiku 5.5 through direct ids, cloud ids, aliases, or deployment metadata. */
declare function resolveClaudeHaiku55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeMythos5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/**
 * Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.1 require append-only runtime context.
 * Extend only with live replay proof (Mythos 5.1 remains unproven).
 */
declare function bindsClaudeThinkingPrefix(ref: ClaudeModelRef): boolean;
/** Return whether Claude accepts operator instructions within conversation history. */
declare function supportsClaudeInHistorySystemMessages(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
declare function requiresClaudeMandatoryAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Sonnet 5 through aliases, direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeSonnet5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the Sonnet 5.5 contract without matching other Sonnet 5 generations. */
declare function resolveClaudeSonnet55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Sonnet 5.5 replaces disabled thinking with between-tool progress updates. */
declare function requiresClaudeBetweenToolsThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeOpus5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the Opus 5.5 contract without matching other Opus 5 generations. */
declare function resolveClaudeOpus55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model supports adaptive thinking. */
declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model has a native 1M-token context window. */
declare function supportsClaude1MContext(ref: ClaudeModelRef): boolean;
/** Return whether Anthropic documents threshold compaction (`compact_20260112`) for a Claude model. */
declare function supportsClaudeServerCompaction(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports Anthropic's native fast mode. */
declare function supportsClaudeFastMode(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native max effort. */
declare function supportsClaudeNativeMaxEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native xhigh effort. */
declare function supportsClaudeNativeXhighEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model rejects caller-selected sampling parameters. */
declare function requiresClaudeDefaultSampling(ref: ClaudeModelRef): boolean;
/**
 * Fill native Claude effort mappings only when the provider did not publish a
 * narrower route-specific contract.
 */
declare function resolveClaudeNativeThinkingLevelMap(ref: ClaudeEffortModelRef): Record<string, string | null | undefined> | undefined;
//#endregion
//#region packages/llm-core/src/utils/provider-refusal.d.ts
/** Provider-authored findings; continuation is offered only after explicit user review. */
type ProviderRefusalReview = {
  explanation: string;
  continuation?: {
    message: string;
  };
  errorType?: string;
};
/** Keep exact provider text. Truncation must never make an invalid continuation usable. */
declare function readProviderRefusalReview(value: unknown): ProviderRefusalReview | undefined;
//#endregion
//#region packages/llm-core/src/usage-cost.d.ts
declare function normalizeModelCostConfig(cost: RawModelCostConfig): ModelCostConfig;
declare function normalizeResolvedPricing(cost: Partial<RawModelCostConfig>): ModelCostConfig;
/** Price one model call, selecting its tier before billing the separate token buckets. */
declare function calculateUsageCost(usage: Partial<Pick<Usage, "input" | "output" | "cacheRead" | "cacheWrite" | "cacheWrite1h">>, pricing: RawModelCostConfig): Usage["cost"];
//#endregion
//#region packages/llm-core/src/utils/assistant-message-events.d.ts
declare function appendTextDeltaToAssistantMessage(message: AssistantMessage, contentIndex: number, delta: string): AssistantMessage;
declare namespace index_d_exports {
  export { AnthropicMessagesCompat, Api, AssistantDeliveryTtsFacts, AssistantImages, AssistantMessage, AssistantMessageDiagnostic, AssistantMessageEvent, AssistantMessageEventStream, AssistantMessageEventStreamContract, AssistantMessageEventStreamLike, CLAUDE_FABLE_5_THINKING_PROFILE, CLAUDE_HAIKU_55_THINKING_PROFILE, CLAUDE_OPUS_55_THINKING_PROFILE, CLAUDE_OPUS_5_THINKING_PROFILE, CLAUDE_SONNET_55_THINKING_PROFILE, CLAUDE_SONNET_5_THINKING_PROFILE, CacheRetention, CompleteSimpleFn, Context, DEFAULT_MISSING_TOOL_RESULT_TEXT, DiagnosticErrorInfo, EventStream, ImageContent, ImagesApi, ImagesContext, ImagesFunction, ImagesInputContent, ImagesModel, ImagesOptions, ImagesOutputContent, ImagesProvider, ImagesStopReason, KnownApi, KnownImagesApi, KnownImagesProvider, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE, MaybePromise, Message, Model, ModelCostConfig, ModelCostRates, ModelThinkingLevel, OpenAICompletionsCompat, OpenAIResponsesCompat, OpenRouterRouting, PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE, PricingTier, Provider, ProviderImagesOptions, ProviderRefusalReview, ProviderReplayState, ProviderResponse, ProviderStreamOptions, RUNTIME_CONTEXT_BEGIN_MARKER, RUNTIME_CONTEXT_CUSTOM_TYPE, RUNTIME_CONTEXT_END_MARKER, RUNTIME_CONTEXT_FOOTER, RUNTIME_CONTEXT_HEADER, RawModelCostConfig, RawPricingTier, RuntimeContextMessage, SimpleStreamOptions, StopReason, StreamFn, StreamFunction, StreamOptions, TextContent, TextSignatureV1, ThinkingBudgets, ThinkingContent, ThinkingLevel, ThinkingLevelMap, Tool, ToolCall, ToolResultMessage, Transport, Usage, UserMessage, ValidateToolArgumentsFn, VercelGatewayRouting, appendAssistantMessageDiagnostic, appendTextDeltaToAssistantMessage, bindsClaudeThinkingPrefix, calculateUsageCost, createAssistantMessageDiagnostic, createAssistantMessageEventStream, escapeRuntimeContextFooter, extractDiagnosticError, formatThrownValue, hasLegacyRuntimeContextEnvelope, hasRuntimeContextMarker, isProviderRefusalAssistantError, isRuntimeContextMessage, labelRuntimeContextContent, labelRuntimeContextText, normalizeModelCostConfig, normalizeResolvedPricing, readProviderRefusalReview, readRuntimeContextMetadata, requiresClaudeBetweenToolsThinking, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveClaudeFable5ModelIdentity, resolveClaudeHaiku55ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeOpus55ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet55ModelIdentity, resolveClaudeSonnet5ModelIdentity, runtimeContextContentToText, setRuntimeContextRetention, supportsClaude1MContext, supportsClaudeAdaptiveThinking, supportsClaudeFastMode, supportsClaudeInHistorySystemMessages, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, supportsClaudeServerCompaction, validateToolArguments, validateToolCall };
}
//#endregion
export { supportsClaudeInHistorySystemMessages as A, resolveClaudeOpus55ModelIdentity as C, supportsClaude1MContext as D, resolveClaudeSonnet5ModelIdentity as E, supportsClaudeNativeXhighEffort as M, supportsClaudeServerCompaction as N, supportsClaudeAdaptiveThinking as O, resolveClaudeNativeThinkingLevelMap as S, resolveClaudeSonnet55ModelIdentity as T, requiresClaudeMandatoryAdaptiveThinking as _, normalizeResolvedPricing as a, resolveClaudeModelIdentity as b, CLAUDE_FABLE_5_THINKING_PROFILE as c, CLAUDE_OPUS_5_THINKING_PROFILE as d, CLAUDE_SONNET_55_THINKING_PROFILE as f, requiresClaudeDefaultSampling as g, requiresClaudeBetweenToolsThinking as h, normalizeModelCostConfig as i, supportsClaudeNativeMaxEffort as j, supportsClaudeFastMode as k, CLAUDE_HAIKU_55_THINKING_PROFILE as l, bindsClaudeThinkingPrefix as m, appendTextDeltaToAssistantMessage as n, ProviderRefusalReview as o, CLAUDE_SONNET_5_THINKING_PROFILE as p, calculateUsageCost as r, readProviderRefusalReview as s, index_d_exports as t, CLAUDE_OPUS_55_THINKING_PROFILE as u, resolveClaudeFable5ModelIdentity as v, resolveClaudeOpus5ModelIdentity as w, resolveClaudeMythos5ModelIdentity as x, resolveClaudeHaiku55ModelIdentity as y };
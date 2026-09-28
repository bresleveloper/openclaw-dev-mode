import { $ as ThinkingContent, A as ModelCostRates, B as ProviderReplayState, C as KnownImagesApi, D as Message, E as MaybePromise, F as PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, G as SimpleStreamOptions, H as ProviderStreamOptions, I as PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE, J as StreamFunction, K as StopReason, L as PricingTier, M as OpenAICompletionsCompat, N as OpenAIResponsesCompat, O as Model, P as OpenRouterRouting, Q as ThinkingBudgets, R as Provider, S as KnownApi, T as MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE, U as RawModelCostConfig, V as ProviderResponse, W as RawPricingTier, X as TextContent, Y as StreamOptions, Z as TextSignatureV1, _ as ImagesModel, a as AssistantMessage, at as Transport, b as ImagesProvider, c as AssistantMessageEventStreamLike, ct as ValidateToolArgumentsFn, d as Context, dt as DiagnosticErrorInfo, et as ThinkingLevel, f as ImageContent, ft as appendAssistantMessageDiagnostic, g as ImagesInputContent, gt as isProviderRefusalAssistantError, h as ImagesFunction, ht as formatThrownValue, i as AssistantImages, it as ToolResultMessage, j as ModelThinkingLevel, k as ModelCostConfig, l as CacheRetention, lt as VercelGatewayRouting, m as ImagesContext, mt as extractDiagnosticError, n as Api, nt as Tool, o as AssistantMessageEvent, ot as Usage, p as ImagesApi, pt as createAssistantMessageDiagnostic, q as StreamFn, r as AssistantDeliveryTtsFacts, rt as ToolCall, s as AssistantMessageEventStreamContract, st as UserMessage, t as AnthropicMessagesCompat, tt as ThinkingLevelMap, u as CompleteSimpleFn, ut as AssistantMessageDiagnostic, v as ImagesOptions, w as KnownImagesProvider, x as ImagesStopReason, y as ImagesOutputContent, z as ProviderImagesOptions } from "./types-qZFbaDbK.mjs";
import { n as EventStream, r as createAssistantMessageEventStream, t as AssistantMessageEventStream } from "./event-stream-CjnIZZst.mjs";
import { n as validateToolCall, t as validateToolArguments } from "./validation-DhQhmt6t.mjs";
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
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeMythos5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/**
 * Prefix-bound thinking requires append-only runtime context. Extend this list
 * only with live replay proof for the model (Mythos 5.1 remains unproven).
 */
declare function bindsClaudeThinkingPrefix(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
declare function requiresClaudeMandatoryAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Sonnet 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeSonnet5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeOpus5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the Opus 5.5 contract without matching other Opus 5 generations. */
declare function resolveClaudeOpus55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model supports adaptive thinking. */
declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model has a native 1M-token context window. */
declare function supportsClaude1MContext(ref: ClaudeModelRef): boolean;
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
declare namespace index_d_exports {
  export { AnthropicMessagesCompat, Api, AssistantDeliveryTtsFacts, AssistantImages, AssistantMessage, AssistantMessageDiagnostic, AssistantMessageEvent, AssistantMessageEventStream, AssistantMessageEventStreamContract, AssistantMessageEventStreamLike, CLAUDE_FABLE_5_THINKING_PROFILE, CLAUDE_OPUS_55_THINKING_PROFILE, CLAUDE_OPUS_5_THINKING_PROFILE, CLAUDE_SONNET_5_THINKING_PROFILE, CacheRetention, CompleteSimpleFn, Context, DiagnosticErrorInfo, EventStream, ImageContent, ImagesApi, ImagesContext, ImagesFunction, ImagesInputContent, ImagesModel, ImagesOptions, ImagesOutputContent, ImagesProvider, ImagesStopReason, KnownApi, KnownImagesApi, KnownImagesProvider, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE, MaybePromise, Message, Model, ModelCostConfig, ModelCostRates, ModelThinkingLevel, OpenAICompletionsCompat, OpenAIResponsesCompat, OpenRouterRouting, PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE, PricingTier, Provider, ProviderImagesOptions, ProviderRefusalReview, ProviderReplayState, ProviderResponse, ProviderStreamOptions, RawModelCostConfig, RawPricingTier, SimpleStreamOptions, StopReason, StreamFn, StreamFunction, StreamOptions, TextContent, TextSignatureV1, ThinkingBudgets, ThinkingContent, ThinkingLevel, ThinkingLevelMap, Tool, ToolCall, ToolResultMessage, Transport, Usage, UserMessage, ValidateToolArgumentsFn, VercelGatewayRouting, appendAssistantMessageDiagnostic, bindsClaudeThinkingPrefix, calculateUsageCost, createAssistantMessageDiagnostic, createAssistantMessageEventStream, extractDiagnosticError, formatThrownValue, isProviderRefusalAssistantError, normalizeModelCostConfig, normalizeResolvedPricing, readProviderRefusalReview, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeOpus55ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity, supportsClaude1MContext, supportsClaudeAdaptiveThinking, supportsClaudeFastMode, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, validateToolArguments, validateToolCall };
}
//#endregion
export { supportsClaudeFastMode as C, supportsClaudeAdaptiveThinking as S, supportsClaudeNativeXhighEffort as T, resolveClaudeNativeThinkingLevelMap as _, ProviderRefusalReview as a, resolveClaudeSonnet5ModelIdentity as b, CLAUDE_OPUS_55_THINKING_PROFILE as c, bindsClaudeThinkingPrefix as d, requiresClaudeDefaultSampling as f, resolveClaudeMythos5ModelIdentity as g, resolveClaudeModelIdentity as h, normalizeResolvedPricing as i, CLAUDE_OPUS_5_THINKING_PROFILE as l, resolveClaudeFable5ModelIdentity as m, calculateUsageCost as n, readProviderRefusalReview as o, requiresClaudeMandatoryAdaptiveThinking as p, normalizeModelCostConfig as r, CLAUDE_FABLE_5_THINKING_PROFILE as s, index_d_exports as t, CLAUDE_SONNET_5_THINKING_PROFILE as u, resolveClaudeOpus55ModelIdentity as v, supportsClaudeNativeMaxEffort as w, supportsClaude1MContext as x, resolveClaudeOpus5ModelIdentity as y };
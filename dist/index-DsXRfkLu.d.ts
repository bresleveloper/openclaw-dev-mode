import { $ as AssistantMessageEventStreamLike, $t as ThinkingLevelMap, At as Provider, Bt as RawModelCostConfig, Cn as isProviderRefusalAssistantError, Ct as ModelThinkingLevel, Dt as PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, Et as OpenRouterRouting, Ft as RUNTIME_CONTEXT_BEGIN_MARKER, Gt as StreamFn, Ht as RuntimeContextMessage, It as RUNTIME_CONTEXT_CUSTOM_TYPE, J as AssistantDeliveryTtsFacts, Jt as TextContent, K as AnthropicMessagesCompat, Kt as StreamFunction, Lt as RUNTIME_CONTEXT_END_MARKER, Mt as ProviderReplayState, Nt as ProviderResponse, Ot as PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE, Pt as ProviderStreamOptions, Q as AssistantMessageEventStreamContract, Qt as ThinkingLevel, Rt as RUNTIME_CONTEXT_FOOTER, Sn as formatThrownValue, St as ModelCostRates, Tt as OpenAIResponsesCompat, Ut as SimpleStreamOptions, Vt as RawPricingTier, Wt as StopReason, X as AssistantMessage, Xt as ThinkingBudgets, Y as AssistantImages, Yt as TextSignatureV1, Z as AssistantMessageEvent, Zt as ThinkingContent, _n as AssistantMessageDiagnostic, _t as MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE, an as UserMessage, at as ImagesApi, bn as createAssistantMessageDiagnostic, bt as Model, cn as escapeRuntimeContextFooter, ct as ImagesInputContent, dn as isRuntimeContextMessage, dt as ImagesOutputContent, en as Tool, et as CacheRetention, fn as labelRuntimeContextContent, ft as ImagesProvider, gn as setRuntimeContextRetention, gt as KnownImagesProvider, hn as runtimeContextContentToText, ht as KnownImagesApi, in as Usage, it as ImageContent, jt as ProviderImagesOptions, kt as PricingTier, ln as hasLegacyRuntimeContextEnvelope, lt as ImagesModel, mn as readRuntimeContextMetadata, mt as KnownApi, nn as ToolResultMessage, nt as Context, on as ValidateToolArgumentsFn, ot as ImagesContext, pn as labelRuntimeContextText, pt as ImagesStopReason, q as Api, qt as StreamOptions, rn as Transport, rt as DEFAULT_MISSING_TOOL_RESULT_TEXT, sn as VercelGatewayRouting, st as ImagesFunction, tn as ToolCall, tt as CompleteSimpleFn, un as hasRuntimeContextMarker, ut as ImagesOptions, vn as DiagnosticErrorInfo, vt as MaybePromise, wt as OpenAICompletionsCompat, xn as extractDiagnosticError, xt as ModelCostConfig, yn as appendAssistantMessageDiagnostic, yt as Message, zt as RUNTIME_CONTEXT_HEADER } from "./types-D7I_F5Ux.js";
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
//#region packages/llm-core/src/usage-cost.d.ts
declare function normalizeModelCostConfig(cost: RawModelCostConfig): ModelCostConfig;
declare function normalizeResolvedPricing(cost: Partial<RawModelCostConfig>): ModelCostConfig;
/** Price one model call, selecting its tier before billing the separate token buckets. */
declare function calculateUsageCost(usage: Partial<Pick<Usage, "input" | "output" | "cacheRead" | "cacheWrite" | "cacheWrite1h">>, pricing: RawModelCostConfig): Usage["cost"];
//#endregion
//#region packages/llm-core/src/utils/assistant-message-events.d.ts
declare function appendTextDeltaToAssistantMessage(message: AssistantMessage, contentIndex: number, delta: string): AssistantMessage;
//#endregion
//#region packages/llm-core/src/utils/event-stream.d.ts
/** Generic async-iterable event stream with a separately awaited final result. */
declare class EventStream<T, R = T> implements AsyncIterable<T> {
  protected queue: (T | undefined)[];
  private queueHead;
  private waiting;
  protected done: boolean;
  private resultSettled;
  private finalResultPromise;
  private resolveFinalResult;
  private rejectFinalResult;
  private isComplete;
  private extractResult;
  constructor(isComplete: (event: T) => boolean, extractResult: (event: T) => R);
  push(event: T): void;
  end(result?: R): void;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  result(): Promise<R>;
}
/** Assistant-message event stream that resolves on done/error terminal events. */
declare class AssistantMessageEventStream extends EventStream<AssistantMessageEvent, AssistantMessage> implements AssistantMessageEventStreamContract {
  private activeThinkingBlocks?;
  push(event: AssistantMessageEvent): void;
  end(result?: AssistantMessage): void;
  private clearThinkingAppends;
  constructor();
}
/** Creates an assistant-message stream for provider and plugin adapters. */
declare function createAssistantMessageEventStream(): AssistantMessageEventStream;
//#endregion
//#region packages/llm-core/src/validation.d.ts
/** Finds the target tool and validates/coerces a model-emitted tool call. */
declare function validateToolCall(tools: Tool[], toolCall: ToolCall): unknown;
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
declare function validateToolArguments(tool: Tool, toolCall: ToolCall): unknown;
declare namespace index_d_exports {
  export { AnthropicMessagesCompat, Api, AssistantDeliveryTtsFacts, AssistantImages, AssistantMessage, AssistantMessageDiagnostic, AssistantMessageEvent, AssistantMessageEventStream, AssistantMessageEventStreamContract, AssistantMessageEventStreamLike, CLAUDE_FABLE_5_THINKING_PROFILE, CLAUDE_HAIKU_55_THINKING_PROFILE, CLAUDE_OPUS_55_THINKING_PROFILE, CLAUDE_OPUS_5_THINKING_PROFILE, CLAUDE_SONNET_55_THINKING_PROFILE, CLAUDE_SONNET_5_THINKING_PROFILE, CacheRetention, CompleteSimpleFn, Context, DEFAULT_MISSING_TOOL_RESULT_TEXT, DiagnosticErrorInfo, EventStream, ImageContent, ImagesApi, ImagesContext, ImagesFunction, ImagesInputContent, ImagesModel, ImagesOptions, ImagesOutputContent, ImagesProvider, ImagesStopReason, KnownApi, KnownImagesApi, KnownImagesProvider, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE, MaybePromise, Message, Model, ModelCostConfig, ModelCostRates, ModelThinkingLevel, OpenAICompletionsCompat, OpenAIResponsesCompat, OpenRouterRouting, PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE, PricingTier, Provider, ProviderImagesOptions, ProviderRefusalReview, ProviderReplayState, ProviderResponse, ProviderStreamOptions, RUNTIME_CONTEXT_BEGIN_MARKER, RUNTIME_CONTEXT_CUSTOM_TYPE, RUNTIME_CONTEXT_END_MARKER, RUNTIME_CONTEXT_FOOTER, RUNTIME_CONTEXT_HEADER, RawModelCostConfig, RawPricingTier, RuntimeContextMessage, SimpleStreamOptions, StopReason, StreamFn, StreamFunction, StreamOptions, TextContent, TextSignatureV1, ThinkingBudgets, ThinkingContent, ThinkingLevel, ThinkingLevelMap, Tool, ToolCall, ToolResultMessage, Transport, Usage, UserMessage, ValidateToolArgumentsFn, VercelGatewayRouting, appendAssistantMessageDiagnostic, appendTextDeltaToAssistantMessage, bindsClaudeThinkingPrefix, calculateUsageCost, createAssistantMessageDiagnostic, createAssistantMessageEventStream, escapeRuntimeContextFooter, extractDiagnosticError, formatThrownValue, hasLegacyRuntimeContextEnvelope, hasRuntimeContextMarker, isProviderRefusalAssistantError, isRuntimeContextMessage, labelRuntimeContextContent, labelRuntimeContextText, normalizeModelCostConfig, normalizeResolvedPricing, readProviderRefusalReview, readRuntimeContextMetadata, requiresClaudeBetweenToolsThinking, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveClaudeFable5ModelIdentity, resolveClaudeHaiku55ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeOpus55ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet55ModelIdentity, resolveClaudeSonnet5ModelIdentity, runtimeContextContentToText, setRuntimeContextRetention, supportsClaude1MContext, supportsClaudeAdaptiveThinking, supportsClaudeFastMode, supportsClaudeInHistorySystemMessages, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, supportsClaudeServerCompaction, validateToolArguments, validateToolCall };
}
//#endregion
export { ProviderRefusalReview as n, index_d_exports as t };
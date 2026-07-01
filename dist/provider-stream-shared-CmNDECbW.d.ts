import { P as AssistantMessageDiagnostic } from "./types-Boa_mcGH.js";
import { T as StreamFn } from "./types-BoFHdU9q.js";
import { p as ThinkLevel } from "./commands-registry.types-BMJ8ysZi.js";
import { Wn as ProviderWrapStreamFnContext$1 } from "./types-BVLQjFJF.js";
//#region src/llm/providers/stream-wrappers/stream-payload-utils.d.ts
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
declare function streamWithPayloadPatch(underlying: StreamFn, model: Parameters<StreamFn>[0], context: Parameters<StreamFn>[1], options: Parameters<StreamFn>[2], patchPayload: (payload: Record<string, unknown>) => void): ReturnType<StreamFn>;
//#endregion
//#region src/shared/anthropic-refusal.d.ts
type AnthropicRefusalOutput = {
  stopReason: string;
  errorMessage?: string;
  diagnostics?: AssistantMessageDiagnostic[];
};
declare function applyAnthropicRefusal(output: AnthropicRefusalOutput, stopDetails: unknown, provider: string): void;
//#endregion
//#region src/shared/deferred-event-buffer.d.ts
type EventSink<T> = {
  push(event: T): void;
};
declare function createDeferredEventBuffer<T>(sink: EventSink<T>, onBufferedEvent?: () => void): {
  push(event: T): void;
  flush(): void;
  discard(): void;
};
//#endregion
//#region src/shared/llm-request-activity.d.ts
declare function notifyLlmRequestActivity(signal: AbortSignal | undefined): void;
declare function onLlmRequestActivity(signal: AbortSignal, listener: () => void): () => void;
//#endregion
//#region src/agents/anthropic-payload-policy.d.ts
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
type AnthropicServiceTier = "auto" | "standard_only";
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
type AnthropicEphemeralCacheControl = {
  type: "ephemeral";
  ttl?: "1h";
};
type AnthropicPayloadPolicyInput = {
  api?: string;
  baseUrl?: string;
  cacheRetention?: "short" | "long" | "none";
  enableCacheControl?: boolean;
  provider?: string;
  serviceTier?: AnthropicServiceTier;
};
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
type AnthropicPayloadPolicy = {
  allowsServiceTier: boolean;
  cacheControl: AnthropicEphemeralCacheControl | undefined;
  serviceTier: AnthropicServiceTier | undefined;
};
/** Resolve Anthropic cache-control marker retention for a request endpoint. */
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function resolveAnthropicPayloadPolicy(input: AnthropicPayloadPolicyInput): AnthropicPayloadPolicy;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function applyAnthropicPayloadPolicyToParams(payloadObj: Record<string, unknown>, policy: AnthropicPayloadPolicy): void;
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
declare function applyAnthropicEphemeralCacheControlMarkers(payloadObj: Record<string, unknown>, cacheControl?: AnthropicEphemeralCacheControl | null): void;
//#endregion
//#region src/llm/providers/stream-wrappers/zai.d.ts
/**
 * Inject `tool_stream=true` so tool-call deltas stream in real time.
 * Providers can disable this by setting `params.tool_stream=false`.
 *
 * @deprecated Provider-owned stream helper; do not use from third-party plugins.
 */
declare function createToolStreamWrapper(baseStreamFn: StreamFn | undefined, enabled: boolean): StreamFn;
/** @deprecated Z.ai provider-owned stream helper; do not use from third-party plugins. */
declare const createZaiToolStreamWrapper: typeof createToolStreamWrapper;
//#endregion
//#region src/plugin-sdk/provider-stream-shared.d.ts
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
/** Optional provider stream decorator factory used by shared provider wrappers. */
type ProviderStreamWrapperFactory = /** Wrapper factory that can decorate, replace, or omit a provider stream function. */((streamFn: StreamFn | undefined) => StreamFn | undefined) | null | undefined | false;
/** Compose stream wrapper factories from left to right around a base stream function. */
declare function composeProviderStreamWrappers(/** Base provider stream function to pass through the wrapper chain. */

baseStreamFn: StreamFn | undefined, /** Ordered wrapper factories; falsey entries are skipped. */...wrappers: ProviderStreamWrapperFactory[]): StreamFn | undefined;
/**
 * Provider stream wrapper for local/proxy providers that sometimes emit a
 * standalone textual tool-call block even when native tool calling is enabled.
 */
declare function createPlainTextToolCallCompatWrapper(/** Provider stream function to wrap; defaults to the simple stream implementation. */

baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated Bundled provider stream helper; do not use from third-party plugins. */
declare function defaultToolStreamExtraParams(/** Existing provider extra params; explicit tool_stream values are preserved. */

extraParams?: Record<string, unknown>): Record<string, unknown>;
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
declare function createPayloadPatchStreamWrapper(/** Provider stream function whose outbound payload should be patched. */

baseStreamFn: StreamFn | undefined, patchPayload: (params: {
  /** Mutable provider payload immediately before the underlying stream dispatches it. */payload: Record<string, unknown>; /** Model selected for the stream call. */
  model: Parameters<StreamFn>[0]; /** Stream context passed by the runtime. */
  context: Parameters<StreamFn>[1]; /** Stream options passed by the runtime. */
  options: Parameters<StreamFn>[2];
}) => void, wrapperOptions?: {
  shouldPatch?: (params: {
    /** Model selected for the stream call. */model: Parameters<StreamFn>[0]; /** Stream context passed by the runtime. */
    context: Parameters<StreamFn>[1]; /** Stream options passed by the runtime. */
    options: Parameters<StreamFn>[2];
  }) => boolean;
}): StreamFn;
/**
 * Applies explicit disabled-thinking intent to OpenAI-compatible Chat
 * Completions payloads without changing enabled reasoning levels.
 */
declare function createOpenAICompatibleCompletionsThinkingOffWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: ThinkLevel): StreamFn;
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
declare function stripTrailingAnthropicAssistantPrefillWhenThinking(payload: Record<string, unknown>): number;
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
declare function createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn: StreamFn | undefined, onStripped?: (stripped: number) => void, wrapperOptions?: Parameters<typeof createPayloadPatchStreamWrapper>[2]): StreamFn;
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
type OpenAICompatibleThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
declare function isOpenAICompatibleThinkingEnabled(params: {
  thinkingLevel: OpenAICompatibleThinkingLevel;
  options: Parameters<StreamFn>[2];
}): boolean;
/** Applies the shared reasoning payload policy used by OpenAI-compatible proxy providers. */
declare function normalizeOpenAICompatibleReasoningPayload(payload: Record<string, unknown>, thinkingLevel?: ThinkLevel): void;
/** Applies Qwen chat-template thinking flags without discarding provider-specific kwargs. */
declare function setQwenChatTemplateThinking(payload: Record<string, unknown>, enabled: boolean): void;
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
type DeepSeekV4ThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
type DeepSeekV4ReasoningEffort = "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
declare function createDeepSeekV4OpenAICompatibleThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  thinkingLevel: DeepSeekV4ThinkingLevel;
  shouldPatchModel: (model: Parameters<StreamFn>[0]) => boolean;
  resolveReasoningEffort?: (thinkingLevel: DeepSeekV4ThinkingLevel) => DeepSeekV4ReasoningEffort;
  shouldBackfillAssistantReasoningContent?: (message: Record<string, unknown>) => boolean;
}): StreamFn | undefined;
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
declare function createThinkingOnlyFinalTextWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  shouldPatchModel: (model: Parameters<StreamFn>[0]) => boolean;
}): StreamFn | undefined;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingLevel = "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingInputLevel = "off" | "minimal" | "low" | "medium" | "adaptive" | "high" | "max" | "xhigh";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleThinkingRequiredModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini25ThinkingBudgetModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini3ProModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini3FlashModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini3ThinkingLevelModel(modelId: string): boolean;
/**
 * Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function resolveGoogleGemini3ThinkingLevel(params: {
  modelId?: string;
  thinkingLevel?: GoogleThinkingInputLevel;
  thinkingBudget?: number;
}): GoogleThinkingLevel | undefined;
/**
 * Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function stripInvalidGoogleThinkingBudget(params: {
  thinkingConfig: Record<string, unknown>;
  modelId?: string;
}): boolean;
/**
 * Normalizes Google thinking config across SDK payload shapes before provider transport.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function sanitizeGoogleThinkingPayload(params: {
  payload: unknown;
  modelId?: string;
  thinkingLevel?: GoogleThinkingInputLevel;
}): void;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: GoogleThinkingInputLevel): StreamFn;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingStreamWrapper(ctx: ProviderWrapStreamFnContext): NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
//#endregion
export { createZaiToolStreamWrapper as A, normalizeOpenAICompatibleReasoningPayload as C, stripInvalidGoogleThinkingBudget as D, setQwenChatTemplateThinking as E, onLlmRequestActivity as F, createDeferredEventBuffer as I, applyAnthropicRefusal as L, applyAnthropicPayloadPolicyToParams as M, resolveAnthropicPayloadPolicy as N, stripTrailingAnthropicAssistantPrefillWhenThinking as O, notifyLlmRequestActivity as P, streamWithPayloadPatch as R, isOpenAICompatibleThinkingEnabled as S, sanitizeGoogleThinkingPayload as T, isGoogleGemini25ThinkingBudgetModel as _, OpenAICompatibleThinkingLevel as a, isGoogleGemini3ThinkingLevelModel as b, createAnthropicThinkingPrefillPayloadWrapper as c, createGoogleThinkingStreamWrapper as d, createOpenAICompatibleCompletionsThinkingOffWrapper as f, defaultToolStreamExtraParams as g, createThinkingOnlyFinalTextWrapper as h, GoogleThinkingLevel as i, applyAnthropicEphemeralCacheControlMarkers as j, createToolStreamWrapper as k, createDeepSeekV4OpenAICompatibleThinkingWrapper as l, createPlainTextToolCallCompatWrapper as m, DeepSeekV4ThinkingLevel as n, ProviderStreamWrapperFactory as o, createPayloadPatchStreamWrapper as p, GoogleThinkingInputLevel as r, composeProviderStreamWrappers as s, DeepSeekV4ReasoningEffort as t, createGoogleThinkingPayloadWrapper as u, isGoogleGemini3FlashModel as v, resolveGoogleGemini3ThinkingLevel as w, isGoogleThinkingRequiredModel as x, isGoogleGemini3ProModel as y };
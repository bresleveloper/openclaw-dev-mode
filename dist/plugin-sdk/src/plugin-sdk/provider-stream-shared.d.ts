import type { StreamFn } from "../agents/runtime/index.js";
import type { ThinkLevel } from "../auto-reply/thinking.js";
import { streamWithPayloadPatch } from "../llm/providers/stream-wrappers/stream-payload-utils.js";
export { applyAnthropicRefusal } from "../shared/anthropic-refusal.js";
export { createDeferredEventBuffer } from "../shared/deferred-event-buffer.js";
export { notifyLlmRequestActivity, onLlmRequestActivity } from "../shared/llm-request-activity.js";
type ProviderWrapStreamFnContext = import("../plugins/types.js").ProviderWrapStreamFnContext;
/** Optional provider stream decorator factory used by shared provider wrappers. */
export type ProviderStreamWrapperFactory = 
/** Wrapper factory that can decorate, replace, or omit a provider stream function. */
((streamFn: StreamFn | undefined) => StreamFn | undefined) | null | undefined | false;
/** Compose stream wrapper factories from left to right around a base stream function. */
export declare function composeProviderStreamWrappers(
/** Base provider stream function to pass through the wrapper chain. */
baseStreamFn: StreamFn | undefined, 
/** Ordered wrapper factories; falsey entries are skipped. */
...wrappers: ProviderStreamWrapperFactory[]): StreamFn | undefined;
/**
 * Provider stream wrapper for local/proxy providers that sometimes emit a
 * standalone textual tool-call block even when native tool calling is enabled.
 */
export declare function createPlainTextToolCallCompatWrapper(
/** Provider stream function to wrap; defaults to the simple stream implementation. */
baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated Bundled provider stream helper; do not use from third-party plugins. */
export declare function defaultToolStreamExtraParams(
/** Existing provider extra params; explicit tool_stream values are preserved. */
extraParams?: Record<string, unknown>): Record<string, unknown>;
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
export declare function createPayloadPatchStreamWrapper(
/** Provider stream function whose outbound payload should be patched. */
baseStreamFn: StreamFn | undefined, patchPayload: (params: {
    /** Mutable provider payload immediately before the underlying stream dispatches it. */
    payload: Record<string, unknown>;
    /** Model selected for the stream call. */
    model: Parameters<StreamFn>[0];
    /** Stream context passed by the runtime. */
    context: Parameters<StreamFn>[1];
    /** Stream options passed by the runtime. */
    options: Parameters<StreamFn>[2];
}) => void, wrapperOptions?: {
    shouldPatch?: (params: {
        /** Model selected for the stream call. */
        model: Parameters<StreamFn>[0];
        /** Stream context passed by the runtime. */
        context: Parameters<StreamFn>[1];
        /** Stream options passed by the runtime. */
        options: Parameters<StreamFn>[2];
    }) => boolean;
}): StreamFn;
/**
 * Applies explicit disabled-thinking intent to OpenAI-compatible Chat
 * Completions payloads without changing enabled reasoning levels.
 */
export declare function createOpenAICompatibleCompletionsThinkingOffWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: ThinkLevel): StreamFn;
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
export declare function stripTrailingAnthropicAssistantPrefillWhenThinking(payload: Record<string, unknown>): number;
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
export declare function createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn: StreamFn | undefined, onStripped?: (stripped: number) => void, wrapperOptions?: Parameters<typeof createPayloadPatchStreamWrapper>[2]): StreamFn;
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
export type OpenAICompatibleThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
export declare function isOpenAICompatibleThinkingEnabled(params: {
    thinkingLevel: OpenAICompatibleThinkingLevel;
    options: Parameters<StreamFn>[2];
}): boolean;
/** Applies the shared reasoning payload policy used by OpenAI-compatible proxy providers. */
export declare function normalizeOpenAICompatibleReasoningPayload(payload: Record<string, unknown>, thinkingLevel?: ThinkLevel): void;
/** Applies Qwen chat-template thinking flags without discarding provider-specific kwargs. */
export declare function setQwenChatTemplateThinking(payload: Record<string, unknown>, enabled: boolean): void;
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
export type DeepSeekV4ThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
export type DeepSeekV4ReasoningEffort = "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
export declare function createDeepSeekV4OpenAICompatibleThinkingWrapper(params: {
    baseStreamFn: StreamFn | undefined;
    thinkingLevel: DeepSeekV4ThinkingLevel;
    shouldPatchModel: (model: Parameters<StreamFn>[0]) => boolean;
    resolveReasoningEffort?: (thinkingLevel: DeepSeekV4ThinkingLevel) => DeepSeekV4ReasoningEffort;
    shouldBackfillAssistantReasoningContent?: (message: Record<string, unknown>) => boolean;
}): StreamFn | undefined;
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
export declare function createThinkingOnlyFinalTextWrapper(params: {
    baseStreamFn: StreamFn | undefined;
    shouldPatchModel: (model: Parameters<StreamFn>[0]) => boolean;
}): StreamFn | undefined;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export type GoogleThinkingLevel = "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export type GoogleThinkingInputLevel = "off" | "minimal" | "low" | "medium" | "adaptive" | "high" | "max" | "xhigh";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function isGoogleThinkingRequiredModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function isGoogleGemini25ThinkingBudgetModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function isGoogleGemini3ProModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function isGoogleGemini3FlashModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function isGoogleGemini3ThinkingLevelModel(modelId: string): boolean;
/**
 * Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
export declare function resolveGoogleGemini3ThinkingLevel(params: {
    modelId?: string;
    thinkingLevel?: GoogleThinkingInputLevel;
    thinkingBudget?: number;
}): GoogleThinkingLevel | undefined;
/**
 * Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
export declare function stripInvalidGoogleThinkingBudget(params: {
    thinkingConfig: Record<string, unknown>;
    modelId?: string;
}): boolean;
/**
 * Normalizes Google thinking config across SDK payload shapes before provider transport.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
export declare function sanitizeGoogleThinkingPayload(params: {
    payload: unknown;
    modelId?: string;
    thinkingLevel?: GoogleThinkingInputLevel;
}): void;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: GoogleThinkingInputLevel): StreamFn;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
export declare function createGoogleThinkingStreamWrapper(ctx: ProviderWrapStreamFnContext): NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
export { applyAnthropicPayloadPolicyToParams, resolveAnthropicPayloadPolicy, } from "../agents/anthropic-payload-policy.js";
export { applyAnthropicEphemeralCacheControlMarkers } from "../llm/providers/stream-wrappers/anthropic-cache-control-payload.js";
export { createMoonshotThinkingWrapper, resolveMoonshotThinkingType, } from "../llm/providers/stream-wrappers/moonshot-thinking.js";
export { streamWithPayloadPatch };
export { createToolStreamWrapper, createZaiToolStreamWrapper, } from "../llm/providers/stream-wrappers/zai.js";

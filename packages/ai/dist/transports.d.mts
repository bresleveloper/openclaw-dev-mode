import "./index-DSprYWaz.mjs";
import { $ as StopReason, N as OpenAICompletionsCompat, Nt as ModelDataThinkingFormat, Q as SimpleStreamOptions, V as ProviderReplayState, a as AssistantMessage, d as Context, et as StreamFn, gt as VercelGatewayRouting, k as Model, l as CacheRetention, lt as Tool, n as Api, nt as StreamOptions, ot as ThinkingContent, pt as Usage, rt as TextContent, ut as ToolCall } from "./types-CVYzKrMl.mjs";
import { n as ApiRegistry } from "./api-registry-gDt0faai.mjs";
import { o as AiProviderStreamHookContext } from "./host-jJOffdlW.mjs";
import { a as BaseOpenAIStreamOptions, c as OpenAICompletionsOptions, l as OpenAIResponsesCompactionRejection, m as OpenAIToolProjection, o as CodeModeToolSurfaceObservation, s as CompactionReplayRejection } from "./provider-options-DAzsyi49.mjs";
import "./types-CBJthzJX.mjs";
import { a as buildAnthropicSystemBlocks, c as logAnthropicContextEdits, d as resolveAnthropicPayloadPolicy, f as resolveAnthropicRequestBetaHeader, i as applyAnthropicRequestCacheControl, l as resolveAnthropicCacheOptions, m as supportsAnthropicServerSideFallback, n as applyAnthropicEphemeralCacheControlMarkers, o as isAnthropicServerToolClearingEnabled, p as resolveAnthropicServerCompactionPlan, r as applyAnthropicPayloadPolicyToParams, s as isDirectAnthropicModel, t as applyAnthropicContextManagementToRequest, u as resolveAnthropicEphemeralCacheControl } from "./anthropic-payload-policy-C0ki72BT.mjs";
import { a as resolveOpenAICompletionsCompat, i as isOpenAICodexResponsesModel, n as detectOpenAICompletionsCompat, o as resolveOpenAIPromptCacheKeySupport, r as isNativeOpenAIEndpoint, s as usesNativeOpenAICodexResponsesBackend, t as ResolvedOpenAICompletionsCompat } from "./openai-completions-compat-CBvb2eld.mjs";
import { a as ReplayableResponseReasoningItem, n as OpenAIResponsesOptions, r as OpenAIResponsesReasoningReplayMetadata, u as OpenAIResponsesCompactionOutput } from "./openai-responses-contracts-B1nkeLL6.mjs";
import { a as resolveOpenAIResponsesPayloadPolicy, i as resolveOpenAIResponsesCompactEndpointPlan, n as applyOpenAIResponsesPayloadPolicy, o as resolveOpenAIResponsesRequestContextTokens, r as normalizeOpenAIServiceTier, s as resolveOpenAIResponsesServerCompactionPlan, t as OpenAIServiceTier } from "./openai-responses-payload-policy-BzM52TTH.mjs";
import { n as captureOpenAIResponsesCompaction, t as CompactionReplayRefreshRequiredError } from "./openai-responses-compaction-replay-_sUXtcwU.mjs";
import { C as withProviderAcceptanceObserver, S as transportAbortError, _ as notifyProviderStreamOpened, a as coerceTransportToolCallArguments, b as sanitizeTransportPayloadText, c as createModelStreamCooperativeScheduler, d as finalizeTerminalToolCallArguments, f as finalizeTransportStream, g as notifyProviderHttpResponse, h as notifyProviderHttpMetadata, i as assignTransportErrorDetails, l as createWritableTransportEventStream, m as mergeTransportHeaders, n as ProviderAcceptance, o as copyProviderAcceptanceObserver, p as iterateModelStream, r as WritableTransportStream, s as createEmptyTransportUsage, t as IncompleteToolCallError, u as failTransportStream, v as parseTerminalToolCallArguments, w as withProviderResponseHook, x as throwIfModelStreamAborted, y as sanitizeNonEmptyTransportPayloadText } from "./transport-stream-shared-8ru8eX4s.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-Cwcjv_fx.mjs";
import { a as ProviderContext, c as ProviderModel, f as VideoContent } from "./provider-types-CWl4VXvE.mjs";
import { a as resolveModelPayloadDebugMode, i as emitModelTransportError, n as formatModelTransportDebugUrl, o as resolveModelSseDebugMode, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl } from "./model-transport-url-BrsjjdjR.mjs";
import { Part } from "@google/genai";
import OpenAI from "openai";
import { ChatCompletionChunk } from "openai/resources/chat/completions.js";
//#region packages/ai/src/transports/anthropic-transport-stream.d.ts
/** Resolve the Anthropic Messages endpoint URL for the effective base URL. */
export declare function resolveAnthropicMessagesUrl(baseUrl?: string): string;
/** Create the stream function used by Anthropic Messages transport models. */
export declare function createAnthropicMessagesTransportStreamFn(): StreamFn;
//#endregion
//#region packages/ai/src/transports/anthropic-transport-options.d.ts
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
export declare function resolveCompletionTokenReservation(model: Model, maxTokens: number, reasoning: SimpleStreamOptions["reasoning"]): number;
//#endregion
//#region packages/ai/src/transports/deepseek-text-filter.d.ts
/** Create an incremental text filter that strips DeepSeek DSML tool blocks. */
export declare function createDeepSeekTextFilter(): {
  push(chunk: string): string[];
  flush(): string[];
};
//#endregion
//#region packages/ai/src/transports/google-thinking-level.d.ts
/** Reports MINIMAL support for Gemini Flash and Gemini 4 models. */
export declare function googleFlashSupportsMinimalThinking(modelId: string): boolean;
//#endregion
//#region packages/ai/src/transports/json-unsafe-integers.d.ts
/** Quotes integer literals above Number.MAX_SAFE_INTEGER before JSON.parse. */
export declare function quoteUnsafeIntegerLiterals(input: string): string;
/** Parses JSON while preserving unsafe integer literals as strings. */
export declare function parseJsonPreservingUnsafeIntegers(input: string): unknown;
/** Parses or accepts an object while preserving unsafe integer literals in string input. */
export declare function parseJsonObjectPreservingUnsafeIntegers(value: unknown): Record<string, unknown> | null;
//#endregion
//#region packages/ai/src/transports/model-max-tokens-params.d.ts
/** Resolve the first supported max-token parameter present in a params object. */
export declare function resolveMaxTokensParam(params: Record<string, unknown> | undefined): number | undefined;
/**
 * Canonicalize merged params to `maxTokens`, preserving source precedence from
 * left to right across the provided source objects.
 */
export declare function canonicalizeMaxTokensParam(params: {
  merged: Record<string, unknown>;
  sources: Array<Record<string, unknown> | undefined>;
}): void;
//#endregion
//#region packages/ai/src/transports/openai-compatible-conversation-turn.d.ts
/** Returns whether an OpenAI-compatible messages payload contains a usable turn. */
export declare function hasOpenAICompatibleConversationTurn(messages: unknown): boolean;
//#endregion
//#region packages/ai/src/transports/openai-completions-cache-control.d.ts
type CacheControl = {
  type: "ephemeral";
  ttl?: "1h" | "5m";
};
/** Shared Chat Completions policy; repeated wrapper application preserves existing checkpoints. */
export declare function applyCompletionsAnthropicCacheControl(payload: Record<string, unknown>, cacheControl?: CacheControl | null, cacheOptOutIndexes?: ReadonlySet<number>, markTools?: boolean, markMessages?: boolean): void;
//#endregion
//#region packages/ai/src/transports/openai-completions-string-content.d.ts
/** Flatten string-only text block content arrays into newline-joined strings. */
export declare function flattenCompletionMessagesToStringContent(messages: unknown[]): unknown[];
/** Strip completion messages to role/content fields for strict providers. */
export declare function stripCompletionMessagesToRoleContent(messages: unknown[]): unknown[];
//#endregion
//#region packages/ai/src/transports/openai-transport-shared.d.ts
export declare const GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP = "skip_thought_signature_validator";
export declare const log: {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
};
export declare function createResponseModelTracker(enabled?: boolean): {
  begin: (headers?: Headers) => void;
  observeEvent: (event: unknown) => string | undefined;
  resolve: () => string | undefined;
  track(response: Pick<Response, "headers"> | undefined, stream: AsyncIterable<unknown>): AsyncIterable<unknown>;
  terminalOptions: {
    resolveResponseModel: () => string | undefined;
  } | {
    resolveResponseModel?: undefined;
  };
};
export declare function resolveOpenAIClientBaseUrl(model: Pick<Model, "provider" | "baseUrl">, baseUrl?: string | undefined): string | undefined;
export type OpenAICompletionsTextSource = "reasoning_detail" | "refusal";
export type OpenAICompletionsContentDelta = {
  kind: "thinking";
  signature?: string;
  text: string;
} | {
  kind: "text";
  text: string;
  source?: OpenAICompletionsTextSource;
};
type OpenAICompletionsReasoningBatch = {
  readonly deltas: readonly OpenAICompletionsContentDelta[];
  readonly mirroredThinking: readonly string[];
  readonly hasThinking: boolean;
  readonly hasVisibleText: boolean;
};
export declare function readOpenAICompletionsReasoningBatch(delta: Record<string, unknown>, visibleReasoningDetailTypes: ReadonlySet<string>): OpenAICompletionsReasoningBatch;
type OpenAIModeCompatInput = Omit<OpenAICompletionsCompat, "thinkingFormat"> & {
  thinkingFormat?: string;
  requiresStringContent?: boolean;
  strictMessageKeys?: boolean;
  unsupportedToolSchemaKeywords?: unknown;
  omitEmptyArrayItems?: unknown;
  visibleReasoningDetailTypes?: string[];
};
export type OpenAIModeModel = Omit<Model, "compat"> & {
  compat?: OpenAIModeCompatInput | null;
};
export type MutableAssistantOutput = Omit<AssistantMessage, "content" | "usage"> & {
  content: Array<TextContent | ThinkingContent | ToolCall>;
  usage: Usage & {
    reasoningTokens?: number;
  };
};
export declare function detachPartialSnapshot<TEvent>(event: TEvent): TEvent;
export declare function parseOpenAICompletionsUsage(rawUsage: NonNullable<ChatCompletionChunk["usage"]> & {
  cost?: unknown;
  cache_creation_input_tokens?: number;
  cached_tokens?: number;
  prompt_cache_hit_tokens?: number;
  prompt_tokens_details?: {
    cache_creation_input_tokens?: number;
  };
}, model: Model, options?: {
  includeReasoningTokens?: boolean;
}): MutableAssistantOutput["usage"];
export declare function createOpenAIResponseHook(onResponse: BaseOpenAIStreamOptions["onResponse"], response: Response, model: Model): (() => void | Promise<void>) | undefined;
export declare function createOpenAIProviderAcceptanceHook(options: Pick<BaseOpenAIStreamOptions, "onResponse" | "signal"> | undefined, response: Response, model: Model): () => Promise<void>;
export declare function withOpenAIErrorResponseHook(fetch: typeof globalThis.fetch, onResponse: BaseOpenAIStreamOptions["onResponse"], model: Model): typeof globalThis.fetch;
/** Measure one UTF-8 append without double-counting a surrogate pair split across chunks. */
export declare function measureUtf8AppendBytes(bufferEndsWithHighSurrogate: boolean, chunk: string): {
  bytes: number;
  endsWithHighSurrogate: boolean;
};
export declare function resolvePromptCacheKey(options: Pick<BaseOpenAIStreamOptions, "promptCacheKey" | "sessionId"> | undefined, cacheRetention: "short" | "long" | "none"): string | undefined;
export declare function isOpenAICompletionsThinkingEnabled(effort: string): boolean;
export declare function readOpenAICompletionsContentDeltas(content: unknown, topLevelRefusal?: unknown, mirroredThinking?: readonly string[]): OpenAICompletionsContentDelta[];
//#endregion
//#region packages/ai/src/transports/openai-completions-params.d.ts
declare function convertTools(tools: NonNullable<Context["tools"]>, compat: ResolvedOpenAICompletionsCompat, model: OpenAIModeModel, mode: "direct" | "managed"): {
  projection: OpenAIToolProjection;
  tools: {
    type: "function";
    function: {
      name: string;
      description: string | undefined;
      parameters: Record<string, unknown>;
      strict?: boolean;
    };
  }[];
};
export declare function buildOpenAICompletionsParams(model: OpenAIModeModel, context: Context, options: OpenAICompletionsOptions | undefined): CompletionsRequest;
type CompletionsRequest = Record<string, unknown> & {
  model: string;
  messages: unknown[];
  stream: boolean;
  tools?: ReturnType<typeof convertTools>["tools"];
};
//#endregion
//#region packages/ai/src/transports/openai-completions-transport.d.ts
export declare function createOpenAICompletionsTransportStreamFn(): StreamFn;
//#endregion
//#region packages/ai/src/transports/openai-reasoning-compat.d.ts
/** Minimal model fields needed to resolve OpenAI reasoning effort compatibility. */
type OpenAIReasoningCompatModel = {
  provider?: string | null;
  id?: string | null;
  compat?: unknown;
};
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
export declare function resolveOpenAIReasoningEffortMap(model: OpenAIReasoningCompatModel, fallbackMap?: Record<string, string>): Record<string, string>;
//#endregion
//#region packages/ai/src/transports/openai-responses-replay.d.ts
/** Resolves the assistant message id that can be replayed to OpenAI Responses. */
export declare function resolveReplayableResponsesMessageId(params: {
  replayResponsesItemIds: boolean;
  textSignatureId?: string;
  fallbackId: string;
  fallbackOrdinal: number;
  previousReplayItemWasReasoning: boolean;
}): string | undefined;
export declare function normalizeOpenAIResponsesReasoningReplayItem(item: ReplayableResponseReasoningItem, api: Api): ReplayableResponseReasoningItem;
//#endregion
//#region packages/ai/src/transports/openai-responses-tool-call-id-shape.d.ts
export declare const OPENAI_RESPONSES_ID_MAX_LENGTH = 64;
export declare const OPENAI_RESPONSES_CALL_ID_RE: RegExp;
export declare const OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE: RegExp;
export declare function splitOpenAIFunctionCallPairing(id: string): {
  callId: string;
  itemId?: string;
};
/** Same shaping `normalizeOpenAIResponsesToolCallIds` applies to a replayed `call_id`/`call_id|fc_id` pair. */
export declare function normalizeOpenAIResponsesFunctionCallId(id: string): string;
export declare function shouldNormalizeOpenAIResponsesToolCallId(id: string): boolean;
//#endregion
//#region packages/ai/src/transports/openai-responses-client.d.ts
export declare function createOpenAIResponsesTransportStreamFn(): StreamFn;
export declare function createAzureOpenAIResponsesTransportStreamFn(): StreamFn;
//#endregion
//#region packages/ai/src/transports/openai-responses-compact-request.d.ts
type OpenAIResponsesCompactEndpointResult = {
  output: OpenAIResponsesCompactionOutput;
  item: {
    type: "compaction";
    id?: string;
    encrypted_content: string;
  };
  historyMode: "compacted-prefix" | "retained-users";
  usage: Record<string, unknown> & {
    input_tokens: number;
    output_tokens: number;
  };
  /** Normal Responses accounting, including cache splits and service-tier pricing. */
  modelUsage?: Usage;
  model: Model;
  replayMetadata: OpenAIResponsesReasoningReplayMetadata;
};
type OpenAIResponsesV2ReplayBudget = {
  maxTokens: number;
  estimateTokens(output: OpenAIResponsesCompactionOutput, outputTokens: number): number;
};
/** Run provider compaction through the session's prepared stream stack. */
export declare function requestPreparedOpenAIResponsesCompaction(streamFn: StreamFn, model: Model, context: Context, options: OpenAIResponsesOptions, mode?: "endpoint" | "v2", replayBudget?: OpenAIResponsesV2ReplayBudget): Promise<OpenAIResponsesCompactEndpointResult>;
//#endregion
//#region packages/ai/src/transports/openai-transport-params.d.ts
export declare function readCodeModePayloadToolName(tool: unknown): string | undefined;
export declare function filterCodeModePayloadTools(payload: unknown, visibleToolNames: ReadonlySet<string>, allowedHostedToolTypes?: ReadonlySet<string>, observer?: (observation: CodeModeToolSurfaceObservation) => void): void;
export declare function resolveCodeModeResponsesVisibleToolNames(context: Pick<Context, "tools">): ReadonlySet<string>;
export declare function enforceCodeModeResponsesToolSurface(payload: unknown, visibleToolNames: ReadonlySet<string>, allowedHostedToolTypes?: ReadonlySet<string>, observer?: (observation: CodeModeToolSurfaceObservation) => void): void;
export declare function assertCodeModeResponsesToolSurface(payload: unknown, visibleToolNames: ReadonlySet<string>, allowedHostedToolTypes?: ReadonlySet<string>): void;
export declare function resolveOpenAIStrictToolFlagWithDiagnostics(projection: OpenAIToolProjection, strictSetting: boolean | null | undefined, context: {
  transport: "responses" | "completions";
  model: OpenAIModeModel;
}): boolean | undefined;
export declare function buildOpenAIClientHeaders(model: Model, context: Context, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>, sessionId?: string, cacheRetention?: CacheRetention): Record<string, string>;
export declare function buildOpenAISdkClientOptions(model: Model): {
  timeout?: number;
  maxRetries: 0;
};
export declare function buildOpenAISdkRequestOptions(model: Model, signal?: AbortSignal, options?: {
  stream?: boolean;
  timeoutMs?: number;
}): {
  signal?: AbortSignal;
  timeout?: number;
  maxRetries: 0;
  headers?: Record<string, string>;
} | undefined;
export declare function getCompat(model: OpenAIModeModel): {
  supportsStore: boolean;
  supportsDeveloperRole: boolean;
  supportsReasoningEffort: boolean;
  supportedReasoningEfforts?: string[];
  supportsUsageInStreaming: boolean;
  maxTokensField: "max_completion_tokens" | "max_tokens";
  requiresToolResultName: boolean;
  requiresAssistantAfterToolResult: boolean;
  requiresThinkingAsText: boolean;
  requiresReasoningContentOnAssistantMessages: boolean;
  thinkingFormat: ModelDataThinkingFormat;
  vercelGatewayRouting: VercelGatewayRouting;
  zaiToolStream: boolean;
  supportsStrictMode: boolean;
  supportsJsonSchemaResponseFormat: boolean;
  supportsPromptCacheKey: boolean;
  supportsLongCacheRetention: boolean;
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  sessionAffinity: "none" | "openai" | "openrouter";
  visibleReasoningDetailTypes: string[];
  emitsDsmlToolCalls: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  requiresTypedUnionBranches: boolean;
  configuredSupportsLongCacheRetention?: boolean;
  reasoningEffortForOff: "none" | null;
  thinkingOffControlUndeclared: boolean;
  reasoningEffortMap: Record<string, string>;
  openRouterRouting: Record<string, unknown>;
  requiresStringContent: boolean;
  strictMessageKeys: boolean;
};
//#endregion
//#region packages/ai/src/transports/provider-compaction-checkpoint.d.ts
/** Whether provider replay state is a prefix-bound server compaction checkpoint. */
export declare function isCompactionReplayCheckpoint(replay: unknown): replay is ProviderReplayState;
/** Strip prefix-bound checkpoint state from an in-place message rewrite. */
export declare function stripCompactionReplayCheckpointInPlace(message: {
  providerReplay?: unknown;
}): void;
/** Strip prefix-bound checkpoints after local history rewrites. */
export declare function stripCompactionReplayCheckpoint(message: AssistantMessage): AssistantMessage;
//#endregion
//#region packages/ai/src/transports/provider-compaction-replay.d.ts
type ReplayIdentity = {
  sessionId?: string;
  authProfileId?: string;
  enabled?: boolean;
};
type ReplayMessage = {
  role: string;
};
type ReplayPressureEstimator = {
  text(value: string): number;
  image(): number;
  json(value: unknown): number;
  toolResult?(value: string): number;
};
/** Resolve from prepared transport facts; never retain or return credential material. */
export declare function resolveCompactionReplayEligibility(model: Model, options: {
  extraParams?: Record<string, unknown>;
  apiKey?: string;
}): boolean;
/** Manual recovery uses the durable client compactor, never a guessed retained-user prefix. */
export declare function requiresCompactionReplayRefresh(messages: readonly ReplayMessage[], model: Model, identity: ReplayIdentity): boolean;
/** Carry a checkpoint immediately after reference-preserving history limiting, before repair. */
export declare function preserveCompactionReplayWindow<T extends ReplayMessage>(source: readonly T[], windowed: T[], model: Model, identity: ReplayIdentity): T[];
/** Estimate the canonical prefix and its tail once, independent of unbound usage snapshots. */
export declare function resolveCompactionReplayPressure<T extends ReplayMessage>(messages: T[], model: Model, identity: ReplayIdentity, estimate: ReplayPressureEstimator, systemPrompt?: string): {
  messages: T[];
  prefixTokens: number;
  measuredTokens?: number;
} | undefined;
/** Preserve the covered prefix and reindex checkpoints after known content removals. */
export declare function replaceCompactionReplayOwnerContent(message: AssistantMessage, content: AssistantMessage["content"]): AssistantMessage;
//#endregion
//#region packages/ai/src/transports/provider-transport-stream.d.ts
type ProviderTransportStreamContext = {
  cfg?: unknown;
  agentDir?: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
};
declare function createSupportedTransportStreamFn(model: Model, ctx?: ProviderTransportStreamContext): StreamFn | undefined;
/** Maps public model APIs to the internal transport API id used by simple runtime dispatch. */
export declare function resolveTransportAwareSimpleApi(api: Api): Api | undefined;
/** Creates a managed transport stream only when request overrides require it. */
export declare function createTransportAwareStreamFnForModel(model: Model, ctx?: ProviderTransportStreamContext): StreamFn | undefined;
export declare function prepareTransportAwareSimpleModel<TApi extends Api>(model: Model<TApi>, ctx?: ProviderTransportStreamContext): Model;
//#endregion
//#region packages/ai/src/transports/responses-image-payload-sanitizer.d.ts
/** Sanitize inline image fields inside a Responses API payload. */
export declare function sanitizeResponsesImagePayload<T extends Record<string, unknown>>(params: T): T;
//#endregion
//#region packages/ai/src/transports/simple-completion-transport.d.ts
/** Standalone completions have no durable session, but may require routing identity. */
export declare function prepareHeadersForSimpleCompletion(model: Pick<Model, "baseUrl" | "headers">, options?: Pick<StreamOptions, "sessionId" | "headers">): Record<string, string> | undefined;
export declare function normalizeCodexResponsesBaseUrlForOpenAISdk(baseUrl?: string): string;
export declare function prepareModelForSimpleCompletion<TApi extends Api>(params: {
  apiRegistry: ApiRegistry;
  model: Model<TApi>;
  cfg?: unknown;
  auth?: AiProviderStreamHookContext["auth"];
  agentId?: string;
}): Model;
//#endregion
//#region packages/ai/src/transports/transport-utils.d.ts
export declare const MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE = "OpenClaw transport error: malformed_streaming_fragment";
export declare function isCodeModeModelVisibleToolName(name: string, visibleToolNames: ReadonlySet<string>): boolean;
//#endregion
//#region packages/ai/src/providers/google-stream.d.ts
type GoogleStreamChunk = {
  responseId?: string;
  modelVersion?: string;
  promptFeedback?: {
    blockReason?: string;
    blockReasonMessage?: string;
  };
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        thought?: boolean;
        thoughtSignature?: string;
        functionCall?: {
          id?: string;
          name?: string;
          args?: Record<string, unknown>;
        };
      }>;
    };
    finishReason?: string;
    finishMessage?: string;
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    cachedContentTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
    toolUsePromptTokenCount?: number;
    totalTokenCount?: number;
  };
};
/** @internal Directly tested provider implementation detail. */
export declare function consumeGoogleGenerateContentStream(params: {
  chunks: AsyncIterable<GoogleStreamChunk>;
  model: Model;
  output: AssistantMessage;
  stream: WritableTransportStream;
  signal?: AbortSignal;
  nextToolCallId: (name: string | undefined) => string;
  profile?: "sdk" | "managed";
  normalizeModelId?: (id: string) => string;
  resolveStopReason?: (reason: string) => StopReason;
}): Promise<void>;
//#endregion
//#region packages/ai/src/providers/google-messages.d.ts
type GoogleContentPart = Part & Record<string, unknown>;
type GoogleContent = {
  role: string;
  parts: GoogleContentPart[];
};
export declare function requiresGoogleToolCallId(modelId: string): boolean;
/** Project a prepared transcript; route repair and trusted video admission remain caller-owned. */
export declare function projectGoogleMessages(params: {
  model: Pick<ProviderModel, "id" | "api" | "provider" | "input">;
  messages: ProviderContext["messages"];
  replay: "signed-parts" | "managed";
  requiresToolCallSignature: boolean;
  videoPart?: (video: VideoContent) => GoogleContentPart;
}): GoogleContent[];
/**
 * Convert tools to Gemini function declarations format.
 * @internal Directly tested provider implementation detail.
 */
export declare function convertGoogleTools(tools: Tool[]): {
  functionDeclarations: Record<string, unknown>[];
}[] | undefined;
//#endregion
//#region packages/ai/src/providers/google-video-slots.d.ts
export declare const GOOGLE_VIDEO_SLOT_OMISSION = "(video omitted: native video slot unavailable)";
type GoogleVideoSlots = Map<Record<string, unknown>, VideoContent>;
export declare function createGoogleVideoPlaceholder<T extends {
  text: string;
}>(video: VideoContent, slots: GoogleVideoSlots | undefined, placeholder: T): T;
/** Only original slot identities may recover private bytes after mutable payload hooks. */
export declare function materializeGoogleVideoSlots(payload: unknown, slots: GoogleVideoSlots, materialize: (slot: Record<string, unknown>, video: VideoContent) => void, omitInjected: (part: Record<string, unknown>) => void): void;
//#endregion
export { CompactionReplayRefreshRequiredError, type CompactionReplayRejection, type GoogleStreamChunk, type GoogleVideoSlots, IncompleteToolCallError, type OpenAICompletionsOptions, type OpenAIResponsesCompactionRejection, OpenAIServiceTier, ProviderAcceptance, ResolvedOpenAICompletionsCompat, WritableTransportStream, applyAnthropicContextManagementToRequest, applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, applyAnthropicRequestCacheControl, applyOpenAIResponsesPayloadPolicy, assignTransportErrorDetails, buildAnthropicSystemBlocks, createTransportAwareStreamFnForModel as buildTransportAwareSimpleStreamFn, captureOpenAIResponsesCompaction, coerceTransportToolCallArguments, copyProviderAcceptanceObserver, createSupportedTransportStreamFn as createBoundaryAwareStreamFnForModel, createSupportedTransportStreamFn as createOpenClawTransportStreamFnForModel, createEmptyTransportUsage, createModelStreamCooperativeScheduler, createWritableTransportEventStream, detectOpenAICompletionsCompat, emitModelTransportDebug, emitModelTransportError, failTransportStream, finalizeTerminalToolCallArguments, finalizeTransportStream, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, isAnthropicServerToolClearingEnabled, isDirectAnthropicModel, isNativeOpenAIEndpoint, isOpenAICodexResponsesModel, iterateModelStream, logAnthropicContextEdits, mergeTransportHeaders, normalizeOpenAIServiceTier, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseTerminalToolCallArguments, resolveAnthropicCacheOptions, resolveAnthropicEphemeralCacheControl, resolveAnthropicPayloadPolicy, resolveAnthropicRequestBetaHeader, resolveAnthropicServerCompactionPlan, resolveModelPayloadDebugMode, resolveModelSseDebugMode, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport, resolveOpenAIResponsesCompactEndpointPlan, resolveOpenAIResponsesPayloadPolicy, resolveOpenAIResponsesRequestContextTokens, resolveOpenAIResponsesServerCompactionPlan, sanitizeNonEmptyTransportPayloadText, sanitizeTransportPayloadText, sortPromptCacheToolsByName as sortTransportToolsByName, supportsAnthropicServerSideFallback, throwIfModelStreamAborted, transportAbortError, usesNativeOpenAICodexResponsesBackend, withProviderAcceptanceObserver, withProviderResponseHook };
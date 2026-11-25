import { M as ModelRequestHeaders, P as OpenAICompletionsCompat, U as ProviderReplayState, a as AssistantMessage, at as StreamOptions, d as Context, ft as Tool, gt as Usage, k as Model, l as CacheRetention, lt as ThinkingContent, n as Api, nt as StopReason, ot as TextContent, pt as ToolCall, rt as StreamFn, yt as VercelGatewayRouting, zt as ModelDataThinkingFormat } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import { n as ApiRegistry } from "./api-registry-BZQ-Qwa8.mjs";
import { o as AiProviderStreamHookContext } from "./host-CNOUExXM.mjs";
import "./types-CeCl7cJZ.mjs";
import { l as ProviderModel, o as ProviderContext, p as VideoContent } from "./provider-types-CNnxVhQE.mjs";
import { a as BaseOpenAIStreamOptions, c as OpenAICompletionsOptions, h as OpenAIToolProjection, l as OpenAIResponsesCompactionRejection, o as CodeModeToolSurfaceObservation, s as CompactionReplayRejection } from "./provider-options-BOGPCBFr.mjs";
import { a as buildAnthropicSystemBlocks, c as logAnthropicContextEdits, d as resolveAnthropicPayloadPolicy, f as resolveAnthropicRequestBetaHeader, g as resolveCompletionTokenReservation, i as applyAnthropicRequestCacheControl, l as resolveAnthropicCacheOptions, m as supportsAnthropicServerSideFallback, n as applyAnthropicEphemeralCacheControlMarkers, o as isAnthropicServerToolClearingEnabled, p as resolveAnthropicServerCompactionPlan, r as applyAnthropicPayloadPolicyToParams, s as isDirectAnthropicModel, t as applyAnthropicContextManagementToRequest, u as resolveAnthropicEphemeralCacheControl } from "./anthropic-payload-policy-CePIh-nh.mjs";
import { a as isOpenAICodexResponsesModel, c as usesNativeOpenAICodexResponsesBackend, i as isNativeOpenAIEndpoint, n as detectOpenAICompletionsCompat, o as resolveOpenAICompletionsCompat, r as isKnownOpenAIEndpoint, s as resolveOpenAIPromptCacheKeySupport, t as ResolvedOpenAICompletionsCompat } from "./openai-completions-compat-CccWK1Wv.mjs";
import { a as ReplayableResponseReasoningItem, d as OpenAIResponsesCompactionOutput, n as OpenAIResponsesOptions, p as readOpenAIResponsesItemRecoveryAnchor, r as OpenAIResponsesReasoningReplayMetadata, u as CompactionReplayRefreshRequiredError } from "./openai-responses-contracts-DQVUvWOW.mjs";
import { a as resolveOpenAIResponsesCompactEndpointPlan, c as resolveOpenAIResponsesServerCompactionPlan, i as normalizeOpenAIServiceTier, n as applyOpenAIResponsesPayloadPolicy, o as resolveOpenAIResponsesPayloadPolicy, r as enforceOpenAIResponsesCompactionReplayStorage, s as resolveOpenAIResponsesRequestContextTokens, t as OpenAIServiceTier } from "./openai-responses-payload-policy-Bs4hQTaK.mjs";
import { t as captureOpenAIResponsesCompaction } from "./openai-responses-compaction-replay-CZ58YCfe.mjs";
import { C as throwIfModelStreamAborted, E as withProviderResponseHook, S as sanitizeTransportPayloadText, T as withProviderAcceptanceObserver, _ as notifyProviderHttpMetadata, a as awaitProviderLifecycleCallback, b as parseTerminalToolCallArguments, c as createEmptyTransportUsage, d as failTransportStream, f as finalizeTerminalToolCallArguments, g as mergeTransportHeaders, h as iterateSseFrames, i as assignTransportErrorDetails, l as createWritableTransportEventStream, m as iterateModelStream, n as ProviderAcceptance, o as coerceTransportToolCallArguments, p as finalizeTransportStream, r as WritableTransportStream, s as copyProviderAcceptanceObserver, t as IncompleteToolCallError, u as decodeSseFrames, v as notifyProviderHttpResponse, w as transportAbortError, x as sanitizeNonEmptyTransportPayloadText, y as notifyProviderStreamOpened } from "./transport-stream-shared-CJrl4Yd5.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-xNfkD-3g.mjs";
import { a as resolveModelPayloadDebugMode, i as emitModelTransportError, n as formatModelTransportDebugUrl, o as resolveModelSseDebugMode, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl } from "./model-transport-url-Dad-sfx2.mjs";
import { Part } from "@google/genai";
import { ResponseInputImage } from "openai/resources/responses/responses.js";
import { ChatCompletionChunk } from "openai/resources/chat/completions.js";
/** Resolve the Anthropic Messages endpoint URL for the effective base URL. */
export declare function resolveAnthropicMessagesUrl(baseUrl?: string): string;
/** Create the stream function used by Anthropic Messages transport models. */
export declare function createAnthropicMessagesTransportStreamFn(): StreamFn;
/** Create an incremental text filter that strips DeepSeek DSML tool blocks. */
export declare function createDeepSeekTextFilter(): {
  push(chunk: string): string[];
  flush(): string[];
};
/** Reports MINIMAL support for Gemini 3 and 4 thinkingLevel models. */
export declare function googleFlashSupportsMinimalThinking(modelId: string): boolean;
/** Quotes integer literals above Number.MAX_SAFE_INTEGER before JSON.parse. */
export declare function quoteUnsafeIntegerLiterals(input: string): string;
/** Parses JSON while preserving unsafe integer literals as strings. */
export declare function parseJsonPreservingUnsafeIntegers(input: string): unknown;
/** Parses or accepts an object while preserving unsafe integer literals in string input. */
export declare function parseJsonObjectPreservingUnsafeIntegers(value: unknown): Record<string, unknown> | null;
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
/** Returns whether an OpenAI-compatible messages payload contains a usable turn. */
export declare function hasOpenAICompatibleConversationTurn(messages: unknown): boolean;
type CacheControl = NonNullable<ReturnType<typeof resolveAnthropicEphemeralCacheControl>>;
/** Shared Chat Completions policy; repeated wrapper application preserves existing checkpoints. */
export declare function applyCompletionsAnthropicCacheControl(payload: Record<string, unknown>, cacheControl?: CacheControl | null, cacheOptOutIndexes?: ReadonlySet<number>, markTools?: boolean, markMessages?: boolean, systemOnly?: boolean, sharedSystemCheckpoint?: boolean): void;
/** Flatten string-only text block content arrays into newline-joined strings. */
export declare function flattenCompletionMessagesToStringContent(messages: unknown[]): unknown[];
/** Strip completion messages to role/content fields for strict providers. */
export declare function stripCompletionMessagesToRoleContent(messages: unknown[]): unknown[];
export declare const GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP = "skip_thought_signature_validator";
export declare const log: {
  isEnabled(level: "debug" | "info" | "warn"): boolean;
  debugLazy(build: () => string): void;
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
declare function convertTools(tools: NonNullable<ProviderContext["tools"]>, compat: ResolvedOpenAICompletionsCompat, model: OpenAIModeModel, mode: "direct" | "managed", mutableParameters: boolean): {
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
export declare function buildOpenAICompletionsParams(model: OpenAIModeModel, context: ProviderContext, options: OpenAICompletionsOptions | undefined): CompletionsRequest;
type CompletionsRequest = Record<string, unknown> & {
  model: string;
  messages: unknown[];
  stream: boolean;
  tools?: ReturnType<typeof convertTools>["tools"];
};
export declare function createOpenAICompletionsTransportStreamFn(): StreamFn;
/** Minimal model fields needed to resolve OpenAI reasoning effort compatibility. */
type OpenAIReasoningCompatModel = {
  provider?: string | null;
  id?: string | null;
  compat?: unknown;
};
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
export declare function resolveOpenAIReasoningEffortMap(model: OpenAIReasoningCompatModel, fallbackMap?: Record<string, string>): Record<string, string>;
export declare function normalizeOpenAIResponsesReasoningReplayItem(item: ReplayableResponseReasoningItem, api: Api): ReplayableResponseReasoningItem;
/** Replay original bytes only while the normalized arguments still match the saved call. */
export declare function replayOpenAIResponsesToolArguments(block: ToolCall, providerStyle: boolean, sameModel: boolean): string;
/** New transcripts retain exact bytes; legacy callers may still replay normalized values. */
export declare function normalizeOpenAIResponsesToolArguments(value: unknown, replayed: unknown): unknown;
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
export declare function createOpenAIResponsesTransportStreamFn(): StreamFn;
export declare function createAzureOpenAIResponsesTransportStreamFn(): StreamFn;
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
export declare function readCodeModePayloadToolName(tool: unknown): string | undefined;
export declare function filterCodeModePayloadTools(payload: unknown, visibleToolNames: ReadonlySet<string>, allowedHostedToolTypes?: ReadonlySet<string>, observer?: (observation: CodeModeToolSurfaceObservation) => void): void;
export declare function resolveCodeModeResponsesVisibleToolNames(context: Pick<Context, "tools">): ReadonlySet<string>;
export declare function enforceCodeModeResponsesToolSurface(payload: unknown, visibleToolNames: ReadonlySet<string>, allowedHostedToolTypes?: ReadonlySet<string>, observer?: (observation: CodeModeToolSurfaceObservation) => void): void;
export declare function assertCodeModeResponsesToolSurface(payload: unknown, visibleToolNames: ReadonlySet<string>, allowedHostedToolTypes?: ReadonlySet<string>): void;
export declare function resolveOpenAIStrictToolFlagWithDiagnostics(projection: OpenAIToolProjection, strictSetting: boolean | null | undefined, context: {
  transport: "responses" | "completions";
  model: OpenAIModeModel;
}): boolean | undefined;
export declare function buildOpenAIClientHeaders(model: Model, context: Context, optionHeaders?: ModelRequestHeaders, turnHeaders?: ModelRequestHeaders, sessionId?: string, cacheRetention?: CacheRetention): ModelRequestHeaders;
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
  cacheControlSystemOnly: boolean;
  cacheControlSharedSystem: boolean;
  sessionAffinity: "none" | "openai" | "openrouter";
  visibleReasoningDetailTypes: string[];
  emitsDsmlToolCalls: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  requiresTypedUnionBranches: boolean;
  configuredSupportsLongCacheRetention?: boolean;
  thinkingOffControlUndeclared: boolean;
  seedField?: "random_seed" | "seed";
  reasoningEffortMap: Record<string, string>;
  openRouterRouting: Record<string, unknown>;
  requiresStringContent: boolean;
  strictMessageKeys: boolean;
};
type ReplayIdentity = {
  sessionId?: string;
  enabled?: boolean;
};
type ReplayMessage = {
  role: string;
};
type CompactionReplayWindowMode = "barrier" | "anthropic" | "compacted-prefix" | "complete-window" | "refresh-required";
/** A payload-free decision for one normalized row, scoped to its collector's model/session. */
type CompactionReplayWindowFact = {
  mode: CompactionReplayWindowMode;
  rewrite?: {
    retained: true;
  } | {
    retained: false;
    replayIndex: number;
    indexIsNumber: boolean;
    reindexedMode: CompactionReplayWindowMode;
    /** Bytes available for a replacement index in a validated Responses window. */
    replayIndexBytes?: number;
  };
};
/** Use payload-free block identities with the same rewrite decision as the message adapter. */
export declare function replaceCompactionReplayWindowFactContent<T>(fact: CompactionReplayWindowFact | undefined, source: readonly T[], content: readonly T[]): CompactionReplayWindowFact | undefined;
/** Shared history projection; projectedFact describes the empty-content owner to prepend. */
export declare function resolveCompactionReplayWindow<T>(source: readonly T[], windowed: readonly T[], readFact: (message: T) => CompactionReplayWindowFact | undefined): {
  ownerIndex: number;
  projectedFact: CompactionReplayWindowFact;
  suffix: T[];
} | undefined;
/** Content identities, not payloads, determine whether a covered prefix survives a rewrite. */
export declare function resolveCompactionReplayContentRewrite<T>(source: readonly T[], content: readonly T[], replayIndex: number, indexIsNumber?: boolean): {
  type: "keep";
} | {
  type: "strip";
} | {
  type: "reindex";
  replayIndex: number;
};
/** Whether provider replay state is a prefix-bound server compaction checkpoint. */
export declare function isCompactionReplayCheckpoint(replay: unknown): replay is ProviderReplayState;
/** Strip prefix-bound checkpoint state from an in-place message rewrite. */
export declare function stripCompactionReplayCheckpointInPlace(message: {
  providerReplay?: unknown;
}): void;
/** Strip prefix-bound checkpoints after local history rewrites. */
export declare function stripCompactionReplayCheckpoint(message: AssistantMessage): AssistantMessage;
/** Preserve the covered prefix and reindex checkpoints after known content removals. */
export declare function replaceCompactionReplayOwnerContent(message: AssistantMessage, content: AssistantMessage["content"]): AssistantMessage;
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
/** Validate replay facts with the active transport's immutable publication contract. */
export declare function createCompactionReplayWindowFactCollector(model: Model, identity: ReplayIdentity): (message: ReplayMessage) => CompactionReplayWindowFact | undefined;
/** Carry a checkpoint after reference-preserving history limiting, before transport repair. */
export declare function preserveCompactionReplayWindow<T extends ReplayMessage>(source: readonly T[], windowed: T[], model: Model, identity: ReplayIdentity): T[];
/** Estimate the canonical prefix and its tail once, independent of unbound usage snapshots. */
export declare function resolveCompactionReplayPressure<T extends ReplayMessage>(messages: T[], model: Model, identity: ReplayIdentity, estimate: ReplayPressureEstimator, systemPrompt?: string, requestContext?: Context): {
  messages: T[];
  prefixTokens: number;
  measuredTokens?: number;
} | undefined;
/** Applies `onPayload` like the shared adapters: cancellation stops the wait, not the hook. */
export declare function applyProviderPayloadHook(options: Pick<StreamOptions, "onPayload" | "signal"> | undefined, payload: unknown, model: Model): Promise<unknown>;
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
/** A provider-owned wait lasts only until its first response event or settlement. */
export declare function createProviderWaitObserver(options: Pick<StreamOptions, "onProviderWait" | "signal"> | undefined): {
  start(): void;
  report: (reason: "response" | "slot") => void;
  stop: () => void;
};
type ImageSource = {
  mimeType: string;
  data: string;
};
/** Sanitation has already established immutability for this unchanged publication. */
export declare function isSanitizedFrozenResponsesInput(value: object): boolean;
/** Reuse scalar image work, never the mutable item exposed to payload hooks. */
export declare function buildResponsesInputImage(source: ImageSource): ResponseInputImage;
/** Sanitize inline image fields inside a Responses API payload. */
export declare function sanitizeResponsesImagePayload<T extends Record<string, unknown>>(params: T): T;
/** Standalone completions have no durable session, but may require routing identity. */
export declare function prepareHeadersForSimpleCompletion(model: Pick<Model, "baseUrl" | "headers">, options?: Pick<StreamOptions, "sessionId" | "headers">): ModelRequestHeaders | undefined;
export declare function normalizeCodexResponsesBaseUrlForOpenAISdk(baseUrl?: string): string;
export declare function prepareModelForSimpleCompletion<TApi extends Api>(params: {
  apiRegistry: ApiRegistry;
  model: Model<TApi>;
  cfg?: unknown;
  auth?: AiProviderStreamHookContext["auth"];
  agentId?: string;
}): Model;
export declare const MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE = "OpenClaw transport error: malformed_streaming_fragment";
export declare function isCodeModeModelVisibleToolName(name: string, visibleToolNames: ReadonlySet<string>): boolean;
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
  tools?: Tool[];
  stream: WritableTransportStream;
  signal?: AbortSignal;
  nextToolCallId: (name: string | undefined) => string;
  profile?: "sdk" | "managed";
  normalizeModelId?: (id: string) => string;
  resolveStopReason?: (reason: string) => StopReason;
}): Promise<void>;
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
  tools?: Tool[];
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
export declare const GOOGLE_VIDEO_SLOT_OMISSION = "(video omitted: native video slot unavailable)";
type GoogleVideoSlots = Map<Record<string, unknown>, VideoContent>;
export declare function createGoogleVideoPlaceholder<T extends {
  text: string;
}>(video: VideoContent, slots: GoogleVideoSlots | undefined, placeholder: T): T;
/** Only original slot identities may recover private bytes after mutable payload hooks. */
export declare function materializeGoogleVideoSlots(payload: unknown, slots: GoogleVideoSlots, materialize: (slot: Record<string, unknown>, video: VideoContent) => void, omitInjected: (part: Record<string, unknown>) => void): void;
export { CompactionReplayRefreshRequiredError, type CompactionReplayRejection, type CompactionReplayWindowFact, type GoogleStreamChunk, type GoogleVideoSlots, IncompleteToolCallError, type OpenAICompletionsOptions, type OpenAIResponsesCompactionRejection, OpenAIServiceTier, ProviderAcceptance, ResolvedOpenAICompletionsCompat, WritableTransportStream, applyAnthropicContextManagementToRequest, applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, applyAnthropicRequestCacheControl, applyOpenAIResponsesPayloadPolicy, assignTransportErrorDetails, awaitProviderLifecycleCallback, buildAnthropicSystemBlocks, createTransportAwareStreamFnForModel as buildTransportAwareSimpleStreamFn, captureOpenAIResponsesCompaction, coerceTransportToolCallArguments, copyProviderAcceptanceObserver, createSupportedTransportStreamFn as createBoundaryAwareStreamFnForModel, createSupportedTransportStreamFn as createOpenClawTransportStreamFnForModel, createEmptyTransportUsage, createWritableTransportEventStream, decodeSseFrames, detectOpenAICompletionsCompat, emitModelTransportDebug, emitModelTransportError, enforceOpenAIResponsesCompactionReplayStorage, failTransportStream, finalizeTerminalToolCallArguments, finalizeTransportStream, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, isAnthropicServerToolClearingEnabled, isDirectAnthropicModel, isKnownOpenAIEndpoint, isNativeOpenAIEndpoint, isOpenAICodexResponsesModel, iterateModelStream, iterateSseFrames, logAnthropicContextEdits, mergeTransportHeaders, normalizeOpenAIServiceTier, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseTerminalToolCallArguments, readOpenAIResponsesItemRecoveryAnchor, resolveAnthropicCacheOptions, resolveAnthropicEphemeralCacheControl, resolveAnthropicPayloadPolicy, resolveAnthropicRequestBetaHeader, resolveAnthropicServerCompactionPlan, resolveCompletionTokenReservation, resolveModelPayloadDebugMode, resolveModelSseDebugMode, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport, resolveOpenAIResponsesCompactEndpointPlan, resolveOpenAIResponsesPayloadPolicy, resolveOpenAIResponsesRequestContextTokens, resolveOpenAIResponsesServerCompactionPlan, sanitizeNonEmptyTransportPayloadText, sanitizeTransportPayloadText, sortPromptCacheToolsByName as sortTransportToolsByName, supportsAnthropicServerSideFallback, throwIfModelStreamAborted, transportAbortError, usesNativeOpenAICodexResponsesBackend, withProviderAcceptanceObserver, withProviderResponseHook };
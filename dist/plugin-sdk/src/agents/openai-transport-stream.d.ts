import OpenAI from "openai";
import type { ChatCompletionChunk } from "openai/resources/chat/completions.js";
import type { FunctionTool, ResponseCreateParamsStreaming, ResponseInput, ResponseReasoningItem } from "openai/resources/responses/responses.js";
import type { ModelCompatConfig } from "../config/types.models.js";
import type { Api, Context, Model } from "../llm/types.js";
import { formatModelTransportDebugBaseUrl } from "./model-transport-url.js";
import { type OpenAIApiReasoningEffort, type OpenAIReasoningEffort } from "./openai-reasoning-effort.js";
import { type OpenAICompletionsToolChoice } from "./openai-tool-projection.js";
import type { StreamFn } from "./runtime/index.js";
declare const OPENAI_RESPONSES_REASONING_REPLAY_META_KEY = "__openclaw_replay";
type OpenAIResponsesReasoningReplayMetadata = {
    v: 1;
    source: "openai-responses";
    provider: string;
    api: Api;
    model: string;
    baseUrlHash?: string;
    sessionHash?: string;
    authProfileHash?: string;
};
type ReplayableResponseReasoningItem = Omit<ResponseReasoningItem, "id"> & {
    id?: string;
    [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]?: OpenAIResponsesReasoningReplayMetadata;
};
type ResponsesClientLike = ReturnType<typeof createOpenAIResponsesClient>;
type BaseStreamOptions = {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stop?: string[];
    signal?: AbortSignal;
    apiKey?: string;
    cacheRetention?: "none" | "short" | "long";
    sessionId?: string;
    promptCacheKey?: string;
    authProfileId?: string;
    onPayload?: (payload: unknown, model: Model) => unknown;
    headers?: Record<string, string>;
    openclawCodeModeToolSurface?: boolean;
    responseFormat?: Record<string, unknown>;
    frequencyPenalty?: number;
    presencePenalty?: number;
    seed?: number;
};
type OpenAIResponsesOptions = BaseStreamOptions & {
    reasoning?: OpenAIReasoningEffort;
    reasoningEffort?: OpenAIReasoningEffort;
    reasoningSummary?: "auto" | "detailed" | "concise" | null;
    replayResponsesItemIds?: boolean;
    serviceTier?: ResponseCreateParamsStreaming["service_tier"];
    toolChoice?: ResponseCreateParamsStreaming["tool_choice"];
};
type OpenAIResponsesReplayContext = {
    provider: string;
    api: Api;
    model: string;
    baseUrlHash?: string;
    sessionHash?: string;
    authProfileHash?: string;
};
type OpenAICompletionsOptions = BaseStreamOptions & {
    toolChoice?: OpenAICompletionsToolChoice;
    reasoning?: OpenAIReasoningEffort;
    reasoningEffort?: OpenAIReasoningEffort;
};
type OpenAIModeCompatInput = Omit<ModelCompatConfig, "thinkingFormat"> & {
    thinkingFormat?: string;
};
type OpenAIModeModel = Omit<Model, "compat"> & {
    compat?: OpenAIModeCompatInput | null;
};
type MutableAssistantOutput = {
    role: "assistant";
    content: Array<Record<string, unknown>>;
    api: Api;
    provider: string;
    model: string;
    usage: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        reasoningTokens?: number;
        totalTokens: number;
        cost: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            total: number;
        };
    };
    stopReason: string;
    timestamp: number;
    responseId?: string;
    errorMessage?: string;
    errorCode?: string;
    errorType?: string;
    errorBody?: string;
};
export { sanitizeTransportPayloadText } from "./transport-stream-shared.js";
declare function summarizeResponsesTools(tools: unknown): string;
declare function enforceCodeModeResponsesToolSurface(payload: unknown): void;
declare function assertCodeModeResponsesToolSurface(payload: unknown): void;
type ResponsesFailedNoDetailsObservation = {
    event: "openai_responses_response_failed_without_details";
    provider: string;
    api: Api;
    transportModel: string;
    providerRuntimeFailureKind: "no_error_details";
    responseId: string;
    responseStatus: string;
    responseModel: string;
    responseObject: string;
    metadataKeys: string[];
    requestIdHashes: string[];
    failureFieldsPreview: string;
    responsePreview: string;
};
type ResponsesFailedEventSummary = {
    message: string;
    responseId?: string;
    observation?: ResponsesFailedNoDetailsObservation;
};
declare function buildResponsesFailedNoDetailsObservation(event: Record<string, unknown>, model: Model, response?: Record<string, unknown> | undefined): ResponsesFailedNoDetailsObservation;
declare function summarizeResponsesFailedNoDetailsObservation(observation: ResponsesFailedNoDetailsObservation): string;
declare function normalizeResponsesFailedEvent(event: Record<string, unknown>, model: Model): ResponsesFailedEventSummary;
declare function summarizeResponsesPayload(params: unknown): string;
declare function stripResponsesRequestEncryptedContent(params: OpenAIResponsesRequestParams): OpenAIResponsesRequestParams;
declare function buildOpenAIResponsesReasoningReplayMetadata(model: Model, options?: Pick<BaseStreamOptions, "authProfileId" | "sessionId">): OpenAIResponsesReasoningReplayMetadata;
declare function tagOpenAIResponsesReasoningReplayItem(item: Record<string, unknown>, model: Model, options?: Pick<BaseStreamOptions, "authProfileId" | "sessionId">): Record<string, unknown>;
declare function prepareOpenAIResponsesReasoningItemForReplay(item: ReplayableResponseReasoningItem, context: OpenAIResponsesReplayContext, blockMetadata?: OpenAIResponsesReasoningReplayMetadata): ReplayableResponseReasoningItem;
declare function createResponsesStreamWithEncryptedContentRetry(params: {
    client: ResponsesClientLike;
    request: OpenAIResponsesRequestParams;
    requestOptions: unknown;
    model: Model;
}): Promise<AsyncIterable<unknown>>;
export declare function resolveAzureOpenAIApiVersion(env?: NodeJS.ProcessEnv): string;
declare function withResponsesFirstEventTimeout(openaiStream: AsyncIterable<unknown>, model: Model, timeoutMs: number | undefined): AsyncIterable<unknown>;
declare function processResponsesStream(openaiStream: AsyncIterable<unknown>, output: MutableAssistantOutput, stream: {
    push(event: unknown): void;
}, model: Model, options?: {
    serviceTier?: ResponseCreateParamsStreaming["service_tier"];
    applyServiceTierPricing?: (usage: MutableAssistantOutput["usage"], serviceTier?: ResponseCreateParamsStreaming["service_tier"]) => void;
    firstEventTimeoutMs?: number;
    signal?: AbortSignal;
    sessionId?: string;
    authProfileId?: string;
}): Promise<void>;
declare function buildOpenAIClientHeaders(model: Model, context: Context, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>): Record<string, string>;
declare function buildOpenAISdkClientOptions(model: Model): {
    timeout?: number;
};
declare function buildOpenAISdkRequestOptions(model: Model, signal?: AbortSignal, options?: {
    stream?: boolean;
}): {
    signal?: AbortSignal;
    timeout?: number;
    headers?: Record<string, string>;
} | undefined;
declare function createOpenAIResponsesClient(model: Model, context: Context, apiKey: string, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>): OpenAI;
export declare function createOpenAIResponsesTransportStreamFn(): StreamFn;
declare function sanitizeOpenAICodexResponsesParams<T extends Record<string, unknown>>(model: Model, params: T): T;
export declare function buildOpenAIResponsesParams(model: Model, context: Context, options: OpenAIResponsesOptions | undefined, metadata?: Record<string, string>): OpenAIResponsesRequestParams;
export declare function createAzureOpenAIResponsesTransportStreamFn(): StreamFn;
declare function createAzureOpenAIClient(model: Model, context: Context, apiKey: string, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>): OpenAI;
declare function createOpenAICompletionsClient(model: Model, context: Context, apiKey: string, optionHeaders?: Record<string, string>): OpenAI;
declare function buildOpenAICompletionsClientConfig(model: Model, context: Context, optionHeaders?: Record<string, string>): {
    baseURL: string;
    defaultHeaders: Record<string, string>;
    defaultQuery?: Record<string, string>;
};
export declare function createOpenAICompletionsTransportStreamFn(): StreamFn;
declare function processOpenAICompletionsStream(responseStream: AsyncIterable<ChatCompletionChunk>, output: MutableAssistantOutput, model: Model, stream: {
    push(event: unknown): void;
}, options?: {
    signal?: AbortSignal;
    emitReasoning?: boolean;
}): Promise<void>;
declare function getCompat(model: OpenAIModeModel): {
    supportsStore: boolean;
    supportsDeveloperRole: boolean;
    supportsReasoningEffort: boolean;
    reasoningEffortMap: Record<string, string>;
    supportsUsageInStreaming: boolean;
    maxTokensField: string;
    requiresToolResultName: boolean;
    requiresAssistantAfterToolResult: boolean;
    requiresThinkingAsText: boolean;
    thinkingFormat: string;
    openRouterRouting: Record<string, unknown>;
    vercelGatewayRouting: Record<string, unknown>;
    supportsStrictMode: boolean;
    supportsPromptCacheKey: boolean;
    supportsLongCacheRetention: boolean;
    requiresStringContent: boolean;
    strictMessageKeys: boolean;
    visibleReasoningDetailTypes: string[];
    requiresReasoningContentOnAssistantMessages: boolean;
    requiresNonEmptyUserOrAssistantMessage: boolean;
};
type OpenAIResponsesRequestParams = {
    model: string;
    input: ResponseInput;
    stream: true;
    instructions?: string;
    prompt_cache_key?: string;
    prompt_cache_retention?: "24h";
    metadata?: Record<string, string>;
    store?: boolean;
    max_output_tokens?: number;
    temperature?: number;
    top_p?: number;
    text?: ResponseCreateParamsStreaming["text"];
    service_tier?: ResponseCreateParamsStreaming["service_tier"];
    tools?: FunctionTool[];
    tool_choice?: ResponseCreateParamsStreaming["tool_choice"];
    reasoning?: {
        effort: OpenAIApiReasoningEffort;
    } | {
        effort: OpenAIApiReasoningEffort;
        summary: NonNullable<OpenAIResponsesOptions["reasoningSummary"]>;
    };
    include?: string[];
};
declare function shouldEmitOpenAICompletionsReasoningForModel(model: OpenAIModeModel, options: OpenAICompletionsOptions | undefined): boolean;
export declare function buildOpenAICompletionsParams(model: OpenAIModeModel, context: Context, options: OpenAICompletionsOptions | undefined): Record<string, unknown>;
export declare function parseTransportChunkUsage(rawUsage: NonNullable<ChatCompletionChunk["usage"]>, model: Model): {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    reasoningTokens?: number | undefined;
    totalTokens: number;
    cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        total: number;
    };
};
export declare const testing: {
    getCompat: typeof getCompat;
    assertCodeModeResponsesToolSurface: typeof assertCodeModeResponsesToolSurface;
    buildOpenAIClientHeaders: typeof buildOpenAIClientHeaders;
    buildOpenAISdkClientOptions: typeof buildOpenAISdkClientOptions;
    buildOpenAISdkRequestOptions: typeof buildOpenAISdkRequestOptions;
    createAzureOpenAIClient: typeof createAzureOpenAIClient;
    createOpenAICompletionsClient: typeof createOpenAICompletionsClient;
    createOpenAIResponsesClient: typeof createOpenAIResponsesClient;
    enforceCodeModeResponsesToolSurface: typeof enforceCodeModeResponsesToolSurface;
    sanitizeOpenAICodexResponsesParams: typeof sanitizeOpenAICodexResponsesParams;
    buildOpenAICompletionsClientConfig: typeof buildOpenAICompletionsClientConfig;
    processOpenAICompletionsStream: typeof processOpenAICompletionsStream;
    processResponsesStream: typeof processResponsesStream;
    shouldEmitOpenAICompletionsReasoningForModel: typeof shouldEmitOpenAICompletionsReasoningForModel;
    formatModelTransportDebugBaseUrl: typeof formatModelTransportDebugBaseUrl;
    buildResponsesFailedNoDetailsObservation: typeof buildResponsesFailedNoDetailsObservation;
    buildOpenAIResponsesReasoningReplayMetadata: typeof buildOpenAIResponsesReasoningReplayMetadata;
    normalizeResponsesFailedEvent: typeof normalizeResponsesFailedEvent;
    prepareOpenAIResponsesReasoningItemForReplay: typeof prepareOpenAIResponsesReasoningItemForReplay;
    createResponsesStreamWithEncryptedContentRetry: typeof createResponsesStreamWithEncryptedContentRetry;
    stripResponsesRequestEncryptedContent: typeof stripResponsesRequestEncryptedContent;
    tagOpenAIResponsesReasoningReplayItem: typeof tagOpenAIResponsesReasoningReplayItem;
    summarizeResponsesFailedNoDetailsObservation: typeof summarizeResponsesFailedNoDetailsObservation;
    summarizeResponsesPayload: typeof summarizeResponsesPayload;
    summarizeResponsesTools: typeof summarizeResponsesTools;
    withResponsesFirstEventTimeout: typeof withResponsesFirstEventTimeout;
};
export { testing as __testing };

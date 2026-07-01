import type { ResponseCreateParamsStreaming, ResponseInput, ResponseOutputMessage, ResponseStreamEvent } from "openai/resources/responses/responses.js";
import { type AzureResponsesTextContentPart, type AzureResponsesTextDeltaEvent } from "../../shared/openai-responses-stream-compat.js";
import type { Api, AssistantMessage, Context, Model, SimpleStreamOptions, StreamOptions, Usage } from "../types.js";
import type { AssistantMessageEventStream } from "../utils/event-stream.js";
import { convertResponsesToolPayload, convertResponsesTools } from "./openai-responses-tools.js";
type ResponsesTextContentPart = ResponseOutputMessage["content"][number] | AzureResponsesTextContentPart;
type ResponsesStreamOutputMessage = Omit<ResponseOutputMessage, "content"> & {
    content: ResponsesTextContentPart[];
};
type ResponsesContentPartAddedEvent = Extract<ResponseStreamEvent, {
    type: "response.content_part.added";
}>;
type ResponsesOutputItemDoneEvent = Extract<ResponseStreamEvent, {
    type: "response.output_item.done";
}>;
type AzureResponsesContentPartAddedEvent = Omit<ResponsesContentPartAddedEvent, "part"> & {
    part: AzureResponsesTextContentPart;
};
type AzureResponsesOutputItemDoneEvent = Omit<ResponsesOutputItemDoneEvent, "item"> & {
    item: ResponsesStreamOutputMessage;
};
export type OpenAIResponsesStreamEvent = ResponseStreamEvent | AzureResponsesContentPartAddedEvent | AzureResponsesOutputItemDoneEvent | AzureResponsesTextDeltaEvent;
export interface OpenAIResponsesStreamOptions {
    serviceTier?: ResponseCreateParamsStreaming["service_tier"];
    resolveServiceTier?: (responseServiceTier: ResponseCreateParamsStreaming["service_tier"] | undefined, requestServiceTier: ResponseCreateParamsStreaming["service_tier"] | undefined) => ResponseCreateParamsStreaming["service_tier"] | undefined;
    applyServiceTierPricing?: (usage: Usage, serviceTier: ResponseCreateParamsStreaming["service_tier"] | undefined) => void;
}
export interface ConvertResponsesMessagesOptions {
    includeSystemPrompt?: boolean;
    replayResponsesItemIds?: boolean;
}
export { convertResponsesToolPayload, convertResponsesTools };
export type { ConvertResponsesToolsOptions } from "./openai-responses-tools.js";
type ResponsesRequestOptions = {
    signal?: AbortSignal;
    timeout?: number;
    maxRetries?: number;
};
type ResponsesStreamRequest = {
    withResponse(): Promise<{
        data: AsyncIterable<ResponseStreamEvent>;
        response: Response;
    }>;
};
type ResponsesStreamClient = {
    responses: {
        create(params: ResponseCreateParamsStreaming, options: ResponsesRequestOptions): ResponsesStreamRequest;
    };
};
type ResponsesLifecycleStreamOptions = Pick<StreamOptions, "signal" | "timeoutMs" | "maxRetries" | "onPayload" | "onResponse">;
export type ResponsesReasoningEffort = "minimal" | "low" | "medium" | "high" | "xhigh";
export type ResponsesReasoningSummary = "auto" | "detailed" | "concise" | null;
type ResponsesCommonParamsOptions = Pick<StreamOptions, "maxTokens" | "temperature"> & {
    reasoningEffort?: ResponsesReasoningEffort;
    reasoningSummary?: ResponsesReasoningSummary;
};
export declare function convertResponsesMessages<TApi extends Api>(model: Model<TApi>, context: Context, allowedToolCallProviders: ReadonlySet<string>, options?: ConvertResponsesMessagesOptions): ResponseInput;
export declare function createResponsesAssistantOutput<TApi extends Api>(model: Model<TApi>, api?: Api): AssistantMessage;
export declare function resolveResponsesReasoningEffort<TApi extends Api>(model: Model<TApi>, reasoning: SimpleStreamOptions["reasoning"] | undefined): ResponsesReasoningEffort | undefined;
export declare function applyCommonResponsesParams<TApi extends Api>(params: ResponseCreateParamsStreaming, model: Model<TApi>, context: Context, options?: ResponsesCommonParamsOptions, config?: {
    setDefaultReasoningOff?: boolean;
}): void;
export declare function runResponsesStreamLifecycle<TApi extends Api>(params: {
    stream: AssistantMessageEventStream;
    model: Model<TApi>;
    output: AssistantMessage;
    options?: ResponsesLifecycleStreamOptions;
    createClient: () => ResponsesStreamClient;
    buildParams: () => ResponseCreateParamsStreaming;
    processStreamOptions?: OpenAIResponsesStreamOptions;
    formatError: (error: unknown) => string;
}): Promise<void>;
export declare function processResponsesStream<TApi extends Api>(openaiStream: AsyncIterable<OpenAIResponsesStreamEvent>, output: AssistantMessage, stream: AssistantMessageEventStream, model: Model<TApi>, options?: OpenAIResponsesStreamOptions): Promise<void>;

import { d as Context, it as StreamFunction, nt as StopReason, tt as SimpleStreamOptions } from "../types-B1ZIh9Ch.mjs";
import "../index-94l3uJ39.mjs";
import "../types-CeCl7cJZ.mjs";
import { l as ProviderModel, o as ProviderContext } from "../provider-types-CNnxVhQE.mjs";
import { A as resolveOpenAISupportedReasoningEfforts, C as isOpenAIGpt55Model, D as resolveOpenAIModelReasoningEfforts, E as normalizeOpenAIReasoningEffort, M as supportsOpenAITemperature, O as resolveOpenAIReasoningEffortForModel, S as isOpenAIGpt54MiniModel, T as isOpenAIGpt6Model, _ as reconcileOpenAICompletionsToolChoice, a as BaseOpenAIStreamOptions, b as OpenAIReasoningEffort, c as OpenAICompletionsOptions, d as measuredRequestPressure, g as projectOpenAITools, h as OpenAIToolProjection, j as supportsOpenAIReasoningEffort, k as resolveOpenAIReasoningEffortMapping, m as OpenAICompletionsToolChoice, o as CodeModeToolSurfaceObservation, p as reasoningTagTextPolicy, u as codeModeToolSurfaceObserver, v as reconcileOpenAIResponsesToolChoice, w as isOpenAIGpt56Model, x as applyOpenAICompletionsToolReasoning, y as OpenAIApiReasoningEffort } from "../provider-options-BOGPCBFr.mjs";
import { t as ResolvedOpenAICompletionsCompat } from "../openai-completions-compat-CccWK1Wv.mjs";
import { c as responsesPromptObserver, l as responsesServiceTierObserver, m as OpenAIRequestReasoningEffort, o as ResponsesPromptObservation, s as ResponsesServiceTierObservation } from "../openai-responses-contracts-DQVUvWOW.mjs";
import { n as clampOpenAIPromptCacheKey, r as resolveOpenAIPromptCacheParams, t as OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "../openai-prompt-cache-9Jqcprra.mjs";
import { a as readResponsesReasoningTokens, i as mapResponsesTerminalUsage, n as applyResponsesCacheWritePricing, o as resolveResponsesTerminalStopReason, r as isResponsesOutputLimitToolCallError, t as ResponsesTerminalUsagePayload } from "../openai-responses-terminal-usage-C4OrCx69.mjs";
import "../openai-responses-compaction-replay-CZ58YCfe.mjs";
import { encodedModelRequestBodyStream, modelRequestBodyState } from "./model-request-body.mjs";
import { ResponseCreateParamsStreaming, ResponseInputItem } from "openai/resources/responses/responses.js";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
/** Parses AZURE_OPENAI_DEPLOYMENT_MAP-style model=deployment entries. */
export declare function parseAzureDeploymentNameMap(value: string | undefined): Map<string, string>;
/**
 * Resolves the Azure deployment name for a model id, falling back to the model id.
 *
 * An exact-case match always wins, so configs that intentionally distinguish keys by
 * case keep their exact mappings; a case-insensitive match is only used as a fallback
 * (e.g. `GPT-4o` against a `gpt-4o=...` map) to avoid 404s from casing differences.
 */
export declare function resolveAzureDeploymentNameFromMap(params: {
  modelId: string;
  deploymentMap?: string;
}): string;
export declare function isTraditionalAzureOpenAIHost(hostname: string): boolean;
export declare function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl: string): boolean;
/** Convert a normalized transcript to OpenAI Chat Completions messages. */
export declare function convertMessages(model: ProviderModel, context: ProviderContext, compat: ResolvedOpenAICompletionsCompat, options?: {
  cacheOptOutIndexes?: Set<number>;
  preserveSystemPromptCacheBoundary?: boolean;
  supportsTools?: boolean;
  declaredToolNames?: ReadonlySet<string>;
}): ChatCompletionMessageParam[];
export declare const streamOpenAICompletions: StreamFunction<"openai-completions", OpenAICompletionsOptions>;
export declare const streamSimpleOpenAICompletions: StreamFunction<"openai-completions", SimpleStreamOptions>;
export interface OpenAIResponsesOptions extends BaseOpenAIStreamOptions {
  reasoningEffort?: OpenAIRequestReasoningEffort;
  reasoningSummary?: "auto" | "detailed" | "concise" | null;
  replayResponsesItemIds?: boolean;
  serviceTier?: ResponseCreateParamsStreaming["service_tier"];
}
export declare const streamOpenAIResponses: StreamFunction<"openai-responses", OpenAIResponsesOptions>;
export declare const streamSimpleOpenAIResponses: StreamFunction<"openai-responses", SimpleStreamOptions>;
export declare const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
export declare const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
export declare const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
export declare const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
export type ResponsesTextContentPartType = typeof OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE | typeof AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
export type ResponsesTextDeltaEventType = typeof OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE | typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
export type AzureResponsesTextContentPart = {
  type: typeof AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
  text: string;
};
export type AzureResponsesTextDeltaEvent = {
  type: typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
  delta: string;
};
export declare function isResponsesTextContentPartType(type: unknown): type is ResponsesTextContentPartType;
export declare function isResponsesTextDeltaEventType(type: unknown): type is ResponsesTextDeltaEventType;
export declare function isAzureResponsesTextDeltaEventType(type: unknown): type is typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
export declare function isAzureResponsesTextDeltaEvent(event: {
  type?: unknown;
  delta?: unknown;
}): event is AzureResponsesTextDeltaEvent;
export type ResponsesMessageSnapshotCollapse = {
  kind: "extend";
  text: string;
} | {
  kind: "keep";
};
export declare function resolveResponsesMessageSnapshotCollapse(params: {
  prior: {
    text: string;
    phase: string | undefined;
  } | null;
  nextText: string;
  nextPhase: string | undefined;
}): ResponsesMessageSnapshotCollapse;
export type ResponsesToolCallIdentity = {
  itemId?: string;
  callId?: string;
};
export type ResponsesToolCallState = ResponsesToolCallIdentity & {
  argumentStreamReliable: boolean;
  argumentsStreamed: boolean;
  outputIndex?: number;
};
type ResponsesToolCallEvent = {
  output_index?: unknown;
  item_id?: unknown;
};
export declare function readResponsesToolCallItemIdentity(item: {
  id?: unknown;
  call_id?: unknown;
}): ResponsesToolCallIdentity;
export declare function createResponsesToolCallTracker<TState extends ResponsesToolCallState>(): {
  register(event: ResponsesToolCallEvent, state: TState): void;
  resolve(event: ResponsesToolCallEvent, identity?: ResponsesToolCallIdentity, allowUnmatchedIdentity?: boolean): TState | undefined;
  forget(toolCall: TState): void;
  markArgumentsUnreliable(): void;
  hasActive(): boolean;
  values(): TState[];
  hasExactlyActive(expected: readonly TState[]): boolean;
};
export type OpenAIStopReasonResult = {
  stopReason: StopReason;
  errorMessage?: string;
};
export declare function mapOpenAIStopReason(reason: string | null, options?: {
  allowSingularToolCall?: boolean;
}): OpenAIStopReasonResult;
export declare function hasResponsesWebSearchTool(tools: unknown): boolean;
/** Host-owned authority for a single explicitly acknowledged Responses request. */
type ResponsesRequestLifecycle = {
  beforeDispatch(signal?: AbortSignal): Promise<void>;
  assertCurrent(): void;
  accepted(responseId: string, signal?: AbortSignal): Promise<void>;
  settle(): Promise<void>;
};
/** Private transport carrier: serialized options cannot mint host authority. */
export declare const responsesRequestLifecycle: {
  set(options: object, lifecycle: ResponsesRequestLifecycle): void;
  get(options: object | undefined): ResponsesRequestLifecycle | undefined;
};
/** Source identity survives payload spreads but never enters serialized provider input. */
export declare function bindResponsesInputMessage(source: Extract<Context["messages"][number], {
  role: "user";
}>): (input: unknown) => boolean;
export { type CodeModeToolSurfaceObservation, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH, OpenAIApiReasoningEffort, type OpenAICompletionsOptions, type OpenAICompletionsToolChoice, OpenAIReasoningEffort, type OpenAIToolProjection, type ResponsesPromptObservation, type ResponsesServiceTierObservation, ResponsesTerminalUsagePayload, applyOpenAICompletionsToolReasoning, applyResponsesCacheWritePricing, clampOpenAIPromptCacheKey, codeModeToolSurfaceObserver, encodedModelRequestBodyStream, isOpenAIGpt54MiniModel, isOpenAIGpt55Model, isOpenAIGpt56Model, isOpenAIGpt6Model, isResponsesOutputLimitToolCallError, mapResponsesTerminalUsage, measuredRequestPressure, modelRequestBodyState, normalizeOpenAIReasoningEffort, projectOpenAITools, readResponsesReasoningTokens, reasoningTagTextPolicy, reconcileOpenAICompletionsToolChoice, reconcileOpenAIResponsesToolChoice, resolveOpenAIModelReasoningEfforts, resolveOpenAIPromptCacheParams, resolveOpenAIReasoningEffortForModel, resolveOpenAIReasoningEffortMapping, resolveOpenAISupportedReasoningEfforts, resolveResponsesTerminalStopReason, responsesPromptObserver, responsesServiceTierObserver, supportsOpenAIReasoningEffort, supportsOpenAITemperature };
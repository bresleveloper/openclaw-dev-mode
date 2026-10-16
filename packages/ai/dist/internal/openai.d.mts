import "../index-D27wAoOr.mjs";
import { $ as StopReason, Q as SimpleStreamOptions, d as Context, k as Model, tt as StreamFunction } from "../types-DvzmWW8J.mjs";
import { C as supportsOpenAIReasoningEffort, S as resolveOpenAISupportedReasoningEfforts, _ as isOpenAIGpt6Model, a as BaseOpenAIStreamOptions, b as resolveOpenAIReasoningEffortForModel, c as OpenAICompletionsOptions, d as reasoningTagTextPolicy, f as OpenAIApiReasoningEffort, g as isOpenAIGpt56Model, h as isOpenAIGpt55Model, m as isOpenAIGpt54MiniModel, o as CodeModeToolSurfaceObservation, p as OpenAIReasoningEffort, u as codeModeToolSurfaceObserver, v as normalizeOpenAIReasoningEffort, w as supportsOpenAITemperature, x as resolveOpenAIReasoningEffortMapping, y as resolveOpenAIModelReasoningEfforts } from "../provider-options-CkieKvNJ.mjs";
import { a as reconcileOpenAIResponsesToolChoice, i as reconcileOpenAICompletionsToolChoice, n as OpenAIToolProjection, r as projectOpenAITools, t as OpenAICompletionsToolChoice } from "../openai-tool-projection-793cE3QX.mjs";
import "../types-UlNana-2.mjs";
import { t as ResolvedOpenAICompletionsCompat } from "../openai-completions-compat-BgPg1BRs.mjs";
import { a as ResponsesPromptObservation, c as responsesServiceTierObserver, d as OpenAIRequestReasoningEffort, o as ResponsesServiceTierObservation, s as responsesPromptObserver } from "../openai-responses-contracts-D5yVZBp-.mjs";
import { n as clampOpenAIPromptCacheKey, r as resolveOpenAIPromptCacheParams, t as OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "../openai-prompt-cache-CFviG_D4.mjs";
import { a as resolveResponsesTerminalStopReason, i as readResponsesReasoningTokens, n as isResponsesOutputLimitToolCallError, r as mapResponsesTerminalUsage, t as ResponsesTerminalUsagePayload } from "../openai-responses-terminal-usage-CempLedn.mjs";
import "../openai-responses-compaction-replay-BBNo098-.mjs";
import { ResponseCreateParamsStreaming, ResponseInputItem } from "openai/resources/responses/responses.js";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
//#region packages/ai/src/providers/azure-deployment-map.d.ts
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
//#endregion
//#region packages/ai/src/providers/azure-openai-responses-client-compat.d.ts
export declare function isTraditionalAzureOpenAIHost(hostname: string): boolean;
export declare function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl: string): boolean;
//#endregion
//#region packages/ai/src/openai-completions-messages.d.ts
/** Convert a normalized transcript to OpenAI Chat Completions messages. */
export declare function convertMessages(model: Model<"openai-completions">, context: Context, compat: ResolvedOpenAICompletionsCompat, options?: {
  cacheOptOutIndexes?: Set<number>;
  preserveSystemPromptCacheBoundary?: boolean;
}): ChatCompletionMessageParam[];
//#endregion
//#region packages/ai/src/providers/openai-completions.d.ts
export declare const streamOpenAICompletions: StreamFunction<"openai-completions", OpenAICompletionsOptions>;
export declare const streamSimpleOpenAICompletions: StreamFunction<"openai-completions", SimpleStreamOptions>;
//#endregion
//#region packages/ai/src/providers/openai-responses.d.ts
export interface OpenAIResponsesOptions extends BaseOpenAIStreamOptions {
  reasoningEffort?: OpenAIRequestReasoningEffort;
  reasoningSummary?: "auto" | "detailed" | "concise" | null;
  replayResponsesItemIds?: boolean;
  serviceTier?: ResponseCreateParamsStreaming["service_tier"];
}
export declare const streamOpenAIResponses: StreamFunction<"openai-responses", OpenAIResponsesOptions>;
export declare const streamSimpleOpenAIResponses: StreamFunction<"openai-responses", SimpleStreamOptions>;
//#endregion
//#region packages/ai/src/providers/openai-responses-stream-compat.d.ts
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
//#endregion
//#region packages/ai/src/providers/openai-responses-tool-call-tracker.d.ts
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
//#endregion
//#region packages/ai/src/providers/openai-stop-reason.d.ts
export type OpenAIStopReasonResult = {
  stopReason: StopReason;
  errorMessage?: string;
};
export declare function mapOpenAIStopReason(reason: string | null, options?: {
  allowSingularToolCall?: boolean;
}): OpenAIStopReasonResult;
//#endregion
//#region packages/ai/src/providers/openai-web-search-tools.d.ts
export declare function hasResponsesWebSearchTool(tools: unknown): boolean;
//#endregion
//#region packages/ai/src/transports/openai-responses-request-lifecycle.d.ts
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
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-messages-internal.d.ts
/** Source identity survives payload spreads but never enters serialized provider input. */
export declare function bindResponsesInputMessage(source: Extract<Context["messages"][number], {
  role: "user";
}>): (input: unknown) => boolean;
//#endregion
//#region packages/ai/src/transports/model-request-body.d.ts
type EncodedModelRequestBody = {
  body: Uint8Array<ArrayBuffer>;
  stream: boolean;
};
type ModelRequestBodyState = {
  enabled?: boolean;
  encode?: (payload: unknown) => Promise<EncodedModelRequestBody>;
  onBytes?: (bytes: number) => void;
};
/** Call-local state survives option spreads; no payload is cached across requests. */
export declare function modelRequestBodyState(options: object, inheritFrom?: object): ModelRequestBodyState;
export declare function serializeModelRequestBody(payload: unknown): EncodedModelRequestBody;
export declare function encodedModelRequestBodyStream(body: unknown): boolean | undefined;
//#endregion
export { type CodeModeToolSurfaceObservation, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH, OpenAIApiReasoningEffort, type OpenAICompletionsOptions, type OpenAICompletionsToolChoice, OpenAIReasoningEffort, type OpenAIToolProjection, type ResponsesPromptObservation, type ResponsesServiceTierObservation, ResponsesTerminalUsagePayload, clampOpenAIPromptCacheKey, codeModeToolSurfaceObserver, isOpenAIGpt54MiniModel, isOpenAIGpt55Model, isOpenAIGpt56Model, isOpenAIGpt6Model, isResponsesOutputLimitToolCallError, mapResponsesTerminalUsage, normalizeOpenAIReasoningEffort, projectOpenAITools, readResponsesReasoningTokens, reasoningTagTextPolicy, reconcileOpenAICompletionsToolChoice, reconcileOpenAIResponsesToolChoice, resolveOpenAIModelReasoningEfforts, resolveOpenAIPromptCacheParams, resolveOpenAIReasoningEffortForModel, resolveOpenAIReasoningEffortMapping, resolveOpenAISupportedReasoningEfforts, resolveResponsesTerminalStopReason, responsesPromptObserver, responsesServiceTierObserver, supportsOpenAIReasoningEffort, supportsOpenAITemperature };
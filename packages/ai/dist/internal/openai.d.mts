import { E as Model, F as SimpleStreamOptions, I as StopReason, O as OpenAICompletionsCompat, R as StreamFunction, u as Context, z as StreamOptions } from "../types-DRgdPqaZ.mjs";
import OpenAI from "openai";
import { TSchema } from "typebox";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import { ResponseCreateParamsStreaming } from "openai/resources/responses/responses.js";

//#region packages/ai/src/providers/agent-tools-parameter-schema.d.ts
/**
 * Narrow structural view of the host's model compat config. packages/ai must stay
 * config-agnostic, so only tool-schema-relevant fields are modeled here; the host's
 * ModelCompatConfig remains structurally assignable.
 */
type ToolSchemaModelCompat = {
  toolSchemaProfile?: string;
  unsupportedToolSchemaKeywords?: string[];
  omitEmptyArrayItems?: boolean;
};
/** Extracts the compat record whether callers pass a model (`{ compat }`) or the compat itself. */
declare function extractToolSchemaModelCompat(modelOrCompat: {
  compat?: unknown;
} | ToolSchemaModelCompat | undefined): ToolSchemaModelCompat | undefined;
/** JSON Schema keywords this model/provider rejects in tool schemas. */
declare function resolveUnsupportedToolSchemaKeywords(modelOrCompat: {
  compat?: unknown;
} | ToolSchemaModelCompat | undefined): ReadonlySet<string>;
/** Whether empty `items: {}` on array schemas must be omitted for this model/provider. */
declare function shouldOmitEmptyArrayItems(modelOrCompat: {
  compat?: unknown;
} | ToolSchemaModelCompat | undefined): boolean;
type ToolParameterSchemaOptions = {
  modelProvider?: string;
  modelId?: string;
  modelCompat?: ToolSchemaModelCompat;
};
/** Return a provider-compatible JSON schema for a model-facing tool. */
declare function normalizeToolParameterSchema(schema: unknown, options?: ToolParameterSchemaOptions): TSchema;
//#endregion
//#region packages/ai/src/providers/azure-deployment-map.d.ts
/** Parses AZURE_OPENAI_DEPLOYMENT_MAP-style model=deployment entries. */
declare function parseAzureDeploymentNameMap(value: string | undefined): Map<string, string>;
/** Resolves the Azure deployment name for a model id, falling back to the model id. */
declare function resolveAzureDeploymentNameFromMap(params: {
  modelId: string;
  deploymentMap?: string;
}): string;
//#endregion
//#region packages/ai/src/providers/azure-openai-responses-client-compat.d.ts
declare function isTraditionalAzureOpenAIHost(hostname: string): boolean;
declare function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl: string): boolean;
//#endregion
//#region packages/ai/src/providers/clean-for-gemini.d.ts
declare const GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS: Set<string>;
declare function cleanSchemaForGemini(schema: unknown): TSchema;
//#endregion
//#region packages/ai/src/providers/openai-tool-projection.d.ts
type OpenAIToolDescriptor = {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly parameters: unknown;
};
type OpenAIProjectedTool = {
  readonly toolIndex: number;
  readonly name: string;
  readonly description?: string;
  readonly parameters: Record<string, unknown>;
};
type OpenAIToolProjectionDiagnostic = {
  readonly toolIndex: number;
  readonly toolName?: string;
  readonly violations: readonly string[];
};
type OpenAIToolProjection = {
  readonly inputToolCount: number;
  readonly tools: readonly OpenAIProjectedTool[];
  readonly diagnostics: readonly OpenAIToolProjectionDiagnostic[];
};
type OpenAIResponsesToolChoice = ResponseCreateParamsStreaming["tool_choice"];
type OpenAICompletionsSdkToolChoice = OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming["tool_choice"];
type OpenAICompletionsToolChoice = Exclude<OpenAICompletionsSdkToolChoice, {
  type: "custom";
}>;
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
declare function projectOpenAITools(tools: readonly OpenAIToolDescriptor[]): OpenAIToolProjection;
/** Keeps Responses tool choices aligned with surviving function schemas. */
declare function reconcileOpenAIResponsesToolChoice(choice: OpenAIResponsesToolChoice, projection: OpenAIToolProjection): OpenAIResponsesToolChoice | undefined;
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
declare function reconcileOpenAICompletionsToolChoice(choice: OpenAICompletionsSdkToolChoice, projection: OpenAIToolProjection): OpenAICompletionsSdkToolChoice | undefined;
//#endregion
//#region packages/ai/src/providers/openai-completions.d.ts
interface OpenAICompletionsOptions extends StreamOptions {
  toolChoice?: OpenAICompletionsToolChoice;
  reasoningEffort?: "minimal" | "low" | "medium" | "high" | "xhigh";
}
type ResolvedOpenAICompletionsCompat = Omit<Required<OpenAICompletionsCompat>, "cacheControlFormat"> & {
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
};
declare const streamOpenAICompletions: StreamFunction<"openai-completions", OpenAICompletionsOptions>;
declare const streamSimpleOpenAICompletions: StreamFunction<"openai-completions", SimpleStreamOptions>;
declare function convertMessages(model: Model<"openai-completions">, context: Context, compat: ResolvedOpenAICompletionsCompat, options?: {
  cacheOptOutIndexes?: Set<number>;
  preserveSystemPromptCacheBoundary?: boolean;
}): ChatCompletionMessageParam[];
//#endregion
//#region packages/ai/src/providers/openai-prompt-cache.d.ts
/** Maximum prompt cache key length accepted by OpenAI-compatible request metadata. */
declare const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
/** Truncates a prompt cache key by Unicode code point count. */
declare function clampOpenAIPromptCacheKey(key: string | undefined): string | undefined;
//#endregion
//#region packages/ai/src/providers/openai-reasoning-effort.d.ts
type OpenAIReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
type OpenAIApiReasoningEffort = OpenAIReasoningEffort | (string & {});
type OpenAIReasoningModel = {
  provider?: unknown;
  id?: unknown;
  name?: unknown;
  api?: unknown;
  baseUrl?: unknown;
  compat?: unknown;
};
/** Return whether a model is the GPT-5.4 mini family. */
declare function isOpenAIGpt54MiniModel(model: OpenAIReasoningModel): boolean;
/** Return whether a model is the GPT-5.5 family. */
declare function isOpenAIGpt55Model(model: OpenAIReasoningModel): boolean;
/** Return whether a model is the GPT-5.6 family. */
declare function isOpenAIGpt56Model(model: OpenAIReasoningModel): boolean;
/** Normalize user-facing reasoning effort names to API effort names. */
declare function normalizeOpenAIReasoningEffort(effort: string): string;
/** Resolve the reasoning efforts accepted by a specific OpenAI-compatible model. */
declare function resolveOpenAISupportedReasoningEfforts(model: OpenAIReasoningModel): readonly OpenAIApiReasoningEffort[];
/** Return whether a model accepts a requested reasoning effort. */
declare function supportsOpenAIReasoningEffort(model: OpenAIReasoningModel, effort: string): boolean;
/** Resolve a requested reasoning effort to the closest value supported by the model. */
declare function resolveOpenAIReasoningEffortForModel(params: {
  model: OpenAIReasoningModel;
  effort: string;
  fallbackMap?: Record<string, string>;
}): OpenAIApiReasoningEffort | undefined;
//#endregion
//#region packages/ai/src/providers/openai-responses.d.ts
interface OpenAIResponsesOptions extends StreamOptions {
  reasoningEffort?: "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
  reasoningSummary?: "auto" | "detailed" | "concise" | null;
  replayResponsesItemIds?: boolean;
  serviceTier?: ResponseCreateParamsStreaming["service_tier"];
}
/**
 * Generate function for OpenAI Responses API
 */
declare const streamOpenAIResponses: StreamFunction<"openai-responses", OpenAIResponsesOptions>;
declare const streamSimpleOpenAIResponses: StreamFunction<"openai-responses", SimpleStreamOptions>;
//#endregion
//#region packages/ai/src/providers/openai-responses-stream-compat.d.ts
declare const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
declare const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
declare const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
declare const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
type ResponsesTextContentPartType = typeof OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE | typeof AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
type ResponsesTextDeltaEventType = typeof OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE | typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
type AzureResponsesTextContentPart = {
  type: typeof AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
  text: string;
};
type AzureResponsesTextDeltaEvent = {
  type: typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
  delta: string;
};
declare function isResponsesTextContentPartType(type: unknown): type is ResponsesTextContentPartType;
declare function isResponsesTextDeltaEventType(type: unknown): type is ResponsesTextDeltaEventType;
declare function isAzureResponsesTextDeltaEventType(type: unknown): type is typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
declare function isAzureResponsesTextDeltaEvent(event: {
  type?: unknown;
  delta?: unknown;
}): event is AzureResponsesTextDeltaEvent;
type ResponsesMessageSnapshotCollapse = {
  kind: "extend";
  text: string;
} | {
  kind: "keep";
};
declare function resolveResponsesMessageSnapshotCollapse(params: {
  prior: {
    text: string;
    phase: string | undefined;
  } | null;
  nextText: string;
  nextPhase: string | undefined;
}): ResponsesMessageSnapshotCollapse;
//#endregion
//#region packages/ai/src/providers/openai-stop-reason.d.ts
type OpenAIStopReasonResult = {
  stopReason: StopReason;
  errorMessage?: string;
};
declare function mapOpenAIStopReason(reason: string | null, options?: {
  allowSingularToolCall?: boolean;
}): OpenAIStopReasonResult;
//#endregion
//#region packages/ai/src/providers/openai-tool-schema.d.ts
/**
 * OpenAI strict-tool-schema normalization and diagnostics.
 *
 * Strict schemas need all object properties required and `additionalProperties: false`; model
 * compatibility settings can also remove unsupported schema constructs before strict checks run.
 */
type ToolSchemaCompatInput = {
  unsupportedToolSchemaKeywords?: unknown;
  omitEmptyArrayItems?: unknown;
};
declare function clearOpenAIToolSchemaCacheForTest(): void;
/** Normalizes a tool parameter schema into the OpenAI strict JSON-schema subset. */
declare function normalizeStrictOpenAIJsonSchema(schema: unknown, modelCompat?: ToolSchemaCompatInput | null): unknown;
/** Normalizes tool parameters using strict OpenAI rules only when strict mode is active. */
declare function normalizeOpenAIStrictToolParameters<T>(schema: T, strict: boolean, modelCompat?: ToolSchemaCompatInput | null): T;
/** Returns whether a schema already satisfies OpenAI strict tool-schema constraints. */
declare function isStrictOpenAIJsonSchemaCompatible(schema: unknown): boolean;
type OpenAIStrictToolSchemaDiagnostic = {
  toolIndex: number;
  toolName?: string;
  violations: string[];
};
/** Returns strict-schema diagnostics for an already materialized OpenAI tool projection. */
declare function findOpenAIStrictToolProjectionDiagnostics(projection: OpenAIToolProjection): OpenAIStrictToolSchemaDiagnostic[];
/** Resolves strict mode for the projected tools that will be emitted in the request payload. */
declare function resolveOpenAIProjectedToolsStrictToolFlag(projection: OpenAIToolProjection, strict: boolean | null | undefined): boolean | undefined;
//#endregion
//#region packages/ai/src/providers/schema-keyword-strip.d.ts
/** Recursively remove schema keywords unsupported by a target provider/tool surface. */
declare function stripUnsupportedSchemaKeywords(schema: unknown, unsupportedKeywords: ReadonlySet<string>): unknown;
//#endregion
//#region packages/ai/src/providers/tool-schema-json-projection.d.ts
/** JSON-safe schema value used when projecting runtime tool parameters. */
type RuntimeToolInputSchemaJson = null | boolean | number | string | RuntimeToolInputSchemaJson[] | {
  [key: string]: RuntimeToolInputSchemaJson;
};
/** Projected runtime tool schema plus validation violations. */
type RuntimeToolInputSchemaProjection = {
  readonly schema: RuntimeToolInputSchemaJson;
  readonly violations: readonly string[];
};
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
declare function projectRuntimeToolInputSchema(schema: unknown, path?: string): RuntimeToolInputSchemaProjection;
//#endregion
export { AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE, AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE, AzureResponsesTextContentPart, AzureResponsesTextDeltaEvent, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH, OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE, OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE, OpenAIApiReasoningEffort, OpenAICompletionsOptions, OpenAICompletionsToolChoice, OpenAIReasoningEffort, OpenAIResponsesOptions, OpenAIStopReasonResult, OpenAIToolProjection, ResponsesMessageSnapshotCollapse, ResponsesTextContentPartType, ResponsesTextDeltaEventType, RuntimeToolInputSchemaJson, RuntimeToolInputSchemaProjection, ToolParameterSchemaOptions, ToolSchemaModelCompat, clampOpenAIPromptCacheKey, cleanSchemaForGemini, clearOpenAIToolSchemaCacheForTest, convertMessages, extractToolSchemaModelCompat, findOpenAIStrictToolProjectionDiagnostics, isAzureResponsesTextDeltaEvent, isAzureResponsesTextDeltaEventType, isOpenAICompatibleAzureResponsesBaseUrl, isOpenAIGpt54MiniModel, isOpenAIGpt55Model, isOpenAIGpt56Model, isResponsesTextContentPartType, isResponsesTextDeltaEventType, isStrictOpenAIJsonSchemaCompatible, isTraditionalAzureOpenAIHost, mapOpenAIStopReason, normalizeOpenAIReasoningEffort, normalizeOpenAIStrictToolParameters, normalizeStrictOpenAIJsonSchema, normalizeToolParameterSchema, parseAzureDeploymentNameMap, projectOpenAITools, projectRuntimeToolInputSchema, reconcileOpenAICompletionsToolChoice, reconcileOpenAIResponsesToolChoice, resolveAzureDeploymentNameFromMap, resolveOpenAIProjectedToolsStrictToolFlag, resolveOpenAIReasoningEffortForModel, resolveOpenAISupportedReasoningEfforts, resolveResponsesMessageSnapshotCollapse, resolveUnsupportedToolSchemaKeywords, shouldOmitEmptyArrayItems, streamOpenAICompletions, streamOpenAIResponses, streamSimpleOpenAICompletions, streamSimpleOpenAIResponses, stripUnsupportedSchemaKeywords, supportsOpenAIReasoningEffort };
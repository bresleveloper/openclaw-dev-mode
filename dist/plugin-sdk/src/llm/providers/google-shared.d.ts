/**
 * Shared utilities for Google Generative AI and Google Vertex providers.
 */
import { type Content, FinishReason, FunctionCallingConfigMode, type GenerateContentParameters, type GenerateContentResponse, type Part, type ThinkingConfig } from "@google/genai";
import type { Api, AssistantMessage, Context, Model, SimpleStreamOptions, StopReason, Tool, StreamOptions } from "../types.js";
import type { AssistantMessageEventStream } from "../utils/event-stream.js";
export type GoogleApiType = "google-generative-ai" | "google-vertex";
/**
 * Thinking level for Gemini 3 models.
 * Mirrors Google's ThinkingLevel enum values.
 */
export type GoogleThinkingLevel = "THINKING_LEVEL_UNSPECIFIED" | "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
export type GoogleToolChoice = "auto" | "none" | "any";
export type GoogleThinkingOptions = {
    enabled: boolean;
    budgetTokens?: number;
    level?: GoogleThinkingLevel;
};
export type GoogleProviderOptions = StreamOptions & {
    toolChoice?: GoogleToolChoice;
    thinking?: GoogleThinkingOptions;
};
type GoogleGenerateContentClient = {
    models: {
        generateContentStream(params: GenerateContentParameters): Promise<AsyncIterable<GenerateContentResponse>> | AsyncIterable<GenerateContentResponse>;
    };
};
/**
 * Determines whether a streamed Gemini `Part` should be treated as "thinking".
 *
 * Protocol note (Gemini / Vertex AI thought signatures):
 * - `thought: true` is the definitive marker for thinking content (thought summaries).
 * - `thoughtSignature` is an encrypted representation of the model's internal thought process
 *   used to preserve reasoning context across multi-turn interactions.
 * - `thoughtSignature` can appear on ANY part type (text, functionCall, etc.) - it does NOT
 *   indicate the part itself is thinking content.
 * - For non-functionCall responses, the signature appears on the last part for context replay.
 * - When persisting/replaying model outputs, signature-bearing parts must be preserved as-is;
 *   do not merge/move signatures across parts.
 *
 * See: https://ai.google.dev/gemini-api/docs/thought-signatures
 */
export declare function isThinkingPart(part: Pick<Part, "thought" | "thoughtSignature">): boolean;
/**
 * Retain thought signatures during streaming.
 *
 * Some backends only send `thoughtSignature` on the first delta for a given part/block; later deltas may omit it.
 * This helper preserves the last non-empty signature for the current block.
 *
 * Note: this does NOT merge or move signatures across distinct response parts. It only prevents
 * a signature from being overwritten with `undefined` within the same streamed block.
 */
export declare function retainThoughtSignature(existing: string | undefined, incoming: string | undefined): string | undefined;
/**
 * Models via Google APIs that require explicit tool call IDs in function calls/responses.
 */
export declare function requiresToolCallId(modelId: string): boolean;
/**
 * Convert internal messages to Gemini Content[] format.
 */
export declare function convertMessages<T extends GoogleApiType>(model: Model<T>, context: Context): Content[];
/**
 * Convert tools to Gemini function declarations format.
 *
 * By default uses `parametersJsonSchema` which supports full JSON Schema (including
 * anyOf, oneOf, const, etc.). Set `useParameters` to true to use the legacy `parameters`
 * field instead (OpenAPI 3.03 Schema). This is needed for Cloud Code Assist with Claude
 * models, where the API translates `parameters` into Anthropic's `input_schema`.
 */
export declare function convertTools(tools: Tool[], useParameters?: boolean): {
    functionDeclarations: Record<string, unknown>[];
}[] | undefined;
/**
 * Map tool choice string to Gemini FunctionCallingConfigMode.
 */
export declare function mapToolChoice(choice: string): FunctionCallingConfigMode;
export declare function createGoogleAssistantOutput<T extends GoogleApiType>(model: Model<T>, api?: Api): AssistantMessage;
export declare function runGoogleGenerateContentLifecycle<T extends GoogleApiType>(params: {
    stream: AssistantMessageEventStream;
    model: Model<T>;
    output: AssistantMessage;
    options?: Pick<StreamOptions, "signal" | "onPayload">;
    createClient: () => GoogleGenerateContentClient;
    buildParams: () => GenerateContentParameters;
    nextToolCallId: (name: string | undefined) => string;
}): Promise<void>;
export declare function buildGoogleGenerateContentParams<T extends GoogleApiType>(model: Model<T>, context: Context, options?: GoogleProviderOptions, configHooks?: {
    mapThinkingLevel?: (level: GoogleThinkingLevel) => ThinkingConfig["thinkingLevel"];
    getDisabledThinkingConfig?: (model: Model<T>) => ThinkingConfig;
}): GenerateContentParameters;
export declare function buildGoogleSimpleThinking<T extends GoogleApiType>(model: Model<T>, options: SimpleStreamOptions | undefined, config?: {
    includeGemma4ThinkingLevel?: boolean;
    useFlashLiteBudgets?: boolean;
}): GoogleThinkingOptions;
export declare function getDisabledGoogleThinkingConfig<T extends GoogleApiType>(model: Model<T>, config?: {
    includeGemma4?: boolean;
    mapThinkingLevel?: (level: GoogleThinkingLevel) => ThinkingConfig["thinkingLevel"];
}): ThinkingConfig;
export declare function isGemma4Model<T extends GoogleApiType>(model: Model<T>): boolean;
export declare function isGemini3ProModel<T extends GoogleApiType>(model: Model<T>): boolean;
export declare function isGemini3FlashModel<T extends GoogleApiType>(model: Model<T>): boolean;
/**
 * Map Gemini FinishReason to our StopReason.
 */
export declare function mapStopReason(reason: FinishReason): StopReason;
export declare function consumeGoogleGenerateContentStream<T extends GoogleApiType>(params: {
    chunks: AsyncIterable<GenerateContentResponse>;
    model: Model<T>;
    output: AssistantMessage;
    stream: AssistantMessageEventStream;
    signal?: AbortSignal;
    nextToolCallId: (name: string | undefined) => string;
}): Promise<void>;
export {};

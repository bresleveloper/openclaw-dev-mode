import { r as AssistantMessageEventStream } from "./index-Cddu0VgP.js";
import { c as Context, f as Model, n as Api } from "./types-Boa_mcGH.js";
import { o as ModelCompatConfig } from "./types.models-C597Wbu7.js";
import OpenAI from "openai";
//#region src/agents/provider-transport-fetch.d.ts
declare function buildGuardedModelFetch(model: Model, timeoutMs?: number, options?: {
  sanitizeSse?: boolean;
}): typeof fetch;
//#endregion
//#region src/agents/openai-reasoning-effort.d.ts
type OpenAIReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
//#endregion
//#region src/agents/openai-tool-projection.d.ts
type OpenAICompletionsSdkToolChoice = OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming["tool_choice"];
type OpenAICompletionsToolChoice = Exclude<OpenAICompletionsSdkToolChoice, {
  type: "custom";
}>;
//#endregion
//#region src/agents/transport-stream-shared.d.ts
type TransportUsage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
};
type WritableTransportStream = {
  push(event: unknown): void;
  end(): void;
};
type TransportOutputShape = {
  stopReason: string;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
};
declare function sanitizeTransportPayloadText(text: string): string;
declare function coerceTransportToolCallArguments(argumentsValue: unknown): Record<string, unknown>;
declare function mergeTransportHeaders(...headerSources: Array<Record<string, string> | undefined>): Record<string, string> | undefined;
declare function createEmptyTransportUsage(): TransportUsage;
declare function createWritableTransportEventStream(): {
  eventStream: AssistantMessageEventStream;
  stream: WritableTransportStream;
};
declare function finalizeTransportStream(params: {
  stream: WritableTransportStream;
  output: TransportOutputShape;
  signal?: AbortSignal;
}): void;
declare function failTransportStream(params: {
  stream: WritableTransportStream;
  output: TransportOutputShape;
  signal?: AbortSignal;
  error: unknown;
  cleanup?: () => void;
}): void;
//#endregion
//#region src/agents/openai-transport-stream.d.ts
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
declare function buildOpenAICompletionsParams(model: OpenAIModeModel, context: Context, options: OpenAICompletionsOptions | undefined): Record<string, unknown>;
//#endregion
//#region src/agents/system-prompt-cache-boundary.d.ts
declare function stripSystemPromptCacheBoundary(text: string): string;
//#endregion
//#region src/agents/transport-message-transform.d.ts
/** Transforms transcript messages into a provider-safe replay context. */
declare function transformTransportMessages(messages: Context["messages"], model: Model, normalizeToolCallId?: (id: string, targetModel: Model, source: {
  provider: string;
  api: Api;
  model: string;
}) => string, options?: {
  normalizeSameModelToolCallIds?: boolean;
  preserveCrossModelToolCallThoughtSignature?: boolean;
}): Context["messages"];
//#endregion
export { type WritableTransportStream, buildGuardedModelFetch, buildOpenAICompletionsParams, coerceTransportToolCallArguments, createEmptyTransportUsage, createWritableTransportEventStream, failTransportStream, finalizeTransportStream, mergeTransportHeaders, sanitizeTransportPayloadText, stripSystemPromptCacheBoundary, transformTransportMessages };
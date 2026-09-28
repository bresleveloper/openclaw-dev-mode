import { Pn as StreamFn, St as ProviderWrapStreamFnContext, r as OpenClawPluginApi } from "./runtime-api-CHs6AUp7.js";
import { d as AssistantMessage, n as OpenClawConfig } from "./types.openclaw-BsXQib09.js";
import "@openclaw/ai/internal/tool-schema";
//#region extensions/ollama/src/defaults.d.ts
declare const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
declare const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128000;
declare const OLLAMA_DEFAULT_MAX_TOKENS = 8192;
declare const OLLAMA_DEFAULT_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const OLLAMA_DEFAULT_MODEL = "gemma4";
declare const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
declare function resolveOllamaSetupDefaultBaseUrl(env?: NodeJS.ProcessEnv): string;
//#endregion
//#region extensions/ollama/src/stream-compat.d.ts
type OllamaThinkValue = boolean | "low" | "medium" | "high" | "max";
declare function isOllamaCompatProvider(model: {
  provider?: string;
  baseUrl?: string;
  api?: string;
}): boolean;
declare function resolveOllamaCompatNumCtxEnabled(params: {
  config?: OpenClawConfig;
  providerId?: string;
}): boolean;
declare function shouldInjectOllamaCompatNumCtx(params: {
  model: {
    api?: string;
    provider?: string;
    baseUrl?: string;
  };
  config?: OpenClawConfig;
  providerId?: string;
}): boolean;
declare function wrapOllamaCompatNumCtx(baseFn: StreamFn | undefined, numCtx: number): StreamFn;
declare function createConfiguredOllamaCompatStreamWrapper(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
//#region extensions/ollama/src/stream-registration.d.ts
type OllamaLocalService = {
  providerId: string;
  acquire: OpenClawPluginApi["runtime"]["llm"]["acquireLocalService"];
};
//#endregion
//#region extensions/ollama/src/provider-base-url.d.ts
declare function resolveOllamaBaseUrlForRun$1(params: {
  modelBaseUrl?: string;
  providerBaseUrl?: string;
}): string;
declare namespace stream_runtime_d_exports {
  export { OLLAMA_NATIVE_BASE_URL$1 as OLLAMA_NATIVE_BASE_URL, buildAssistantMessage$1 as buildAssistantMessage, buildOllamaChatRequest$1 as buildOllamaChatRequest, convertToOllamaMessages$1 as convertToOllamaMessages, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn$1 as createConfiguredOllamaStreamFn, createOllamaStreamFn$1 as createOllamaStreamFn, isOllamaCompatProvider, parseNdjsonStream$1 as parseNdjsonStream, resolveOllamaBaseUrlForRun$1 as resolveOllamaBaseUrlForRun, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
}
declare const OLLAMA_NATIVE_BASE_URL$1 = "http://127.0.0.1:11434";
declare function buildOllamaChatRequest$1(params: {
  modelId: string;
  providerId?: string;
  messages: OllamaChatMessage[];
  tools?: OllamaTool[];
  options?: Record<string, unknown>;
  requestParams?: Record<string, unknown>;
  stream?: boolean;
}): OllamaChatRequest;
type StreamModelDescriptor = {
  api: string;
  provider: string;
  id: string;
  reasoning?: boolean;
};
type OllamaUsageFallback = Partial<Record<"input" | "output", number | (() => number)>>;
interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream: boolean;
  tools?: OllamaTool[];
  options?: Record<string, unknown>;
  think?: OllamaThinkValue;
  format?: "json" | Record<string, unknown>;
}
interface OllamaChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  thinking?: string;
  images?: string[];
  tool_calls?: OllamaToolCall[];
  tool_name?: string;
  tool_call_id?: string;
}
interface OllamaTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}
interface OllamaToolCall {
  id?: string;
  function: {
    name: string;
    arguments: Record<string, unknown> | string;
  };
}
interface OllamaChatResponse extends Record<string, unknown> {
  model: string;
  created_at: string;
  message: {
    role: "assistant";
    content: string;
    thinking?: string;
    reasoning?: string;
    tool_calls?: OllamaToolCall[];
  };
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_cached_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}
type OllamaToolCallNameOptions = {
  availableToolNames?: ReadonlySet<string>;
};
type OllamaAssistantMessageBuildOptions = OllamaToolCallNameOptions & {
  sanitizeVisibleContent?: boolean;
};
type OllamaInputMessage = {
  role: string;
  content: unknown;
  toolName?: unknown;
  toolCallId?: unknown;
  isError?: unknown;
};
declare function convertToOllamaMessages$1(messages: OllamaInputMessage[], system?: string, options?: OllamaToolCallNameOptions): OllamaChatMessage[];
declare function buildAssistantMessage$1(response: OllamaChatResponse, modelInfo: StreamModelDescriptor, usageFallback?: OllamaUsageFallback, options?: OllamaAssistantMessageBuildOptions): AssistantMessage;
declare function parseNdjsonStream$1(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<OllamaChatResponse>;
declare function createOllamaStreamFn$1(baseUrl: string, defaultHeaders?: Record<string, string>): StreamFn;
declare function createConfiguredOllamaStreamFn$1(params: {
  model: {
    baseUrl?: string;
    headers?: unknown;
  };
  localService?: OllamaLocalService;
  providerBaseUrl?: string;
}): StreamFn;
//#endregion
//#region extensions/ollama/src/stream-api.d.ts
type OllamaStreamRuntime = typeof stream_runtime_d_exports;
declare const OLLAMA_NATIVE_BASE_URL = "http://127.0.0.1:11434";
declare const resolveOllamaBaseUrlForRun: OllamaStreamRuntime["resolveOllamaBaseUrlForRun"];
declare const buildOllamaChatRequest: OllamaStreamRuntime["buildOllamaChatRequest"];
declare const convertToOllamaMessages: OllamaStreamRuntime["convertToOllamaMessages"];
declare const buildAssistantMessage: OllamaStreamRuntime["buildAssistantMessage"];
declare const parseNdjsonStream: OllamaStreamRuntime["parseNdjsonStream"];
declare const createOllamaStreamFn: OllamaStreamRuntime["createOllamaStreamFn"];
declare const createConfiguredOllamaStreamFn: OllamaStreamRuntime["createConfiguredOllamaStreamFn"];
//#endregion
export { OLLAMA_DEFAULT_COST as _, createConfiguredOllamaStreamFn as a, resolveOllamaSetupDefaultBaseUrl as b, resolveOllamaBaseUrlForRun as c, resolveOllamaCompatNumCtxEnabled as d, shouldInjectOllamaCompatNumCtx as f, OLLAMA_DEFAULT_CONTEXT_WINDOW as g, OLLAMA_DEFAULT_BASE_URL as h, convertToOllamaMessages as i, createConfiguredOllamaCompatStreamWrapper as l, DEFAULT_OLLAMA_EMBEDDING_MODEL as m, buildAssistantMessage as n, createOllamaStreamFn as o, wrapOllamaCompatNumCtx as p, buildOllamaChatRequest as r, parseNdjsonStream as s, OLLAMA_NATIVE_BASE_URL as t, isOllamaCompatProvider as u, OLLAMA_DEFAULT_MAX_TOKENS as v, OLLAMA_DEFAULT_MODEL as y };
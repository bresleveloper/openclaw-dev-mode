import { M as OpenClawConfig, X as AssistantMessage } from "./types-D7I_F5Ux.js";
import { It as OpenClawPluginApi, nh as ProviderWrapStreamFnContext } from "./config-contracts-CY87ANNp.js";
import { A as StreamFn } from "./common-CCG3ut4I.js";
import "./provider-model-types-CgVL4xyM.js";
import "./provider-model-shared-uYxY__EE.js";
//#region extensions/ollama/src/defaults.d.ts
declare const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
declare const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128000;
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
//#region extensions/ollama/src/model-reasoning.d.ts
declare const OLLAMA_THINKING_EFFORTS: readonly ["minimal", "low", "medium", "high", "xhigh", "max"];
type OllamaThinkValue = boolean | (typeof OLLAMA_THINKING_EFFORTS)[number];
//#endregion
//#region extensions/ollama/src/stream-compat.d.ts
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
//#region extensions/ollama/src/stream-messages.d.ts
interface OllamaChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  thinking?: string;
  images?: string[];
  tool_calls?: OllamaToolCall[];
  tool_name?: string;
  tool_call_id?: string;
}
interface OllamaToolCall {
  id?: string;
  function: {
    name: string;
    arguments: Record<string, unknown> | string;
  };
}
type OllamaToolCallNameOptions = {
  availableToolNames?: ReadonlySet<string>;
};
type OllamaInputMessage = {
  role: string;
  content: unknown;
  toolName?: unknown;
  toolCallId?: unknown;
  isError?: unknown;
};
declare function convertToOllamaMessages(messages: OllamaInputMessage[], system?: string, options?: OllamaToolCallNameOptions): OllamaChatMessage[];
//#endregion
//#region extensions/ollama/src/stream-ndjson.d.ts
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
declare function parseNdjsonStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<OllamaChatResponse>;
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
  export { OLLAMA_NATIVE_BASE_URL$1 as OLLAMA_NATIVE_BASE_URL, buildAssistantMessage$1 as buildAssistantMessage, buildOllamaChatRequest$1 as buildOllamaChatRequest, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn$1 as createConfiguredOllamaStreamFn, createOllamaStreamFn$1 as createOllamaStreamFn, resolveOllamaBaseUrlForRun$1 as resolveOllamaBaseUrlForRun };
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
interface OllamaTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}
type OllamaAssistantMessageBuildOptions = OllamaToolCallNameOptions & {
  sanitizeVisibleContent?: boolean;
};
declare function buildAssistantMessage$1(response: OllamaChatResponse, modelInfo: StreamModelDescriptor, usageFallback?: OllamaUsageFallback, options?: OllamaAssistantMessageBuildOptions): AssistantMessage;
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
declare const { OLLAMA_NATIVE_BASE_URL, resolveOllamaBaseUrlForRun, buildOllamaChatRequest, buildAssistantMessage, createOllamaStreamFn, createConfiguredOllamaStreamFn }: typeof stream_runtime_d_exports;
//#endregion
export { OLLAMA_DEFAULT_COST as _, createOllamaStreamFn as a, convertToOllamaMessages as c, resolveOllamaCompatNumCtxEnabled as d, shouldInjectOllamaCompatNumCtx as f, OLLAMA_DEFAULT_CONTEXT_WINDOW as g, OLLAMA_DEFAULT_BASE_URL as h, createConfiguredOllamaStreamFn as i, createConfiguredOllamaCompatStreamWrapper as l, DEFAULT_OLLAMA_EMBEDDING_MODEL as m, buildAssistantMessage as n, resolveOllamaBaseUrlForRun as o, wrapOllamaCompatNumCtx as p, buildOllamaChatRequest as r, parseNdjsonStream as s, OLLAMA_NATIVE_BASE_URL as t, isOllamaCompatProvider as u, OLLAMA_DEFAULT_MODEL as v, resolveOllamaSetupDefaultBaseUrl as y };
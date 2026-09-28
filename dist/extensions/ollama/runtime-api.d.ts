import { Ot as EmbeddingProvider, yn as SsrFPolicy } from "../../runtime-api-CHs6AUp7.js";
import { n as OpenClawConfig } from "../../types.openclaw-BsXQib09.js";
import { a as createConfiguredOllamaStreamFn, c as resolveOllamaBaseUrlForRun, d as resolveOllamaCompatNumCtxEnabled, f as shouldInjectOllamaCompatNumCtx, i as convertToOllamaMessages, l as createConfiguredOllamaCompatStreamWrapper, m as DEFAULT_OLLAMA_EMBEDDING_MODEL, n as buildAssistantMessage, o as createOllamaStreamFn, p as wrapOllamaCompatNumCtx, r as buildOllamaChatRequest, s as parseNdjsonStream, t as OLLAMA_NATIVE_BASE_URL, u as isOllamaCompatProvider } from "../../stream-api-CA32koju.js";
declare namespace embedding_provider_runtime_d_exports {
  export { DEFAULT_OLLAMA_EMBEDDING_MODEL, OllamaEmbeddingClient, OllamaEmbeddingProvider, createOllamaEmbeddingProvider$1 as createOllamaEmbeddingProvider };
}
type OllamaEmbeddingProvider = EmbeddingProvider;
type MemoryCoreAcquireLocalService = (target: {
  providerId: string;
  baseUrl: string;
  headers?: HeadersInit;
}, signal?: AbortSignal | null) => Promise<{
  release: () => void;
} | undefined>;
type OllamaEmbeddingOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: unknown;
    headers?: Record<string, string>;
  };
  model: string;
  fallback?: string;
  local?: unknown;
  dimensions?: number;
  taskType?: unknown;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
type OllamaEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  model: string;
  outputDimensionality?: number;
  localServiceTarget?: Parameters<MemoryCoreAcquireLocalService>[0];
  acquireLocalService?: MemoryCoreAcquireLocalService;
  embedBatch: (texts: string[]) => Promise<number[][]>;
};
declare function createOllamaEmbeddingProvider$1(options: OllamaEmbeddingOptions): Promise<{
  provider: OllamaEmbeddingProvider;
  client: OllamaEmbeddingClient;
}>;
//#endregion
//#region extensions/ollama/src/embedding-provider.d.ts
type OllamaEmbeddingRuntime = typeof embedding_provider_runtime_d_exports;
export declare const createOllamaEmbeddingProvider: OllamaEmbeddingRuntime["createOllamaEmbeddingProvider"];
//#endregion
export { DEFAULT_OLLAMA_EMBEDDING_MODEL, OLLAMA_NATIVE_BASE_URL, type OllamaEmbeddingClient, type OllamaEmbeddingProvider, buildAssistantMessage, buildOllamaChatRequest, convertToOllamaMessages, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn, createOllamaStreamFn, isOllamaCompatProvider, parseNdjsonStream, resolveOllamaBaseUrlForRun, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
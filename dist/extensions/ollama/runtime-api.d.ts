import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import { O as AcquireConfiguredProviderLocalService } from "../../registry-contribution-types-2o1L1H_Q.js";
import "../../provider-auth-QzauSf-u.js";
import { i as EmbeddingProvider } from "../../embedding-provider-runtime-types-CuJxbTgC.js";
import { t as RemoteEmbeddingClient } from "../../embedding-providers-B1O6AknT.js";
import { a as createOllamaStreamFn, c as createConfiguredOllamaCompatStreamWrapper, d as shouldInjectOllamaCompatNumCtx, f as wrapOllamaCompatNumCtx, i as createConfiguredOllamaStreamFn, l as isOllamaCompatProvider, n as buildAssistantMessage, o as resolveOllamaBaseUrlForRun, p as DEFAULT_OLLAMA_EMBEDDING_MODEL, r as buildOllamaChatRequest, s as parseNdjsonStream, t as OLLAMA_NATIVE_BASE_URL, u as resolveOllamaCompatNumCtxEnabled } from "../../stream-api-CZSjw123.js";
declare namespace embedding_provider_runtime_d_exports {
  export { DEFAULT_OLLAMA_EMBEDDING_MODEL, OllamaEmbeddingClient, OllamaEmbeddingProvider, createOllamaEmbeddingProvider$1 as createOllamaEmbeddingProvider };
}
type OllamaEmbeddingProvider = EmbeddingProvider;
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
  acquireLocalService?: AcquireConfiguredProviderLocalService;
};
type OllamaEmbeddingClient = Omit<RemoteEmbeddingClient, "fetchImpl"> & {
  outputDimensionality?: number;
  localServiceTarget?: Parameters<AcquireConfiguredProviderLocalService>[0];
  acquireLocalService?: AcquireConfiguredProviderLocalService;
  /** Provider ownership permits the guard to check its narrow Podman origin exception. */
  allowPodmanHostGatewayLinkLocal?: boolean;
  embedBatch: (texts: string[]) => Promise<number[][]>;
};
declare function createOllamaEmbeddingProvider$1(options: OllamaEmbeddingOptions): Promise<{
  provider: OllamaEmbeddingProvider;
  client: OllamaEmbeddingClient;
}>;
type OllamaEmbeddingRuntime = typeof embedding_provider_runtime_d_exports;
export declare const createOllamaEmbeddingProvider: OllamaEmbeddingRuntime["createOllamaEmbeddingProvider"];
export { DEFAULT_OLLAMA_EMBEDDING_MODEL, OLLAMA_NATIVE_BASE_URL, type OllamaEmbeddingClient, type OllamaEmbeddingProvider, buildAssistantMessage, buildOllamaChatRequest, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn, createOllamaStreamFn, isOllamaCompatProvider, parseNdjsonStream, resolveOllamaBaseUrlForRun, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
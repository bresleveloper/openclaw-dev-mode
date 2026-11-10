import { t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "../../defaults-CDpC0pZy.mjs";
import { i as resolveOllamaCompatNumCtxEnabled, l as wrapOllamaCompatNumCtx, n as isOllamaCompatProvider, s as shouldInjectOllamaCompatNumCtx, t as createConfiguredOllamaCompatStreamWrapper } from "../../stream-compat-D3t5jDw2.mjs";
import { n as parseNdjsonStream, t as convertToOllamaMessages } from "../../stream-messages-CBN1WNa0.mjs";
import { a as createOllamaStreamFn, i as createConfiguredOllamaStreamFn, n as buildAssistantMessage, o as resolveOllamaBaseUrlForRun, r as buildOllamaChatRequest, t as OLLAMA_NATIVE_BASE_URL } from "../../stream-api-w2cVi2Np.mjs";
import { t as createOllamaEmbeddingProvider } from "../../embedding-provider--bNoARcE.mjs";
export { DEFAULT_OLLAMA_EMBEDDING_MODEL, OLLAMA_NATIVE_BASE_URL, buildAssistantMessage, buildOllamaChatRequest, convertToOllamaMessages, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn, createOllamaEmbeddingProvider, createOllamaStreamFn, isOllamaCompatProvider, parseNdjsonStream, resolveOllamaBaseUrlForRun, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };

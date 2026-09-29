import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./stream-compat-BLFheAUa.mjs";
//#region extensions/ollama/src/stream-api.ts
const ollamaStreamRuntime = await createLazyRuntimeModule(() => import("./stream.runtime.js"))();
const OLLAMA_NATIVE_BASE_URL = ollamaStreamRuntime.OLLAMA_NATIVE_BASE_URL;
const resolveOllamaBaseUrlForRun = ollamaStreamRuntime.resolveOllamaBaseUrlForRun;
const buildOllamaChatRequest = ollamaStreamRuntime.buildOllamaChatRequest;
const convertToOllamaMessages = ollamaStreamRuntime.convertToOllamaMessages;
const buildAssistantMessage = ollamaStreamRuntime.buildAssistantMessage;
const parseNdjsonStream = ollamaStreamRuntime.parseNdjsonStream;
const createOllamaStreamFn = ollamaStreamRuntime.createOllamaStreamFn;
const createConfiguredOllamaStreamFn = ollamaStreamRuntime.createConfiguredOllamaStreamFn;
//#endregion
export { createConfiguredOllamaStreamFn as a, resolveOllamaBaseUrlForRun as c, convertToOllamaMessages as i, buildAssistantMessage as n, createOllamaStreamFn as o, buildOllamaChatRequest as r, parseNdjsonStream as s, OLLAMA_NATIVE_BASE_URL as t };

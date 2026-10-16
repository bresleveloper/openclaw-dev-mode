import "./stream-compat-CWr-528v.mjs";
//#region extensions/ollama/src/stream-api.ts
const { OLLAMA_NATIVE_BASE_URL, resolveOllamaBaseUrlForRun, buildOllamaChatRequest, convertToOllamaMessages, buildAssistantMessage, parseNdjsonStream, createOllamaStreamFn, createConfiguredOllamaStreamFn } = await import("./stream.runtime.js");
//#endregion
export { createConfiguredOllamaStreamFn as a, resolveOllamaBaseUrlForRun as c, convertToOllamaMessages as i, buildAssistantMessage as n, createOllamaStreamFn as o, buildOllamaChatRequest as r, parseNdjsonStream as s, OLLAMA_NATIVE_BASE_URL as t };

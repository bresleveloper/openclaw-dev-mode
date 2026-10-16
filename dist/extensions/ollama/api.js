import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { c as OLLAMA_DEFAULT_COST, g as resolveOllamaSetupDefaultBaseUrl, l as OLLAMA_DEFAULT_MAX_TOKENS, o as OLLAMA_DEFAULT_BASE_URL, s as OLLAMA_DEFAULT_CONTEXT_WINDOW, u as OLLAMA_DEFAULT_MODEL } from "../../defaults-Dkg1KktH.mjs";
import { _ as queryOllamaModelShowInfo, c as enrichOllamaModelsWithContext, g as queryOllamaContextWindow, i as buildOllamaProvider, m as isReasoningModelHeuristic, r as buildOllamaModelDefinition, u as fetchOllamaModels, y as resolveOllamaApiBase } from "../../provider-models-CZCvuhcN.mjs";
import { i as resolveOllamaCompatNumCtxEnabled, l as wrapOllamaCompatNumCtx, n as isOllamaCompatProvider, s as shouldInjectOllamaCompatNumCtx, t as createConfiguredOllamaCompatStreamWrapper } from "../../stream-compat-CWr-528v.mjs";
import { r as buildOllamaChatRequest } from "../../stream-api-wX4GrtKX.mjs";
//#region extensions/ollama/src/setup.ts
const loadOllamaSetupRuntime = createLazyRuntimeModule(() => import("../../setup.runtime-VTMhdzai.mjs"));
const setupMethod = createLazyRuntimeMethodBinder(loadOllamaSetupRuntime);
const promptAndConfigureOllama = setupMethod((runtime) => runtime.promptAndConfigureOllama);
const configureOllamaNonInteractive = setupMethod((runtime) => runtime.configureOllamaNonInteractive);
const ensureOllamaModelPulled = setupMethod((runtime) => runtime.ensureOllamaModelPulled);
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MAX_TOKENS, OLLAMA_DEFAULT_MODEL, buildOllamaChatRequest, buildOllamaModelDefinition, buildOllamaProvider, configureOllamaNonInteractive, createConfiguredOllamaCompatStreamWrapper, enrichOllamaModelsWithContext, ensureOllamaModelPulled, fetchOllamaModels, isOllamaCompatProvider, isReasoningModelHeuristic, promptAndConfigureOllama, queryOllamaContextWindow, queryOllamaModelShowInfo, resolveOllamaApiBase, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };

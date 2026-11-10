import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { _ as resolveOllamaSetupDefaultBaseUrl, c as OLLAMA_DEFAULT_COST, l as OLLAMA_DEFAULT_MODEL, o as OLLAMA_DEFAULT_BASE_URL, s as OLLAMA_DEFAULT_CONTEXT_WINDOW } from "../../defaults-CDpC0pZy.mjs";
import { _ as queryOllamaModelShowInfo, c as enrichOllamaModelsWithContext, g as queryOllamaContextWindow, i as buildOllamaProvider, m as isReasoningModelHeuristic, r as buildOllamaModelDefinition, u as fetchOllamaModels, y as resolveOllamaApiBase } from "../../provider-models-CAeiI0VX.mjs";
import { i as resolveOllamaCompatNumCtxEnabled, l as wrapOllamaCompatNumCtx, n as isOllamaCompatProvider, s as shouldInjectOllamaCompatNumCtx, t as createConfiguredOllamaCompatStreamWrapper } from "../../stream-compat-D3t5jDw2.mjs";
import { r as buildOllamaChatRequest } from "../../stream-api-w2cVi2Np.mjs";
//#region extensions/ollama/src/setup.ts
const loadOllamaSetupRuntime = createLazyRuntimeModule(() => import("../../setup.runtime-oosFtyNs.mjs"));
const setupMethod = createLazyRuntimeMethodBinder(loadOllamaSetupRuntime);
const promptAndConfigureOllama = setupMethod((runtime) => runtime.promptAndConfigureOllama);
const configureOllamaNonInteractive = setupMethod((runtime) => runtime.configureOllamaNonInteractive);
const ensureOllamaModelPulled = setupMethod((runtime) => runtime.ensureOllamaModelPulled);
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MODEL, buildOllamaChatRequest, buildOllamaModelDefinition, buildOllamaProvider, configureOllamaNonInteractive, createConfiguredOllamaCompatStreamWrapper, enrichOllamaModelsWithContext, ensureOllamaModelPulled, fetchOllamaModels, isOllamaCompatProvider, isReasoningModelHeuristic, promptAndConfigureOllama, queryOllamaContextWindow, queryOllamaModelShowInfo, resolveOllamaApiBase, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };

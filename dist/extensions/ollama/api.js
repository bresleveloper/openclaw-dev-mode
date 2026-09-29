import { r as createLazyRuntimeModule } from "../../lazy-runtime-BPNHa36e.mjs";
import { c as OLLAMA_DEFAULT_COST, g as resolveOllamaSetupDefaultBaseUrl, l as OLLAMA_DEFAULT_MAX_TOKENS, o as OLLAMA_DEFAULT_BASE_URL, s as OLLAMA_DEFAULT_CONTEXT_WINDOW, u as OLLAMA_DEFAULT_MODEL } from "../../defaults-Dkg1KktH.mjs";
import { _ as queryOllamaModelShowInfo, c as enrichOllamaModelsWithContext, g as queryOllamaContextWindow, i as buildOllamaProvider, m as isReasoningModelHeuristic, r as buildOllamaModelDefinition, u as fetchOllamaModels, y as resolveOllamaApiBase } from "../../provider-models-CxPgc7Wt.mjs";
import { c as shouldInjectOllamaCompatNumCtx, i as resolveOllamaCompatNumCtxEnabled, n as isOllamaCompatProvider, t as createConfiguredOllamaCompatStreamWrapper, u as wrapOllamaCompatNumCtx } from "../../stream-compat-BLFheAUa.mjs";
import { r as buildOllamaChatRequest } from "../../stream-api-C9KWxWWO.mjs";
//#region extensions/ollama/src/setup.ts
const loadOllamaSetupRuntime = createLazyRuntimeModule(() => import("../../setup.runtime-ygcUGjZy.mjs"));
const promptAndConfigureOllama = async (...args) => await (await loadOllamaSetupRuntime()).promptAndConfigureOllama(...args);
const configureOllamaNonInteractive = async (...args) => await (await loadOllamaSetupRuntime()).configureOllamaNonInteractive(...args);
const ensureOllamaModelPulled = async (...args) => await (await loadOllamaSetupRuntime()).ensureOllamaModelPulled(...args);
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MAX_TOKENS, OLLAMA_DEFAULT_MODEL, buildOllamaChatRequest, buildOllamaModelDefinition, buildOllamaProvider, configureOllamaNonInteractive, createConfiguredOllamaCompatStreamWrapper, enrichOllamaModelsWithContext, ensureOllamaModelPulled, fetchOllamaModels, isOllamaCompatProvider, isReasoningModelHeuristic, promptAndConfigureOllama, queryOllamaContextWindow, queryOllamaModelShowInfo, resolveOllamaApiBase, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };

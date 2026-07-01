import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { i as getRuntimeConfig, k as projectConfigOntoRuntimeSourceSnapshot } from "./io-BJfjPmGW.js";
import "./config-A41fTHlt.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import "./model-selection-i8V2iTdL.js";
import { t as computeBackoff } from "./backoff-DPz-g2bN.js";
import { a as resolveContextTokensForModelFromCache, c as MODEL_CONTEXT_WINDOW_CACHE, d as minPositiveContextTokens, f as providerContextTokenCacheKey, i as resolveAnthropicFixedContextWindow, l as lookupCachedContextTokens, o as MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE, s as MODEL_CONTEXT_TOKEN_CACHE, u as lookupCachedContextWindow } from "./context-resolution-BbxgfsS4.js";
//#region src/agents/context-runtime-state.ts
const CONTEXT_WINDOW_RUNTIME_STATE_KEY = Symbol.for("openclaw.contextWindowRuntimeState");
/** Shared mutable state for context-window resolution and model discovery. */
const CONTEXT_WINDOW_RUNTIME_STATE = (() => {
	const globalState = globalThis;
	let state = globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY];
	if (!state) {
		state = {
			generation: 0,
			loadPromise: null,
			loadGeneration: null,
			configuredConfig: void 0,
			configLoadFailures: 0,
			nextConfigLoadAttemptAtMs: 0,
			modelsConfigRuntimeLoader: createLazyImportLoader(() => import("./agents/models-config.runtime.js"))
		};
		globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY] = state;
	} else {
		if (typeof state.generation !== "number") state.generation = 0;
		if (state.loadGeneration === void 0) state.loadGeneration = null;
		state.modelsConfigRuntimeLoader ??= createLazyImportLoader(() => import("./agents/models-config.runtime.js"));
	}
	return state;
})();
/** Invalidate prepared context metadata while a replacement load is staged. */
function beginContextWindowCacheRefresh() {
	CONTEXT_WINDOW_RUNTIME_STATE.generation += 1;
	CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = void 0;
	CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
	CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
}
/** Reset prepared context-window state after model config or plugin metadata changes. */
function resetContextWindowCache() {
	beginContextWindowCacheRefresh();
	CONTEXT_WINDOW_RUNTIME_STATE.modelsConfigRuntimeLoader.clear();
	MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE.clear();
	MODEL_CONTEXT_TOKEN_CACHE.clear();
	MODEL_CONTEXT_WINDOW_CACHE.clear();
}
/** Reset context-window runtime state and token cache for isolated tests. */
function resetContextWindowCacheForTest() {
	resetContextWindowCache();
}
//#endregion
//#region src/agents/context.ts
const CONFIG_LOAD_RETRY_POLICY = {
	initialMs: 1e3,
	maxMs: 6e4,
	factor: 2,
	jitter: 0
};
const loadModelCatalogRuntime = () => import("./agents/model-catalog.runtime.js");
const loadStaticModelCatalogRuntime = () => import("./model.static-catalog-za1sP7Gc.js");
function applyDiscoveredContextWindows(params) {
	const cacheMinimum = (key, contextTokens) => {
		const existing = params.cache.get(key);
		if (existing === void 0 || contextTokens < existing) params.cache.set(key, contextTokens);
	};
	for (const model of params.models) {
		if (!model?.id) continue;
		const discoveredContextTokens = typeof model.contextTokens === "number" ? Math.trunc(model.contextTokens) : typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : void 0;
		const contextTokens = resolveDiscoveredAnthropicFixedContextWindow(model) ?? discoveredContextTokens;
		if (!contextTokens || contextTokens <= 0) continue;
		cacheMinimum(model.id, contextTokens);
		if (typeof model.provider === "string") {
			const provider = normalizeProviderId(model.provider);
			if (provider) {
				cacheMinimum(providerContextTokenCacheKey(provider, model.id), contextTokens);
				const slash = model.id.indexOf("/");
				const prefixedProvider = slash > 0 ? normalizeProviderId(model.id.slice(0, slash)) : "";
				const bareModelId = slash > 0 ? model.id.slice(slash + 1).trim() : "";
				if (prefixedProvider === provider && bareModelId) cacheMinimum(providerContextTokenCacheKey(provider, bareModelId), contextTokens);
			}
		}
	}
}
function applyConfiguredContextWindows(params) {
	const providers = params.modelsConfig?.providers;
	if (!providers || typeof providers !== "object") return;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) {
			const modelId = typeof model?.id === "string" ? model.id : void 0;
			const contextTokens = typeof model?.contextTokens === "number" ? model.contextTokens : typeof provider?.contextTokens === "number" ? provider.contextTokens : void 0;
			const contextWindow = typeof model?.contextWindow === "number" ? model.contextWindow : typeof provider?.contextWindow === "number" ? provider.contextWindow : void 0;
			const configuredValue = contextTokens && contextTokens > 0 ? {
				cache: params.cache,
				value: contextTokens
			} : contextWindow && contextWindow > 0 ? {
				cache: params.windowCache,
				value: contextWindow
			} : void 0;
			if (!modelId || !configuredValue) continue;
			configuredValue.cache.set(modelId, configuredValue.value);
			configuredValue.cache.set(providerContextTokenCacheKey(normalizeProviderId(providerId), modelId), configuredValue.value);
			const normalizedProvider = normalizeProviderId(providerId);
			const slash = modelId.indexOf("/");
			const prefixedProvider = slash > 0 ? normalizeProviderId(modelId.slice(0, slash)) : "";
			const bareModelId = slash > 0 ? modelId.slice(slash + 1).trim() : "";
			if (normalizedProvider && prefixedProvider === normalizedProvider && bareModelId) configuredValue.cache.set(providerContextTokenCacheKey(normalizedProvider, bareModelId), configuredValue.value);
		}
	}
}
function primeConfiguredContextWindowsFromConfig(cfg) {
	applyConfiguredContextWindows({
		cache: MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE,
		windowCache: MODEL_CONTEXT_WINDOW_CACHE,
		modelsConfig: cfg.models
	});
	CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = cfg;
	CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
	CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
	return cfg;
}
function primeConfiguredContextWindows() {
	if (CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig) return primeConfiguredContextWindowsFromConfig(CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig);
	if (Date.now() < CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs) return;
	try {
		return primeConfiguredContextWindowsFromConfig(getRuntimeConfig());
	} catch {
		CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures += 1;
		const backoffMs = computeBackoff(CONFIG_LOAD_RETRY_POLICY, CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures);
		CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = Date.now() + backoffMs;
		return;
	}
}
function ensureContextWindowCacheLoaded() {
	const generation = CONTEXT_WINDOW_RUNTIME_STATE.generation;
	if (CONTEXT_WINDOW_RUNTIME_STATE.loadPromise && CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration === generation) return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
	const cfg = primeConfiguredContextWindows();
	if (!cfg) return Promise.resolve();
	const stagedTokenCache = /* @__PURE__ */ new Map();
	CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = Promise.resolve().then(async () => {
		if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
		try {
			const [{ loadModelCatalog }, { loadBundledProviderStaticCatalogContextModels }] = await Promise.all([loadModelCatalogRuntime(), loadStaticModelCatalogRuntime()]);
			const [modelsResult, providerStaticModelsResult] = await Promise.allSettled([loadModelCatalog({
				config: cfg,
				readOnly: true
			}), loadBundledProviderStaticCatalogContextModels({ cfg })]);
			if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
			const models = modelsResult.status === "fulfilled" ? modelsResult.value : [];
			const providerStaticModels = providerStaticModelsResult.status === "fulfilled" ? providerStaticModelsResult.value : [];
			applyDiscoveredContextWindows({
				cache: stagedTokenCache,
				models: [...models, ...providerStaticModels]
			});
		} catch {}
		if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
		MODEL_CONTEXT_TOKEN_CACHE.clear();
		for (const [key, value] of stagedTokenCache) MODEL_CONTEXT_TOKEN_CACHE.set(key, value);
	}).catch(() => {});
	CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = generation;
	return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
}
/** Replace cached model context metadata for the active runtime configuration. */
async function refreshContextWindowCache(cfg) {
	beginContextWindowCacheRefresh();
	MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE.clear();
	MODEL_CONTEXT_WINDOW_CACHE.clear();
	primeConfiguredContextWindowsFromConfig(cfg);
	await ensureContextWindowCacheLoaded();
}
function prepareContextWindowCache(options) {
	if (options?.skipRuntimeConfigLoad) return;
	if (options?.allowAsyncLoad === false) primeConfiguredContextWindows();
	else ensureContextWindowCacheLoaded();
}
function lookupContextTokens(modelId, options) {
	if (!modelId) return;
	prepareContextWindowCache(options);
	return minPositiveContextTokens(lookupCachedContextTokens(modelId), lookupCachedContextWindow(modelId));
}
function resolveDiscoveredAnthropicFixedContextWindow(model) {
	const provider = typeof model.provider === "string" ? normalizeProviderId(model.provider) : void 0;
	const modelId = model.id;
	if (provider) return resolveAnthropicFixedContextWindow(provider, modelId);
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	const slash = normalized.indexOf("/");
	if (slash < 0) return;
	const inferredProvider = normalizeProviderId(normalized.slice(0, slash));
	const inferredModel = normalized.slice(slash + 1);
	return inferredProvider === "claude-cli" ? resolveAnthropicFixedContextWindow(inferredProvider, inferredModel) : void 0;
}
function resolveContextTokensForModel(params) {
	prepareContextWindowCache({
		allowAsyncLoad: params.allowAsyncLoad,
		skipRuntimeConfigLoad: Boolean(params.cfg)
	});
	const sourceCfg = params.sourceCfg !== void 0 ? params.sourceCfg : params.cfg ? projectConfigOntoRuntimeSourceSnapshot(params.cfg) : void 0;
	return resolveContextTokensForModelFromCache({
		...params,
		sourceCfg
	}, (modelId) => lookupCachedContextTokens(modelId), (modelId) => lookupCachedContextWindow(modelId));
}
//#endregion
export { refreshContextWindowCache as a, lookupContextTokens as i, applyDiscoveredContextWindows as n, resolveContextTokensForModel as o, ensureContextWindowCacheLoaded as r, resetContextWindowCacheForTest as s, applyConfiguredContextWindows as t };

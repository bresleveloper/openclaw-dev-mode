import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import "./backoff-BrzXG7iD.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import "./model-selection-D3_rVb38.mjs";
import { a as resolveModelContextTokenProjectionFromCache, c as getContextWindowCaches, d as minPositiveContextTokens, f as providerContextTokenCacheKey, l as lookupCachedContextTokens, m as replaceDiscoveredContextTokenCache, o as REUSED_CONTEXT_WINDOW_CACHE_STATE, p as replaceContextWindowCaches, s as clearContextWindowCaches, t as resolveAnthropicFixedContextWindow, u as lookupCachedContextWindow } from "./context-resolution-rBaR4T59.mjs";
//#region src/agents/context-cache-projection.ts
const CONTEXT_PROJECTION_BATCH_SIZE = 512;
function cacheMinimum(cache, key, contextTokens) {
	const existing = cache.get(key);
	if (existing === void 0 || contextTokens < existing) cache.set(key, contextTokens);
}
function applyDiscoveredContextWindow(cache, model) {
	if (!model?.id) return;
	const discoveredContextTokens = typeof model.contextTokens === "number" ? Math.trunc(model.contextTokens) : typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : void 0;
	const contextTokens = resolveDiscoveredAnthropicFixedContextWindow(model) ?? discoveredContextTokens;
	if (!contextTokens || contextTokens <= 0) return;
	cacheMinimum(cache, model.id, contextTokens);
	if (typeof model.provider !== "string") return;
	const provider = normalizeProviderId(model.provider);
	if (!provider) return;
	cacheMinimum(cache, providerContextTokenCacheKey(provider, model.id), contextTokens);
	const slash = model.id.indexOf("/");
	const prefixedProvider = slash > 0 ? normalizeProviderId(model.id.slice(0, slash)) : "";
	const bareModelId = slash > 0 ? model.id.slice(slash + 1).trim() : "";
	if (prefixedProvider === provider && bareModelId) cacheMinimum(cache, providerContextTokenCacheKey(provider, bareModelId), contextTokens);
}
function applyDiscoveredContextWindows(params) {
	for (const model of params.models) applyDiscoveredContextWindow(params.cache, model);
}
function applyConfiguredContextWindows(params) {
	const providers = params.modelsConfig?.providers;
	if (!providers || typeof providers !== "object") return;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) applyConfiguredContextWindow({
			cache: params.cache,
			windowCache: params.windowCache,
			providerId,
			model
		});
	}
}
function applyConfiguredContextWindow(params) {
	const modelId = typeof params.model?.id === "string" ? params.model.id : void 0;
	const contextTokens = typeof params.model?.contextTokens === "number" ? params.model.contextTokens : void 0;
	const contextWindow = typeof params.model?.contextWindow === "number" ? params.model.contextWindow : void 0;
	const configuredValue = contextTokens && contextTokens > 0 ? {
		cache: params.cache,
		value: contextTokens
	} : contextWindow && contextWindow > 0 ? {
		cache: params.windowCache,
		value: contextWindow
	} : void 0;
	if (!modelId || !configuredValue) return;
	const provider = normalizeProviderId(params.providerId);
	configuredValue.cache.set(modelId, configuredValue.value);
	configuredValue.cache.set(providerContextTokenCacheKey(provider, modelId), configuredValue.value);
	const slash = modelId.indexOf("/");
	const prefixedProvider = slash > 0 ? normalizeProviderId(modelId.slice(0, slash)) : "";
	const bareModelId = slash > 0 ? modelId.slice(slash + 1).trim() : "";
	if (provider && prefixedProvider === provider && bareModelId) configuredValue.cache.set(providerContextTokenCacheKey(provider, bareModelId), configuredValue.value);
}
function resolveDiscoveredAnthropicFixedContextWindow(model) {
	const provider = typeof model.provider === "string" ? normalizeProviderId(model.provider) : void 0;
	if (provider) return resolveAnthropicFixedContextWindow(provider, model.id);
	const normalized = normalizeLowercaseStringOrEmpty(model.id);
	const slash = normalized.indexOf("/");
	if (slash < 0) return;
	const inferredProvider = normalizeProviderId(normalized.slice(0, slash));
	const inferredModel = normalized.slice(slash + 1);
	return inferredProvider === "claude-cli" ? resolveAnthropicFixedContextWindow(inferredProvider, inferredModel) : void 0;
}
function yieldToGateway() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
async function projectModels(params) {
	let processed = params.processed;
	for (const models of [params.modelCatalog.entries, params.modelCatalog.staticEntries ?? []]) for (const model of models) {
		applyDiscoveredContextWindow(params.cache, model);
		processed += 1;
		if (processed % CONTEXT_PROJECTION_BATCH_SIZE === 0) {
			await yieldToGateway();
			params.assertCurrent?.();
		}
	}
}
async function prepareContextWindowCaches(params) {
	const caches = {
		configuredTokenCache: /* @__PURE__ */ new Map(),
		discoveredTokenCache: /* @__PURE__ */ new Map(),
		contextWindowCache: /* @__PURE__ */ new Map()
	};
	let processed = 0;
	const providers = params.config.models?.providers;
	if (providers && typeof providers === "object") for (const [providerId, provider] of Object.entries(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) {
			applyConfiguredContextWindow({
				cache: caches.configuredTokenCache,
				windowCache: caches.contextWindowCache,
				providerId,
				model
			});
			processed += 1;
			if (processed % CONTEXT_PROJECTION_BATCH_SIZE === 0) {
				await yieldToGateway();
				params.assertCurrent?.();
			}
		}
	}
	await projectModels({
		cache: caches.discoveredTokenCache,
		modelCatalog: params.modelCatalog,
		processed,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	return caches;
}
async function prepareDiscoveredContextTokenCache(params) {
	const cache = /* @__PURE__ */ new Map();
	await projectModels({
		cache,
		modelCatalog: params.modelCatalog,
		processed: 0,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	return cache;
}
//#endregion
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
			nextConfigLoadAttemptAtMs: 0
		};
		globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY] = state;
	} else if (!REUSED_CONTEXT_WINDOW_CACHE_STATE) {
		state.loadPromise = null;
		state.loadGeneration = null;
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
/** Reset context-window runtime state and token cache for isolated tests. */
function resetContextWindowCacheForTest() {
	beginContextWindowCacheRefresh();
	clearContextWindowCaches();
}
//#endregion
//#region src/agents/context.ts
const CONFIG_LOAD_RETRY_POLICY = {
	initialMs: 1e3,
	maxMs: 6e4,
	factor: 2,
	jitter: 0
};
const loadPreparedModelCatalogRuntime = () => import("./prepared-model-catalog-CdRVgew8.mjs");
function primeConfiguredContextWindowsFromConfig(cfg) {
	const caches = getContextWindowCaches();
	applyConfiguredContextWindows({
		cache: caches.configuredTokenCache,
		windowCache: caches.contextWindowCache,
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
function ensureContextWindowCacheLoaded(cfgOverride) {
	const generation = CONTEXT_WINDOW_RUNTIME_STATE.generation;
	if (CONTEXT_WINDOW_RUNTIME_STATE.loadPromise && CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration === generation) return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
	const cfg = cfgOverride ? primeConfiguredContextWindowsFromConfig(cfgOverride) : primeConfiguredContextWindows();
	if (!cfg) return Promise.resolve();
	CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = Promise.resolve().then(async () => {
		if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
		let stagedTokenCache = /* @__PURE__ */ new Map();
		try {
			const { loadPreparedModelCatalogOwnerSnapshot } = await loadPreparedModelCatalogRuntime();
			const owner = await loadPreparedModelCatalogOwnerSnapshot({
				config: cfg,
				readOnly: true
			});
			if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
			stagedTokenCache = await prepareDiscoveredContextTokenCache({
				modelCatalog: owner.modelCatalog,
				assertCurrent: () => {
					if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) throw new Error("context window cache generation was superseded");
				}
			});
		} catch {}
		if (CONTEXT_WINDOW_RUNTIME_STATE.generation === generation) replaceDiscoveredContextTokenCache(stagedTokenCache);
	}).catch(() => {});
	CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = generation;
	return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
}
/**
* Reuse the Gateway's published catalog generation. Omitting the Gateway binding
* falls through to a read-only owner whose key hashes the full model config.
*/
async function prewarmContextWindowCacheAfterReady(params) {
	beginContextWindowCacheRefresh();
	const generation = CONTEXT_WINDOW_RUNTIME_STATE.generation;
	const shouldStop = () => CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation || params.isCancelled?.() === true;
	if (shouldStop()) return;
	let published = false;
	const loadPromise = (async () => {
		const { getPublishedPreparedModelCatalogOwnerSnapshot } = await loadPreparedModelCatalogRuntime();
		if (shouldStop()) return;
		const owner = getPublishedPreparedModelCatalogOwnerSnapshot({
			config: params.config,
			allowGatewaySubagentBinding: true
		});
		if (!owner) throw new Error("published Gateway model catalog owner is unavailable");
		if (shouldStop()) return;
		const caches = await prepareContextWindowCaches({
			config: owner.config,
			modelCatalog: owner.modelCatalog,
			assertCurrent: () => {
				if (shouldStop()) throw new Error("context window cache prewarm cancelled");
			}
		});
		if (shouldStop()) return;
		replaceContextWindowCaches(caches);
		CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = owner.config;
		CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
		CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
		published = true;
	})();
	const trackedLoadPromise = loadPromise.catch(() => {});
	CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = trackedLoadPromise;
	CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = generation;
	try {
		await loadPromise;
	} catch {} finally {
		if (!published && CONTEXT_WINDOW_RUNTIME_STATE.generation === generation && CONTEXT_WINDOW_RUNTIME_STATE.loadPromise === trackedLoadPromise) {
			CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = null;
			CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = null;
		}
	}
}
async function waitForContextWindowCacheLoad(options) {
	const promise = CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
	if (!promise || CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration !== CONTEXT_WINDOW_RUNTIME_STATE.generation) return "idle";
	const timeoutMs = Math.max(0, Math.trunc(options?.timeoutMs ?? 250));
	if (timeoutMs === 0) return "timeout";
	return await settlesWithin(promise, timeoutMs) ? "loaded" : "timeout";
}
/** Restore configured context limits without acquiring a model catalog. */
function resetContextWindowCache(cfg) {
	beginContextWindowCacheRefresh();
	const caches = getContextWindowCaches();
	caches.configuredTokenCache.clear();
	caches.contextWindowCache.clear();
	primeConfiguredContextWindowsFromConfig(cfg);
}
/** Replace cached model context metadata for the active runtime configuration. */
async function refreshContextWindowCache(cfg) {
	resetContextWindowCache(cfg);
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
function resolveContextTokensForModel(params) {
	return resolveModelContextTokenProjection(params).contextTokens;
}
function resolveModelContextTokenProjection(params) {
	prepareContextWindowCache({
		allowAsyncLoad: params.allowAsyncLoad,
		skipRuntimeConfigLoad: Boolean(params.cfg)
	});
	return resolveModelContextTokenProjectionFromCache(params);
}
//#endregion
export { resetContextWindowCache as a, waitForContextWindowCacheLoad as c, applyDiscoveredContextWindows as d, refreshContextWindowCache as i, resetContextWindowCacheForTest as l, lookupContextTokens as n, resolveContextTokensForModel as o, prewarmContextWindowCacheAfterReady as r, resolveModelContextTokenProjection as s, ensureContextWindowCacheLoaded as t, applyConfiguredContextWindows as u };

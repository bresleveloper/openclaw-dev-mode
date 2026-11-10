import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./backoff-N5Hi0doU.mjs";
import "./config-B3oiWDlr.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { a as resolveModelContextTokenProjectionFromCache, c as replaceContextWindowCaches, l as replaceDiscoveredContextTokenCache, o as getContextWindowCaches, s as providerContextTokenCacheKey, t as resolveAnthropicFixedContextWindow } from "./context-resolution-CKREdq15.mjs";
import { setImmediate } from "node:timers/promises";
//#region src/agents/context-cache-projection.ts
const CONTEXT_PROJECTION_BATCH_SIZE = 512;
function cacheMinimum(cache, key, contextTokens) {
	const existing = cache.get(key);
	if (existing === void 0 || contextTokens < existing) cache.set(key, contextTokens);
}
function contextModelKeys(modelId, provider) {
	const keys = [modelId];
	if (provider === void 0) return keys;
	keys.push(providerContextTokenCacheKey(provider, modelId));
	const slash = modelId.indexOf("/");
	const prefixedProvider = slash > 0 ? normalizeProviderId(modelId.slice(0, slash)) : "";
	const bareModelId = slash > 0 ? modelId.slice(slash + 1).trim() : "";
	if (provider && prefixedProvider === provider && bareModelId) keys.push(providerContextTokenCacheKey(provider, bareModelId));
	return keys;
}
function applyDiscoveredContextWindow(cache, model) {
	if (!model?.id) return;
	const discoveredContextTokens = typeof model.contextTokens === "number" ? Math.trunc(model.contextTokens) : typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : void 0;
	const contextTokens = resolveDiscoveredAnthropicFixedContextWindow(model) ?? discoveredContextTokens;
	if (!contextTokens || contextTokens <= 0) return;
	const provider = typeof model.provider === "string" ? normalizeProviderId(model.provider) : "";
	for (const key of contextModelKeys(model.id, provider || void 0)) cacheMinimum(cache, key, contextTokens);
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
	for (const key of contextModelKeys(modelId, normalizeProviderId(params.providerId))) configuredValue.cache.set(key, configuredValue.value);
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
async function projectModels(params) {
	let processed = params.processed;
	for (const models of [params.modelCatalog.entries, params.modelCatalog.staticEntries ?? []]) for (const model of models) {
		applyDiscoveredContextWindow(params.cache, model);
		processed += 1;
		if (processed % CONTEXT_PROJECTION_BATCH_SIZE === 0) await setImmediate();
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
			if (processed % CONTEXT_PROJECTION_BATCH_SIZE === 0) await setImmediate();
		}
	}
	await projectModels({
		cache: caches.discoveredTokenCache,
		modelCatalog: params.modelCatalog,
		processed
	});
	return caches;
}
async function prepareDiscoveredContextTokenCache(params) {
	const cache = /* @__PURE__ */ new Map();
	await projectModels({
		cache,
		modelCatalog: params.modelCatalog,
		processed: 0
	});
	return cache;
}
//#endregion
//#region src/agents/context-runtime-state.ts
const CONTEXT_WINDOW_RUNTIME_STATE_KEY = Symbol.for("openclaw.contextWindowRuntimeState");
const globalState = globalThis;
/** Shared mutable state for context-window resolution and model discovery. */
const CONTEXT_WINDOW_RUNTIME_STATE = globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY] ||= {
	generation: 0,
	loadPromise: null,
	loadGeneration: null,
	configuredConfig: void 0,
	configLoadFailures: 0,
	nextConfigLoadAttemptAtMs: 0
};
/** Invalidate prepared context metadata while a replacement load is staged. */
function beginContextWindowCacheRefresh() {
	CONTEXT_WINDOW_RUNTIME_STATE.generation += 1;
	CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = void 0;
	CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
	CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
}
//#endregion
//#region src/agents/context.ts
const CONFIG_LOAD_RETRY_POLICY = {
	initialMs: 1e3,
	maxMs: 6e4,
	factor: 2,
	jitter: 0
};
const loadPreparedModelCatalogRuntime = () => import("./prepared-model-catalog-CCWmZ0HZ.mjs");
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
		return primeConfiguredContextWindowsFromConfig(readRuntimeConfig());
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
		let stagedTokenCache = /* @__PURE__ */ new Map();
		try {
			const { loadPreparedModelCatalogOwnerSnapshot } = await loadPreparedModelCatalogRuntime();
			stagedTokenCache = await prepareDiscoveredContextTokenCache({ modelCatalog: (await loadPreparedModelCatalogOwnerSnapshot({
				config: cfg,
				readOnly: true
			})).modelCatalog });
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
		const owner = getPublishedPreparedModelCatalogOwnerSnapshot({
			config: params.config,
			allowGatewaySubagentBinding: true
		});
		if (!owner) throw new Error("published Gateway model catalog owner is unavailable");
		const caches = await prepareContextWindowCaches({
			config: owner.config,
			modelCatalog: owner.modelCatalog
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
function resolveContextTokensForModel(params) {
	return resolveModelContextTokenProjection(params).contextTokens;
}
function resolveModelContextTokenProjection(params) {
	prepareContextWindowCache({
		allowAsyncLoad: params.allowAsyncLoad,
		skipRuntimeConfigLoad: Boolean(params.cfg) || params.allowCacheLookup === false
	});
	return resolveModelContextTokenProjectionFromCache(params);
}
//#endregion
export { resolveContextTokensForModel as a, resetContextWindowCache as i, prewarmContextWindowCacheAfterReady as n, resolveModelContextTokenProjection as o, refreshContextWindowCache as r, ensureContextWindowCacheLoaded as t };

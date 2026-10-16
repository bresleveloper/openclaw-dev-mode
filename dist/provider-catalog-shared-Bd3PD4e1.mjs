import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import "./model-catalog-normalize-Dxe_x7wi.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-KBg0y299.mjs";
import { i as resolveProviderRequestCapabilities } from "./provider-attribution-DCsKu1Yv.mjs";
import "./provider-catalog-Io9OWhUB.mjs";
import { n as recordLiveCatalogExpiry } from "./provider-catalog-expiry-BajE8fJo.mjs";
import { createHash } from "node:crypto";
import { addAbortListener } from "node:events";
//#region src/plugin-sdk/provider-catalog-shared.ts
const liveCatalogCache = /* @__PURE__ */ new Map();
async function consumeLiveCatalog(entry, signal) {
	signal?.throwIfAborted();
	entry.controller.signal.throwIfAborted();
	entry.consumers += 1;
	const pending = signal && !entry.settled ? createDeferredCore() : void 0;
	if (pending) (entry.waiters ??= /* @__PURE__ */ new Set()).add(pending);
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		if (pending) entry.waiters?.delete(pending);
		entry.consumers -= 1;
		if (!entry.settled && entry.consumers === 0) entry.controller.abort(signal?.reason);
	};
	let listener;
	try {
		if (signal && pending) listener = addAbortListener(signal, () => {
			release();
			pending.reject(signal.reason);
		});
		const value = await (pending?.promise ?? entry.value);
		if (entry.retained) recordLiveCatalogExpiry(entry.expiresAt);
		return value;
	} finally {
		listener?.[Symbol.dispose]();
		release();
	}
}
function buildLiveCatalogCacheKey(parts) {
	return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}
/**
* Shares pending loads and caches successful values for a short TTL after completion.
*/
async function getCachedLiveCatalogValue(params) {
	params.signal?.throwIfAborted();
	const rawNow = params.now?.() ?? Date.now();
	const ttlMs = params.ttlMs ?? 3e4;
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (expiresAt === void 0) return await params.load(params.signal);
	const key = buildLiveCatalogCacheKey(params.keyParts);
	const existing = liveCatalogCache.get(key);
	if (existing) {
		if (!existing.controller.signal.aborted && isFutureDateTimestampMs(existing.expiresAt, { nowMs: rawNow })) return await consumeLiveCatalog(existing, params.signal);
		liveCatalogCache.delete(key);
	}
	const completion = createDeferredCore();
	completion.promise.catch(() => void 0);
	const entry = {
		expiresAt,
		controller: new AbortController(),
		consumers: 0,
		settled: false,
		retained: false,
		value: completion.promise
	};
	pruneMapToMaxSize(liveCatalogCache, 99);
	liveCatalogCache.set(key, entry);
	const consumed = consumeLiveCatalog(entry, params.signal);
	(async () => {
		let retain = false;
		try {
			entry.controller.signal.throwIfAborted();
			const resolved = await params.load(entry.controller.signal);
			retain = !entry.controller.signal.aborted && (params.shouldCache?.(resolved) ?? true);
			if (retain) {
				const completedExpiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: params.now?.() ?? Date.now() });
				retain = completedExpiresAt !== void 0;
				if (completedExpiresAt !== void 0) entry.expiresAt = completedExpiresAt;
			}
			completion.resolve(resolved);
			for (const waiter of entry.waiters ?? []) waiter.resolve(resolved);
		} catch (error) {
			completion.reject(error);
			for (const waiter of entry.waiters ?? []) waiter.reject(error);
		} finally {
			entry.waiters = void 0;
			entry.retained = retain;
			entry.settled = true;
			if (!retain && liveCatalogCache.get(key) === entry) liveCatalogCache.delete(key);
		}
	})();
	return await consumed;
}
/**
* Clears the process-local live catalog cache for tests and isolated plugin probes.
*/
function clearLiveCatalogCacheForTests() {
	liveCatalogCache.clear();
}
function normalizeConfiguredCatalogModelInput(input) {
	if (!Array.isArray(input)) return;
	const normalized = input.filter((item) => item === "text" || item === "image" || item === "audio" || item === "video" || item === "document");
	return normalized.length > 0 ? normalized : void 0;
}
function resolveConfiguredProviderModels(config, providerId) {
	const providers = config?.models?.providers;
	if (!providers || typeof providers !== "object") return [];
	const providerKey = findNormalizedProviderKey(providers, providerId);
	if (!providerKey) return [];
	const providerConfig = providers[providerKey];
	if (!providerConfig || typeof providerConfig !== "object") return [];
	return Array.isArray(providerConfig.models) ? providerConfig.models : [];
}
/**
* Reads user-configured provider models as catalog entries for plugin discovery output.
*/
function readConfiguredProviderCatalogEntries(params) {
	const provider = params.publishedProviderId ?? params.providerId;
	const models = resolveConfiguredProviderModels(params.config, params.providerId);
	const entries = [];
	for (const model of models) {
		if (!model || typeof model !== "object") continue;
		const id = typeof model.id === "string" ? model.id.trim() : "";
		if (!id) continue;
		const normalizedId = normalizeConfiguredProviderCatalogModelId(provider, id);
		const name = (typeof model.name === "string" ? model.name : normalizedId).trim() || normalizedId;
		const contextWindow = typeof model.contextWindow === "number" && model.contextWindow > 0 ? model.contextWindow : void 0;
		const reasoning = typeof model.reasoning === "boolean" ? model.reasoning : void 0;
		const input = normalizeConfiguredCatalogModelInput(model.input);
		entries.push({
			provider,
			id: normalizedId,
			name,
			...contextWindow ? { contextWindow } : {},
			...reasoning !== void 0 ? { reasoning } : {},
			...input ? { input } : {}
		});
	}
	return entries;
}
function withStreamingUsageCompat(provider) {
	if (!Array.isArray(provider.models) || provider.models.length === 0) return provider;
	let changed = false;
	const models = provider.models.map((model) => {
		if (model.compat?.supportsUsageInStreaming !== void 0) return model;
		changed = true;
		return {
			...model,
			compat: {
				...model.compat,
				supportsUsageInStreaming: true
			}
		};
	});
	return changed ? {
		...provider,
		models
	} : provider;
}
/**
* Returns whether a provider transport can report native usage while streaming.
*/
function supportsNativeStreamingUsageCompat(params) {
	return resolveProviderRequestCapabilities({
		provider: params.providerId,
		api: "openai-completions",
		baseUrl: params.baseUrl,
		capability: "llm",
		transport: "stream"
	}).supportsNativeStreamingUsageCompat;
}
/**
* Marks models as streaming-usage compatible when provider transport capabilities allow it.
*/
function applyProviderNativeStreamingUsageCompat(params) {
	return supportsNativeStreamingUsageCompat({
		providerId: params.providerId,
		baseUrl: params.providerConfig.baseUrl
	}) ? withStreamingUsageCompat(params.providerConfig) : params.providerConfig;
}
//#endregion
export { supportsNativeStreamingUsageCompat as a, readConfiguredProviderCatalogEntries as i, clearLiveCatalogCacheForTests as n, getCachedLiveCatalogValue as r, applyProviderNativeStreamingUsageCompat as t };

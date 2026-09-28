import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-DCtsDflE.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import "./model-catalog-normalize-B4Klvr97.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-DUtJJsHV.mjs";
import "./provider-catalog-DaDnKUnq.mjs";
import { n as recordLiveCatalogExpiry } from "./provider-catalog-expiry-D85fDr1r.mjs";
import { createHash } from "node:crypto";
//#region src/plugin-sdk/provider-catalog-shared.ts
const liveCatalogCache = /* @__PURE__ */ new Map();
function buildLiveCatalogCacheKey(parts) {
	return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}
/**
* Shares pending loads and caches successful values for a short TTL after completion.
*/
async function getCachedLiveCatalogValue(params) {
	const rawNow = params.now?.() ?? Date.now();
	const ttlMs = params.ttlMs ?? 3e4;
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (expiresAt === void 0) return await params.load();
	const key = buildLiveCatalogCacheKey(params.keyParts);
	const existing = liveCatalogCache.get(key);
	if (existing) {
		if (isFutureDateTimestampMs(existing.expiresAt, { nowMs: rawNow })) {
			const value = await existing.value;
			recordLiveCatalogExpiry(existing.expiresAt);
			return value;
		}
		liveCatalogCache.delete(key);
	}
	const entry = {
		expiresAt,
		value: params.load()
	};
	pruneMapToMaxSize(liveCatalogCache, 99);
	liveCatalogCache.set(key, entry);
	let retain = false;
	try {
		const resolved = await entry.value;
		retain = params.shouldCache?.(resolved) ?? true;
		if (retain) {
			const completedExpiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: params.now?.() ?? Date.now() });
			if (completedExpiresAt === void 0) retain = false;
			else {
				entry.expiresAt = completedExpiresAt;
				recordLiveCatalogExpiry(completedExpiresAt);
			}
		}
		return resolved;
	} finally {
		if (!retain && liveCatalogCache.get(key) === entry) liveCatalogCache.delete(key);
	}
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

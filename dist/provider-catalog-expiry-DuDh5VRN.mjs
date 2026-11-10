import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/provider-catalog-expiry.ts
const capture = resolveGlobalSingleton(Symbol.for("openclaw.providerCatalogExpiryCapture"), () => new AsyncLocalStorage());
/** Carry the existing acquisition budget without adding provider configuration. */
async function withProviderCatalogDiscoveryBudget(timeoutMs, load) {
	const parent = capture.getStore();
	const current = {
		...parent ?? {
			providers: /* @__PURE__ */ new Map(),
			models: /* @__PURE__ */ new Map()
		},
		discoveryBudget: {
			timeoutMs: timeoutMs === null ? parent?.discoveryBudget?.timeoutMs ?? null : Math.min(timeoutMs, parent?.discoveryBudget?.timeoutMs ?? Infinity),
			deadlineMs: Math.min(timeoutMs === null ? Infinity : performance.now() + timeoutMs, parent?.discoveryBudget?.deadlineMs ?? Infinity)
		}
	};
	const value = await capture.run(current, load);
	if (parent && current.expiresAt !== void 0) parent.expiresAt = Math.min(parent.expiresAt ?? Infinity, current.expiresAt);
	return value;
}
/** Stable budget identity is separate from the time remaining on this acquisition. */
function getProviderCatalogDiscoveryBudget() {
	return capture.getStore()?.discoveryBudget;
}
async function captureProviderCatalogExpiries(load, options = {}) {
	const providers = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const refreshKeys = options.refresh ? /* @__PURE__ */ new Set() : void 0;
	return {
		value: await capture.run({
			providers,
			models,
			refreshKeys,
			discoveryBudget: capture.getStore()?.discoveryBudget
		}, load),
		providerExpiries: providers,
		providerModels: models
	};
}
async function withProviderCatalogExpiry(load, providerIds) {
	const parent = capture.getStore();
	if (!parent) return load();
	const current = {
		providers: parent.providers,
		models: parent.models,
		refreshKeys: parent.refreshKeys,
		discoveryBudget: parent.discoveryBudget
	};
	const value = await capture.run(current, load);
	if (current.expiresAt !== void 0) for (const provider of providerIds(value)) {
		const previous = parent.providers.get(provider);
		parent.providers.set(provider, Math.min(previous ?? Infinity, current.expiresAt));
	}
	return value;
}
/** Bypass each selected response once, even when sibling hooks share its cache key. */
function consumeLiveCatalogRefresh(key) {
	const keys = capture.getStore()?.refreshKeys;
	if (!keys || keys.has(key)) return false;
	keys.add(key);
	return true;
}
/** Record accepted hook identities, never static fallback or merged configured rows. */
function recordProviderCatalogModels(provider, modelIds) {
	const current = capture.getStore();
	if (!current) return;
	const models = current.models.get(provider) ?? /* @__PURE__ */ new Set();
	for (const id of modelIds) if (id.trim()) models.add(id.trim());
	current.models.set(provider, models);
}
/** Carry the cache's original deadline; a cache hit must not extend inventory freshness. */
function recordLiveCatalogExpiry(expiresAt) {
	const current = capture.getStore();
	if (current) current.expiresAt = Math.min(current.expiresAt ?? Infinity, expiresAt);
}
//#endregion
export { recordProviderCatalogModels as a, recordLiveCatalogExpiry as i, consumeLiveCatalogRefresh as n, withProviderCatalogDiscoveryBudget as o, getProviderCatalogDiscoveryBudget as r, withProviderCatalogExpiry as s, captureProviderCatalogExpiries as t };

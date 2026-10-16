import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/provider-catalog-expiry.ts
const capture = resolveGlobalSingleton(Symbol.for("openclaw.providerCatalogExpiryCapture"), () => new AsyncLocalStorage());
async function captureProviderCatalogExpiries(load) {
	const providers = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	return {
		value: await capture.run({
			providers,
			models
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
		models: parent.models
	};
	const value = await capture.run(current, load);
	if (current.expiresAt !== void 0) for (const provider of providerIds(value)) {
		const previous = parent.providers.get(provider);
		parent.providers.set(provider, Math.min(previous ?? Infinity, current.expiresAt));
	}
	return value;
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
export { withProviderCatalogExpiry as i, recordLiveCatalogExpiry as n, recordProviderCatalogModels as r, captureProviderCatalogExpiries as t };

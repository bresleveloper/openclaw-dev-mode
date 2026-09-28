import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/provider-catalog-expiry.ts
const capture = resolveGlobalSingleton(Symbol.for("openclaw.providerCatalogExpiryCapture"), () => new AsyncLocalStorage());
async function captureProviderCatalogExpiries(load) {
	const providers = /* @__PURE__ */ new Map();
	return {
		value: await capture.run({ providers }, load),
		providerExpiries: providers
	};
}
async function withProviderCatalogExpiry(load, providerIds) {
	const parent = capture.getStore();
	if (!parent) return load();
	const current = { providers: parent.providers };
	const value = await capture.run(current, load);
	if (current.expiresAt !== void 0) for (const provider of providerIds(value)) {
		const previous = parent.providers.get(provider);
		parent.providers.set(provider, Math.min(previous ?? Infinity, current.expiresAt));
	}
	return value;
}
/** Carry the cache's original deadline; a cache hit must not extend inventory freshness. */
function recordLiveCatalogExpiry(expiresAt) {
	const current = capture.getStore();
	if (current) current.expiresAt = Math.min(current.expiresAt ?? Infinity, expiresAt);
}
//#endregion
export { recordLiveCatalogExpiry as n, withProviderCatalogExpiry as r, captureProviderCatalogExpiries as t };

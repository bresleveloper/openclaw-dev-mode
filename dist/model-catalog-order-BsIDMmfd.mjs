import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
//#region src/agents/model-catalog-order.ts
/**
* Provider catalogs declare models strongest-first. Preserve that owner order
* after registry/config merges instead of falling back to alphabetical names.
*/
function assignProviderModelOrder(entries, existingEntries = [], options = {}) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const orderByModel = /* @__PURE__ */ new Map();
	const nextOrderByProvider = /* @__PURE__ */ new Map();
	for (const entry of existingEntries) {
		if (entry.providerOrder === void 0) continue;
		const provider = normalizeProviderId(entry.provider);
		const key = keyOf(entry);
		orderByModel.set(key, entry.providerOrder);
		nextOrderByProvider.set(provider, Math.max(nextOrderByProvider.get(provider) ?? 0, entry.providerOrder + 1));
	}
	return entries.map((entry) => {
		const provider = normalizeProviderId(entry.provider);
		const key = keyOf(entry);
		const existingOrder = orderByModel.get(key);
		if (existingOrder !== void 0) return {
			...entry,
			providerOrder: existingOrder
		};
		if (options.appendUnknown === false) return entry;
		const providerOrder = nextOrderByProvider.get(provider) ?? 0;
		nextOrderByProvider.set(provider, providerOrder + 1);
		orderByModel.set(key, providerOrder);
		return {
			...entry,
			providerOrder
		};
	});
}
function compareModelCatalogEntries(a, b) {
	const providerComparison = normalizeProviderId(a.provider).localeCompare(normalizeProviderId(b.provider));
	if (providerComparison !== 0) return providerComparison;
	return (a.providerOrder ?? Number.MAX_SAFE_INTEGER) - (b.providerOrder ?? Number.MAX_SAFE_INTEGER) || a.id.localeCompare(b.id) || a.name.localeCompare(b.name);
}
//#endregion
export { compareModelCatalogEntries as n, assignProviderModelOrder as t };

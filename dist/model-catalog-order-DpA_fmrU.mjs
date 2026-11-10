import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as getRemoteModelCatalogProviderRecommendations } from "./remote-overlay-ClWDV070.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
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
	return normalizeProviderId(a.provider).localeCompare(normalizeProviderId(b.provider)) || (a.providerOrder ?? Number.MAX_SAFE_INTEGER) - (b.providerOrder ?? Number.MAX_SAFE_INTEGER) || a.id.localeCompare(b.id) || a.name.localeCompare(b.name);
}
/**
* Ranks a row by its provider's hosted-catalog `recommendedModels`, best first.
* Ids the provider no longer serves simply never match a row. Create one per
* synchronous read: identity keys reuse provider policy only for that operation.
*/
function createModelPickerRecommendationRank(config) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const ranksByProvider = /* @__PURE__ */ new Map();
	return (entry) => {
		const provider = normalizeProviderId(entry.provider);
		let ranks = ranksByProvider.get(provider);
		if (!ranks) {
			ranks = /* @__PURE__ */ new Map();
			const recommended = getRemoteModelCatalogProviderRecommendations(config, provider);
			for (const [rank, id] of (recommended ?? []).entries()) {
				const key = keyOf({
					provider,
					id
				});
				if (!ranks.has(key)) ranks.set(key, rank);
			}
			ranksByProvider.set(provider, ranks);
		}
		return ranks.size > 0 ? ranks.get(keyOf(entry)) : void 0;
	};
}
/**
* Picker order: the session's selected row first, then per provider its
* recommended rows in recommendation order, then the provider-owned remainder.
*/
function orderModelCatalogForPicker(entries, selected, recommendationRank) {
	const ordered = entries.map((entry) => ({
		entry,
		rank: recommendationRank?.(entry) ?? Number.MAX_SAFE_INTEGER
	})).toSorted((a, b) => normalizeProviderId(a.entry.provider).localeCompare(normalizeProviderId(b.entry.provider)) || a.rank - b.rank || compareModelCatalogEntries(a.entry, b.entry)).map(({ entry }) => entry);
	if (selected) {
		const keyOf = createModelCatalogIdentityKeyResolver();
		const selectedKey = keyOf({
			provider: selected.provider,
			id: selected.model
		});
		const index = ordered.findIndex((entry) => keyOf(entry) === selectedKey);
		if (index > 0) ordered.unshift(...ordered.splice(index, 1));
	}
	return ordered;
}
//#endregion
export { orderModelCatalogForPicker as i, compareModelCatalogEntries as n, createModelPickerRecommendationRank as r, assignProviderModelOrder as t };

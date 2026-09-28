import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as normalizeConfiguredProviderCatalogModelRef } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { t as createConfiguredProviderCatalogModelIdNormalizer } from "./model-ref-shared-BgRrSHjn.mjs";
import { a as normalizeProviderCatalogModelIdForConfig } from "./model-input-DKxKaZGG.mjs";
import { b as materializeConfiguredProviderModelRows, x as mergeNormalizedProviderModel, y as getProviderModelId } from "./validation-core-DwJVlxTe.mjs";
//#region src/agents/models-config.providers.catalog.ts
/** Materializes authored rows and finalizes catalog rows without credential resolution. */
function normalizeModelCostForCatalog(model) {
	const cost = model.cost;
	if (!cost || [
		"input",
		"output",
		"cacheRead",
		"cacheWrite"
	].every((key) => cost[key] !== void 0)) return model;
	return {
		...model,
		cost: {
			...model.cost,
			input: cost.input ?? 0,
			output: cost.output ?? 0,
			cacheRead: cost.cacheRead ?? 0,
			cacheWrite: cost.cacheWrite ?? 0
		}
	};
}
function normalizeProviderModelsForConfig(providerKey, provider) {
	if (!Array.isArray(provider.models) || provider.models.length === 0) return provider;
	const providerId = normalizeProviderId(providerKey);
	let mutated = false;
	const nextModels = [];
	const seenById = /* @__PURE__ */ new Map();
	for (const model of provider.models) {
		const rawId = getProviderModelId(model);
		const normalizedId = rawId ? normalizeProviderCatalogModelIdForConfig(providerId, normalizeConfiguredProviderCatalogModelRef(rawId)) : rawId;
		const normalizedModel = normalizedId && normalizedId !== rawId ? {
			...model,
			id: normalizedId
		} : model;
		if (normalizedModel !== model) mutated = true;
		const id = getProviderModelId(normalizedModel);
		if (id) {
			const existingIndex = seenById.get(id);
			if (existingIndex !== void 0) {
				mutated = true;
				const existing = nextModels.at(existingIndex);
				if (existing) nextModels[existingIndex] = mergeNormalizedProviderModel(existing, normalizedModel);
				continue;
			}
			seenById.set(id, nextModels.length);
		}
		nextModels.push(normalizedModel);
	}
	for (const [index, model] of nextModels.entries()) {
		const normalized = normalizeModelCostForCatalog(model);
		if (normalized !== model) {
			nextModels[index] = normalized;
			mutated = true;
		}
	}
	return mutated ? {
		...provider,
		models: nextModels
	} : provider;
}
function normalizeProviderModelMap(providers, normalize) {
	if (!providers) return providers;
	let mutated = false;
	const next = {};
	for (const [providerKey, provider] of Object.entries(providers)) {
		const normalized = normalize(providerKey, provider);
		mutated ||= normalized !== provider;
		next[providerKey] = normalized;
	}
	return mutated ? next : providers;
}
/** Resolves authored aliases once, before discovery consumes configured model membership. */
function materializeConfiguredProviderCatalogModels(providers, options = {}) {
	const normalizeModelId = createConfiguredProviderCatalogModelIdNormalizer(options);
	return normalizeProviderModelMap(providers, (providerKey, provider) => materializeConfiguredProviderModelRows(provider, (id) => normalizeModelId(providerKey, id)));
}
/** Finalizes emitted rows without applying authored aliases to their identities. */
function normalizeProviderCatalogModelsForConfig(providers) {
	return normalizeProviderModelMap(providers, normalizeProviderModelsForConfig);
}
//#endregion
export { normalizeProviderCatalogModelsForConfig as n, materializeConfiguredProviderCatalogModels as t };

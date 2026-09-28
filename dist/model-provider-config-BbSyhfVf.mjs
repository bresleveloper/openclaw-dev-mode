import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { s as stripSelfProviderModelPrefix } from "./provider-model-id-normalization-CO2R6uEC.mjs";
//#region src/config/model-provider-config.ts
/** Uses the same authored row for transport materialization and early auth selection. */
function findConfiguredProviderModel(providerConfig, provider, modelId, canonicalizeModelId) {
	return createConfiguredProviderModelResolver(providerConfig, provider, canonicalizeModelId)(modelId);
}
/** Indexes configured model rows after caller-owned model-id normalization. */
function resolveMergedModelProviderModels(params) {
	const models = /* @__PURE__ */ new Map();
	for (const model of params.models ?? []) {
		const modelId = params.normalizeModelId(model.id);
		if (!modelId) continue;
		const existing = models.get(modelId);
		models.set(modelId, existing ? {
			...model,
			...existing
		} : model);
	}
	return models;
}
function createConfiguredProviderModelResolver(providerConfig, provider, canonicalizeModelId) {
	const canonicalize = (id) => stripSelfProviderModelPrefix(provider, id) !== id ? id : canonicalizeModelId?.(id).trim() || id;
	let configuredModels;
	return (modelId) => {
		const id = modelId.trim();
		if (!configuredModels) {
			const exactRows = resolveMergedModelProviderModels({
				models: providerConfig?.models,
				normalizeModelId: (candidate) => candidate.trim()
			});
			configuredModels = /* @__PURE__ */ new Map();
			for (const [candidate, row] of exactRows) {
				const canonical = canonicalize(candidate);
				if (!configuredModels.has(canonical)) configuredModels.set(canonical, row);
			}
			for (const [candidate, row] of exactRows) configuredModels.set(candidate, row);
		}
		const rows = configuredModels;
		const canonicalId = canonicalize(id);
		const exact = rows.get(id) ?? rows.get(canonicalId);
		if (exact) return exact;
		for (const [candidate, row] of rows) {
			const legacy = stripSelfProviderModelPrefix(provider, candidate);
			if (legacy !== candidate && (legacy === id || canonicalize(legacy.trim()) === canonicalId)) return row;
		}
	};
}
function hasNonEmptyRecord(value) {
	const record = asOptionalRecord(value);
	return record !== void 0 && Object.keys(record).length > 0;
}
function hasRequestCompatOverrides(compat) {
	return Object.entries(compat ?? {}).some(([key, value]) => {
		if (key === "supportsReasoningEffort") return value !== true;
		if (key === "supportedReasoningEfforts") return !(Array.isArray(value) && value.length > 0 && value.every((effort) => typeof effort === "string" && /^(minimal|low|medium|high|xhigh|max|ultra)$/u.test(effort)));
		return true;
	});
}
/** Prepares row lookups within one stable authored config view. */
function createModelProviderRouteOverrideResolver(params) {
	const providerConfig = resolveMergedModelProviderConfig(params.authoredConfig, params.provider);
	if (!providerConfig) return () => "none";
	if (asOptionalRecord(providerConfig.localService) !== void 0 || hasNonEmptyRecord(providerConfig.headers) || hasNonEmptyRecord(providerConfig.request) || hasNonEmptyRecord(providerConfig.params) || typeof providerConfig.authHeader === "boolean" || typeof providerConfig.timeoutSeconds === "number") return () => "present";
	const findModel = createConfiguredProviderModelResolver(providerConfig, params.provider, params.canonicalizeModelId);
	return (modelId) => {
		if (!modelId) return "none";
		const configuredModel = findModel(modelId);
		return configuredModel && (hasNonEmptyRecord(configuredModel.headers) || hasNonEmptyRecord(configuredModel.params) || hasRequestCompatOverrides(configuredModel.compat)) ? "present" : "none";
	};
}
/** Resolves the provider entry produced by models-config key normalization. */
function resolveMergedModelProviderEntry(config, provider) {
	const requestedProvider = provider.trim();
	const normalizedProvider = normalizeProviderId(requestedProvider);
	if (!normalizedProvider) return;
	const providers = Object.entries(config?.models?.providers ?? {});
	const exactKey = providers.find(([providerId]) => providerId.trim() === requestedProvider)?.[0];
	const fallbackKey = providers.find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[0];
	const providerKey = (exactKey ?? fallbackKey)?.trim();
	if (!providerKey) return;
	let matched;
	for (const [providerId, providerConfig] of providers) {
		if (providerId.trim() !== providerKey) continue;
		matched = matched ? {
			...matched,
			...providerConfig,
			models: providerConfig.models ?? matched.models
		} : providerConfig;
	}
	return matched ? {
		providerKey,
		providerConfig: matched
	} : void 0;
}
/** Resolves only the merged provider config when its canonical key is not needed. */
function resolveMergedModelProviderConfig(config, provider) {
	return resolveMergedModelProviderEntry(config, provider)?.providerConfig;
}
/** Projects a resolved request onto one transient canonical provider entry. */
function projectModelProviderConfig(config, providerId, overrides) {
	const provider = normalizeProviderId(providerId);
	const entry = resolveMergedModelProviderEntry(config, provider);
	const providerKey = entry?.providerKey ?? provider;
	const providers = Object.fromEntries(Object.entries(config?.models?.providers ?? {}).filter(([candidate]) => normalizeProviderId(candidate) !== provider || candidate === providerKey));
	return {
		...config,
		models: {
			...config?.models,
			providers: {
				...providers,
				[providerKey]: {
					...entry?.providerConfig ?? { models: [] },
					...overrides
				}
			}
		}
	};
}
//#endregion
export { resolveMergedModelProviderConfig as a, projectModelProviderConfig as i, createModelProviderRouteOverrideResolver as n, resolveMergedModelProviderEntry as o, findConfiguredProviderModel as r, resolveMergedModelProviderModels as s, createConfiguredProviderModelResolver as t };

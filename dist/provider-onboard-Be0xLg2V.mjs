import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { _ as resolvePrimaryStringValue } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeConfiguredProviderCatalogModelId, c as resolveStaticAllowlistModelKey } from "./model-ref-shared-BgRrSHjn.mjs";
import "./defaults-BbU4k6fu.mjs";
import { n as normalizeAgentModelMapForConfig, r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
//#region src/agents/model-allowlist-entry.ts
/** Ensures a static per-model config entry exists in agent defaults. */
function ensureStaticModelAllowlistEntry(params) {
	const rawModelRef = params.modelRef.trim();
	if (!rawModelRef) return params.cfg;
	const models = { ...params.cfg.agents?.defaults?.models };
	const keySet = /* @__PURE__ */ new Set([rawModelRef]);
	const canonicalKey = resolveStaticAllowlistModelKey(rawModelRef, params.defaultProvider ?? "openai");
	if (canonicalKey) keySet.add(canonicalKey);
	for (const key of keySet) models[key] = { ...models[key] };
	return {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			defaults: {
				...params.cfg.agents?.defaults,
				models
			}
		}
	};
}
//#endregion
//#region src/plugin-sdk/provider-onboard.ts
const LEGACY_OPENCODE_ZEN_DEFAULT_MODELS = /* @__PURE__ */ new Set(["opencode/claude-opus-4-5", "opencode-zen/claude-opus-4-5"]);
/** Current OpenCode Zen default model ref used by onboarding and repair flows. */
const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-5";
function resolvePresetModels(models) {
	return typeof models === "function" ? models() : models;
}
function resolveConnectionModels(cfg, models) {
	return cfg.models?.mode === "replace" ? structuredClone(resolvePresetModels(models)) : [];
}
function extractAgentDefaultModelFallbacks(model) {
	if (!model || typeof model !== "object") return;
	if (!("fallbacks" in model)) return;
	const fallbacks = model.fallbacks;
	return Array.isArray(fallbacks) ? fallbacks.map((value) => String(value)) : void 0;
}
function completeProviderPreset(cfg, next, primaryModelRef) {
	return primaryModelRef && resolvePrimaryStringValue(cfg.agents?.defaults?.model) === void 0 ? applyAgentDefaultModelPrimary(next, primaryModelRef) : next;
}
function normalizeAgentModelAliasEntry(entry) {
	if (typeof entry === "string") return { modelRef: entry };
	return entry;
}
function normalizeProviderModelForConfig(providerId, model) {
	const id = normalizeConfiguredProviderCatalogModelId(providerId, model.id);
	return id === model.id ? model : {
		...model,
		id
	};
}
function normalizeProviderModelsForConfig(providerId, models) {
	let mutated = false;
	const next = [];
	const seenById = /* @__PURE__ */ new Map();
	for (const model of models) {
		const normalized = normalizeProviderModelForConfig(providerId, model);
		if (normalized !== model) mutated = true;
		const existingIndex = seenById.get(normalized.id);
		if (existingIndex !== void 0) {
			mutated = true;
			next[existingIndex] = {
				...normalized,
				...next[existingIndex]
			};
			continue;
		}
		seenById.set(normalized.id, next.length);
		next.push(normalized);
	}
	return mutated ? next : models;
}
function normalizeModelProvidersForConfig(providers) {
	if (!providers) return providers;
	let mutated = false;
	const nextProviders = {};
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		const models = Array.isArray(providerConfig.models) ? normalizeProviderModelsForConfig(providerId, providerConfig.models) : providerConfig.models;
		if (models !== providerConfig.models) {
			mutated = true;
			nextProviders[providerId] = {
				...providerConfig,
				models
			};
			continue;
		}
		nextProviders[providerId] = providerConfig;
	}
	return mutated ? nextProviders : providers;
}
function resolveProviderModelMergeState(cfg, providerId) {
	const providers = { ...cfg.models?.providers };
	const existingProviderKey = Object.hasOwn(providers, providerId) ? providerId : findNormalizedProviderKey(providers, providerId);
	const existingProvider = existingProviderKey !== void 0 ? providers[existingProviderKey] : void 0;
	const existingModels = Array.isArray(existingProvider?.models) ? normalizeProviderModelsForConfig(providerId, existingProvider.models) : [];
	const normalizedProviderId = normalizeProviderId(providerId);
	for (const key of Object.keys(providers)) if (key !== providerId && normalizeProviderId(key) === normalizedProviderId) delete providers[key];
	return {
		providers,
		existingProvider: existingProvider ? {
			...existingProvider,
			models: existingModels
		} : existingProvider,
		existingModels
	};
}
function applyProviderConfigWithMergedModels(cfg, params) {
	const mergedModels = normalizeProviderModelsForConfig(params.providerId, params.mergedModels);
	const { apiKey: existingApiKey, ...existingProviderRest } = params.providerState.existingProvider ?? {};
	const normalizedApiKey = typeof existingApiKey === "string" ? existingApiKey.trim() : void 0;
	params.providerState.providers[params.providerId] = {
		...existingProviderRest,
		baseUrl: params.baseUrl,
		api: params.api,
		...normalizedApiKey ? { apiKey: normalizedApiKey } : {},
		models: mergedModels
	};
	return applyOnboardAuthAgentModelsAndProviders(cfg, {
		agentModels: params.agentModels,
		providers: params.providerState.providers
	});
}
function createProviderPresetAppliers(params) {
	return {
		applyProviderConfig(cfg, ...args) {
			const resolved = params.resolveParams(cfg, ...args);
			return resolved ? params.applyPreset(cfg, resolved) : cfg;
		},
		applyConfig(cfg, ...args) {
			const resolved = params.resolveParams(cfg, ...args);
			if (!resolved) return cfg;
			return params.applyPreset(cfg, {
				...resolved,
				primaryModelRef: params.primaryModelRef
			});
		}
	};
}
/** Merge provider alias entries into the agent default model map without clobbering existing aliases. */
function withAgentModelAliases(existing, aliases) {
	const next = normalizeAgentModelMapForConfig({ ...existing });
	for (const entry of aliases) {
		const normalized = normalizeAgentModelAliasEntry(entry);
		const modelRef = normalizeAgentModelRefForConfig(normalized.modelRef);
		next[modelRef] = {
			...next[modelRef],
			...normalized.alias ? { alias: next[modelRef]?.alias ?? normalized.alias } : {}
		};
	}
	return next;
}
/** Build alias-only onboarding appliers without mutating provider catalog config. */
function createAliasOnlyPresetAppliers(params) {
	const applyProviderConfig = (cfg) => {
		const models = { ...cfg.agents?.defaults?.models };
		models[params.modelRef] = {
			...models[params.modelRef],
			alias: models[params.modelRef]?.alias ?? params.alias
		};
		return {
			...cfg,
			agents: {
				...cfg.agents,
				defaults: {
					...cfg.agents?.defaults,
					models
				}
			}
		};
	};
	return {
		applyProviderConfig,
		applyConfig: (cfg) => applyAgentDefaultModelPrimary(applyProviderConfig(cfg), params.modelRef)
	};
}
function isMergeableProviderConfig(value) {
	return isRecord(value);
}
function mergeOnboardProviderRequest(existing, patch) {
	if (!existing) return patch;
	const merged = {
		...existing,
		...patch
	};
	if (!patch || !("auth" in patch)) delete merged.auth;
	if (!patch || !("headers" in patch)) delete merged.headers;
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function mergeOnboardProviderConfigs(existingProviders, patchProviders) {
	const merged = { ...existingProviders };
	for (const [providerId, providerConfig] of Object.entries(patchProviders)) {
		const normalizedProviderId = normalizeProviderId(providerId);
		if (providerId !== (Object.hasOwn(patchProviders, normalizedProviderId) ? normalizedProviderId : findNormalizedProviderKey(patchProviders, providerId))) continue;
		const existingProviderKey = findNormalizedProviderKey(existingProviders ?? {}, providerId);
		const existingProvider = existingProviders?.[providerId] ?? (existingProviderKey ? existingProviders?.[existingProviderKey] : void 0);
		for (const key of Object.keys(existingProviders ?? {})) if (key !== providerId && normalizeProviderId(key) === normalizedProviderId) delete merged[key];
		if (!isMergeableProviderConfig(existingProvider) || !isMergeableProviderConfig(providerConfig)) {
			merged[providerId] = providerConfig;
			continue;
		}
		const nextProvider = {
			...existingProvider,
			...providerConfig
		};
		for (const key of [
			"apiKey",
			"auth",
			"authHeader",
			"headers"
		]) if (!(key in providerConfig)) delete nextProvider[key];
		if (!("request" in providerConfig) || providerConfig.request) {
			const mergedRequest = mergeOnboardProviderRequest(existingProvider.request, providerConfig.request);
			if (mergedRequest) nextProvider.request = mergedRequest;
			else delete nextProvider.request;
		}
		merged[providerId] = nextProvider;
	}
	return merged;
}
/** Write onboarding-auth model aliases and provider configs into the canonical config sections. */
function applyOnboardAuthAgentModelsAndProviders(cfg, params) {
	const mergedAgentModels = normalizeAgentModelMapForConfig({
		...cfg.agents?.defaults?.models,
		...params.agentModels
	});
	const mergedProviders = mergeOnboardProviderConfigs(cfg.models?.providers, params.providers);
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: mergedAgentModels
			}
		},
		models: {
			...cfg.models,
			mode: cfg.models?.mode ?? "merge",
			providers: mergedProviders
		}
	};
}
/** Set the agent default primary model while preserving normalized fallbacks and provider models. */
function applyAgentDefaultModelPrimary(cfg, primary) {
	const defaults = cfg.agents?.defaults;
	const normalizedFallbacks = extractAgentDefaultModelFallbacks(cfg.agents?.defaults?.model)?.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	const normalizedModels = defaults?.models === void 0 ? void 0 : normalizeAgentModelMapForConfig(defaults.models);
	const normalizedProviders = normalizeModelProvidersForConfig(cfg.models?.providers);
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				model: {
					...normalizedFallbacks ? { fallbacks: normalizedFallbacks } : void 0,
					primary: normalizeAgentModelRefForConfig(primary)
				},
				...normalizedModels !== void 0 ? { models: normalizedModels } : void 0
			}
		},
		...normalizedProviders !== void 0 ? { models: {
			...cfg.models,
			providers: normalizedProviders
		} } : void 0
	};
}
/** Move configs without a primary default onto the current OpenCode Zen model. */
function applyOpencodeZenModelDefault(cfg) {
	const current = resolvePrimaryStringValue(cfg.agents?.defaults?.model);
	if ((current && LEGACY_OPENCODE_ZEN_DEFAULT_MODELS.has(current) ? "opencode/claude-opus-5" : current) === "opencode/claude-opus-5") return {
		next: cfg,
		changed: false
	};
	return {
		next: applyAgentDefaultModelPrimary(cfg, OPENCODE_ZEN_DEFAULT_MODEL),
		changed: true
	};
}
/** Merge a provider config and seed required default models when the provider has no matching model yet. */
function applyProviderConfigWithDefaultModels(cfg, params) {
	const providerState = resolveProviderModelMergeState(cfg, params.providerId);
	const defaultModels = params.defaultModels;
	const defaultModelId = params.defaultModelId ?? defaultModels[0]?.id;
	const hasDefaultModel = defaultModelId ? providerState.existingModels.some((model) => model.id === defaultModelId) : true;
	const mergedModels = providerState.existingModels.length > 0 ? hasDefaultModel || defaultModels.length === 0 ? providerState.existingModels : [...providerState.existingModels, ...defaultModels] : defaultModels;
	return applyProviderConfigWithMergedModels(cfg, {
		agentModels: params.agentModels,
		providerId: params.providerId,
		providerState,
		api: params.api,
		baseUrl: params.baseUrl,
		mergedModels
	});
}
/** Single-model wrapper around `applyProviderConfigWithDefaultModels`. */
function applyProviderConfigWithDefaultModel(cfg, params) {
	return applyProviderConfigWithDefaultModels(cfg, {
		agentModels: params.agentModels,
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		defaultModels: [params.defaultModel],
		defaultModelId: params.defaultModelId ?? params.defaultModel.id
	});
}
/** Apply a single-model provider preset and set the primary model only when the user has none. */
function applyProviderConfigWithDefaultModelPreset(cfg, params) {
	return applyProviderConfigWithDefaultModelsPreset(cfg, {
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		defaultModels: [params.defaultModel],
		defaultModelId: params.defaultModelId,
		aliases: params.aliases,
		primaryModelRef: params.primaryModelRef
	});
}
/** Build setup appliers for presets that resolve to one default provider model. */
function createDefaultModelPresetAppliers(params) {
	return createProviderPresetAppliers({
		resolveParams: params.resolveParams,
		applyPreset: applyProviderConfigWithDefaultModelPreset,
		primaryModelRef: params.primaryModelRef
	});
}
/** Apply a multi-model provider preset and set the primary model only when the user has none. */
function applyProviderConfigWithDefaultModelsPreset(cfg, params) {
	return completeProviderPreset(cfg, applyProviderConfigWithDefaultModels(cfg, {
		agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		defaultModels: resolvePresetModels(params.defaultModels),
		defaultModelId: params.defaultModelId
	}), params.primaryModelRef);
}
/** Build setup appliers for presets that resolve to multiple default provider models. */
function createDefaultModelsPresetAppliers(params) {
	return createProviderPresetAppliers({
		resolveParams: params.resolveParams,
		applyPreset: applyProviderConfigWithDefaultModelsPreset,
		primaryModelRef: params.primaryModelRef
	});
}
/** Build connection-only setup appliers while retaining the default-model merge rule in replace mode. */
function createDefaultModelsConnectionPresetAppliers(params) {
	return createProviderPresetAppliers({
		...params,
		applyPreset: (cfg, preset) => applyProviderConfigWithDefaultModelsPreset(cfg, {
			...preset,
			defaultModels: resolveConnectionModels(cfg, preset.defaultModels)
		})
	});
}
/** Merge a provider config with a catalog while preserving existing model entries first. */
function applyProviderConfigWithModelCatalog(cfg, params) {
	const providerState = resolveProviderModelMergeState(cfg, params.providerId);
	const catalogModels = params.catalogModels;
	const mergedModels = providerState.existingModels.length > 0 ? [...providerState.existingModels, ...catalogModels.filter((model) => !providerState.existingModels.some((existing) => existing.id === model.id))] : catalogModels;
	return applyProviderConfigWithMergedModels(cfg, {
		agentModels: params.agentModels,
		providerId: params.providerId,
		providerState,
		api: params.api,
		baseUrl: params.baseUrl,
		mergedModels
	});
}
/** Apply a catalog-backed provider preset and set the primary model only when the user has none. */
function applyProviderConfigWithModelCatalogPreset(cfg, params) {
	return completeProviderPreset(cfg, applyProviderConfigWithModelCatalog(cfg, {
		agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		catalogModels: resolvePresetModels(params.catalogModels)
	}), params.primaryModelRef);
}
/** Build setup appliers for presets that resolve to a provider model catalog. */
function createModelCatalogPresetAppliers(params) {
	return createProviderPresetAppliers({
		resolveParams: params.resolveParams,
		applyPreset: applyProviderConfigWithModelCatalogPreset,
		primaryModelRef: params.primaryModelRef
	});
}
/** Apply connection facts and aliases, seeding the supplied catalog only in explicit replace mode. */
function applyProviderConnectionConfig(cfg, params) {
	return applyProviderConfigWithModelCatalogPreset(cfg, {
		...params,
		catalogModels: resolveConnectionModels(cfg, params.catalogModels)
	});
}
/** Build registered setup appliers without changing the catalog-seeding public helper contract. */
function createProviderConnectionPresetAppliers(params) {
	return createProviderPresetAppliers({
		...params,
		applyPreset: applyProviderConnectionConfig
	});
}
/** Ensure static per-model config includes a provider model ref after onboarding. */
function ensureModelAllowlistEntry(params) {
	return ensureStaticModelAllowlistEntry(params);
}
//#endregion
export { createProviderConnectionPresetAppliers as _, applyProviderConfigWithDefaultModel as a, applyProviderConfigWithDefaultModelsPreset as c, applyProviderConnectionConfig as d, createAliasOnlyPresetAppliers as f, createModelCatalogPresetAppliers as g, createDefaultModelsPresetAppliers as h, applyOpencodeZenModelDefault as i, applyProviderConfigWithModelCatalog as l, createDefaultModelsConnectionPresetAppliers as m, applyAgentDefaultModelPrimary as n, applyProviderConfigWithDefaultModelPreset as o, createDefaultModelPresetAppliers as p, applyOnboardAuthAgentModelsAndProviders as r, applyProviderConfigWithDefaultModels as s, OPENCODE_ZEN_DEFAULT_MODEL as t, applyProviderConfigWithModelCatalogPreset as u, ensureModelAllowlistEntry as v, withAgentModelAliases as y };

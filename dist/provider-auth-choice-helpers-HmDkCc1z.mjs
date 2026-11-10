import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { S as toAgentEntriesRecord } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { _ as normalizeProviderConfigForConfigDefaults } from "./validation-core-ezn1vWYO.mjs";
import { i as normalizeAgentModelSelectionForConfig, n as normalizeAgentModelMapForConfig, r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
//#region src/plugins/provider-auth-choice-helpers.ts
function resolveProviderMatch(providers, rawProvider) {
	const raw = normalizeOptionalString(rawProvider);
	if (!raw) return null;
	const normalized = normalizeProviderId(raw);
	return providers.find((provider) => normalizeProviderId(provider.id) === normalized) ?? providers.find((provider) => provider.aliases?.some((alias) => normalizeProviderId(alias) === normalized) ?? false) ?? null;
}
function pickAuthMethod(provider, rawMethod) {
	const normalized = normalizeOptionalLowercaseString(rawMethod);
	if (!normalized) return null;
	return provider.auth.find((method) => normalizeLowercaseStringOrEmpty(method.id) === normalized) ?? provider.auth.find((method) => normalizeLowercaseStringOrEmpty(method.label) === normalized) ?? null;
}
function mergeConfigPatch(base, patch, merge = true) {
	if (Array.isArray(patch)) return patch.map((entry) => mergeConfigPatch(void 0, entry, false));
	if (!isRecord(patch)) return patch;
	const next = merge && isRecord(base) ? { ...base } : {};
	for (const [key, value] of Object.entries(patch)) {
		if (isBlockedObjectKey(key)) continue;
		if (merge && value === void 0) {
			delete next[key];
			continue;
		}
		next[key] = mergeConfigPatch(next[key], value, merge);
	}
	return next;
}
function normalizeAgentModelConfigForWrite(value) {
	const normalized = normalizeAgentModelSelectionForConfig(value);
	if (!isRecord(normalized)) return normalized;
	return {
		...normalized,
		...Array.isArray(normalized.fallbacks) ? { fallbacks: [...normalized.fallbacks] } : {}
	};
}
function normalizeAgentModelMapForWrite(value) {
	if (!isRecord(value)) return value;
	return normalizeAgentModelMapForConfig(value);
}
function normalizeAgentModelPolicyForWrite(value) {
	if (!isRecord(value) || !Array.isArray(value.allow)) return value;
	return {
		...value,
		allow: value.allow.map((ref) => typeof ref === "string" ? normalizeAgentModelRefForConfig(ref) : ref)
	};
}
function normalizeProviderCatalogModelIdForWrite(provider, modelId) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	return normalizeConfiguredProviderCatalogModelId(normalizeProviderId(provider), trimmed);
}
function normalizeArray(values, normalize) {
	let changed = false;
	const next = values.map((value) => {
		const normalized = normalize(value);
		changed ||= normalized !== value;
		return normalized;
	});
	return changed ? next : values;
}
function normalizeProviderCatalogModelIdsForWrite(provider, providerConfig) {
	const models = providerConfig.models;
	if (!Array.isArray(models) || models.length === 0) return providerConfig;
	const nextModels = normalizeArray(models, (model) => {
		const nextId = normalizeProviderCatalogModelIdForWrite(provider, model.id);
		return nextId === model.id ? model : Object.assign({}, model, { id: nextId });
	});
	return nextModels === models ? providerConfig : {
		...providerConfig,
		models: nextModels
	};
}
function normalizeModelProviderConfigsForWrite(cfg, providerConfigNormalizer) {
	const providers = cfg.models?.providers;
	if (!providers) return cfg;
	let mutated = false;
	const nextProviders = { ...providers };
	for (const [provider, providerConfig] of Object.entries(providers)) {
		const normalizedProviderConfig = normalizeProviderCatalogModelIdsForWrite(provider, providerConfigNormalizer({
			provider,
			providerConfig
		}));
		if (normalizedProviderConfig === providerConfig) continue;
		nextProviders[provider] = normalizedProviderConfig;
		mutated = true;
	}
	if (!mutated) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: nextProviders
		}
	};
}
const AGENT_MODEL_NORMALIZERS = {
	model: normalizeAgentModelConfigForWrite,
	models: normalizeAgentModelMapForWrite,
	modelPolicy: normalizeAgentModelPolicyForWrite
};
function normalizeAgentModelFields(value, defaults) {
	let next = defaults ? { ...value } : value;
	for (const key of [
		"model",
		"models",
		"modelPolicy"
	]) if (defaults ? value[key] !== void 0 : Object.hasOwn(value, key)) {
		const normalized = AGENT_MODEL_NORMALIZERS[key](value[key]);
		if (defaults || normalized !== value[key]) {
			if (next === value) next = { ...value };
			Object.assign(next, { [key]: normalized });
		}
	}
	return next;
}
function normalizeConfigModelRefsForWrite(cfg, providerConfigNormalizer) {
	const providerNormalized = normalizeModelProviderConfigsForWrite(cfg, providerConfigNormalizer);
	const defaults = providerNormalized.agents?.defaults;
	const agentsList = listAgentEntries(providerNormalized);
	const nextDefaults = defaults && normalizeAgentModelFields(defaults, true);
	const nextAgentsList = normalizeArray(agentsList, (agent) => isRecord(agent) ? normalizeAgentModelFields(agent, false) : agent);
	if (nextDefaults === defaults && nextAgentsList === agentsList) return providerNormalized;
	return {
		...providerNormalized,
		agents: {
			...providerNormalized.agents,
			...nextDefaults ? { defaults: nextDefaults } : {},
			...nextAgentsList !== agentsList ? { entries: toAgentEntriesRecord(nextAgentsList) } : {}
		}
	};
}
function applyProviderAuthConfigPatch(cfg, patch, options) {
	const providerConfigNormalizer = options?.providerConfigNormalizer ?? normalizeProviderConfigForConfigDefaults;
	const merged = normalizeConfigModelRefsForWrite(mergeConfigPatch(cfg, patch), providerConfigNormalizer);
	if (!options?.replaceDefaultModels || !isRecord(patch)) return merged;
	const patchModels = patch.agents?.defaults?.models;
	if (!isRecord(patchModels)) return merged;
	return normalizeConfigModelRefsForWrite({
		...merged,
		agents: {
			...merged.agents,
			defaults: {
				...merged.agents?.defaults,
				models: mergeConfigPatch({}, patchModels, false)
			}
		}
	}, providerConfigNormalizer);
}
function restoreAgentsDefaultsModel(cfg, model) {
	const defaults = { ...cfg.agents?.defaults };
	if (model === void 0) delete defaults.model;
	else defaults.model = model;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults
		}
	};
}
/**
* Restore `agents.defaults.model`, including its absence, after a provider auth config merge when
* the user did not pass `--set-default`.
*/
function restorePriorAgentsDefaultsModelUnlessOptIn(params) {
	if (params.setDefault) return params.cfg;
	if (params.priorAgentsDefaultsModel === void 0 && params.cfg.agents?.defaults?.model === void 0) return params.cfg;
	return restoreAgentsDefaultsModel(params.cfg, params.priorAgentsDefaultsModel);
}
//#endregion
export { restorePriorAgentsDefaultsModelUnlessOptIn as a, restoreAgentsDefaultsModel as i, pickAuthMethod as n, resolveProviderMatch as r, applyProviderAuthConfigPatch as t };

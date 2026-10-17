import { _ as resolvePrimaryStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./defaults-Jag53zwP.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { h as resolveConfiguredModelRef, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import "./model-selection-resolve-cpFpShck.mjs";
import "./model-thinking-default-CZnoMXD6.mjs";
import "./model-selection-cli-CtTygCpm.mjs";
//#region src/agents/model-selection-persisted.ts
function resolvePersistedOverrideModelRef(params) {
	const defaultProvider = normalizeOptionalString(params.defaultProvider) ?? "openai";
	const overrideProvider = normalizeOptionalString(params.overrideProvider);
	const overrideModel = normalizeOptionalString(params.overrideModel);
	if (!overrideModel) return null;
	if (params.routeResolution === "resolved") return {
		provider: overrideProvider ?? defaultProvider,
		model: overrideModel
	};
	const encodedOverride = overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel;
	return parseModelRef(encodedOverride, defaultProvider, {
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	}) ?? {
		provider: overrideProvider || defaultProvider,
		model: overrideModel
	};
}
function normalizeStoredOverrideModel(params) {
	const providerOverride = normalizeOptionalString(params.providerOverride);
	const modelOverride = normalizeOptionalString(params.modelOverride);
	if (!providerOverride || !modelOverride || params.routeResolution === "resolved") return {
		providerOverride,
		modelOverride
	};
	const providerPrefix = `${providerOverride.toLowerCase()}/`;
	return {
		providerOverride,
		modelOverride: modelOverride.toLowerCase().startsWith(providerPrefix) ? modelOverride.slice(providerOverride.length + 1).trim() || modelOverride : modelOverride
	};
}
//#endregion
//#region src/agents/model-selection.ts
/**
* Public model-selection facade for persisted, configured, and allowed refs.
*/
/** Explicit session selections win over the last executed model on control/status surfaces. */
function resolvePersistedSelectedModelRef(params) {
	const override = resolvePersistedOverrideModelRef({
		...params,
		routeResolution: params.overrideRouteResolution
	});
	if (override) return override;
	const defaultProvider = normalizeOptionalString(params.defaultProvider) ?? "openai";
	const runtimeProvider = normalizeOptionalString(params.runtimeProvider);
	const runtimeModel = normalizeOptionalString(params.runtimeModel);
	if (runtimeModel) {
		if (runtimeProvider) return {
			provider: runtimeProvider,
			model: runtimeModel
		};
		return parseModelRef(runtimeModel, defaultProvider, params) ?? {
			provider: defaultProvider,
			model: runtimeModel
		};
	}
	return null;
}
async function canonicalizeCaseOnlyCatalogModelRef(params) {
	const rawModel = normalizeOptionalString(params.raw);
	if (!rawModel) return;
	const split = splitTrailingAuthProfile(rawModel);
	if (split.profile && params.preserveAuthProfile === false) return rawModel;
	const slash = split.model.indexOf("/");
	if (slash <= 0 || slash === split.model.length - 1 || split.model === split.model.toLowerCase()) return rawModel;
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		raw: split.model,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization
	});
	if (!resolved) return rawModel;
	const entry = findModelInCatalog(await params.loadCatalog(), resolved.ref.provider, resolved.ref.model);
	return entry ? appendAuthProfileSuffix(`${entry.provider}/${entry.id}`, split.profile) : rawModel;
}
function appendAuthProfileSuffix(modelRef, profile) {
	return profile ? `${modelRef}@${profile}` : modelRef;
}
/**
* Resolve a normalized model string through a pre-built alias index, returning
* a fully qualified `provider/model` string.  If the value is already qualified
* or not a known alias, returns it unchanged.
*/
function resolveModelThroughAliases(value, aliasIndex) {
	const { model, profile } = splitTrailingAuthProfile(value);
	const aliasMatch = model.includes("/") ? void 0 : aliasIndex.byAlias.get(normalizeLowercaseStringOrEmpty(model));
	return appendAuthProfileSuffix(aliasMatch ? `${aliasMatch.ref.provider}/${aliasMatch.ref.model}` : model, profile);
}
function resolveSubagentSpawnModelSelection(params) {
	const runtimeDefault = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const configured = resolveConfiguredSubagentSpawnModelSelection({
		cfg: params.cfg,
		agentId: params.agentId,
		modelOverride: params.modelOverride,
		defaultProvider: runtimeDefault.provider,
		includeAgentPrimary: !params.inheritedModel
	});
	if (configured) return { model: configured };
	if (params.inheritedModel) return {
		model: `${params.inheritedModel.provider}/${params.inheritedModel.model}`,
		resolvedModel: { ...params.inheritedModel }
	};
	return { model: resolveModelThroughAliases(resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model) ?? `${runtimeDefault.provider}/${runtimeDefault.model}`, buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: runtimeDefault.provider
	})) };
}
function resolveConfiguredSubagentSpawnModelSelection(params) {
	const raw = resolvePrimaryStringValue(params.modelOverride) ?? resolveSubagentConfiguredModelSelection({
		cfg: params.cfg,
		agentId: params.agentId,
		includeAgentPrimary: params.includeAgentPrimary,
		modelRuntime: params.modelRuntime
	});
	if (!raw) return;
	const defaultProvider = normalizeOptionalString(params.defaultProvider) ?? resolveConfiguredModelRef({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: "openai",
		defaultModel: "gpt-6-astra"
	}, params.modelRuntime).provider;
	return resolveModelThroughAliases(raw, buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider
	}));
}
/** Default reasoning level when session/directive do not set it: "on" if model supports reasoning, else "off". */
function resolveReasoningDefault(params) {
	const key = modelKey(params.provider, params.model);
	return (params.catalog?.find((entry) => entry.provider === params.provider && entry.id === params.model || entry.provider === key && entry.id === params.model))?.reasoning === true ? "on" : "off";
}
//#endregion
export { resolveSubagentSpawnModelSelection as a, resolveReasoningDefault as i, resolveConfiguredSubagentSpawnModelSelection as n, normalizeStoredOverrideModel as o, resolvePersistedSelectedModelRef as r, resolvePersistedOverrideModelRef as s, canonicalizeCaseOnlyCatalogModelRef as t };

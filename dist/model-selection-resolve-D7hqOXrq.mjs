import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-DKxKaZGG.mjs";
import { f as resolveAllowedModelRefFromAliasIndex, i as buildModelAliasIndex, s as getModelRefStatus, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
//#region src/agents/model-selection-resolve.ts
/**
* Model selection resolution facade.
*
* This module resolves configured fallbacks and explicit model selections.
*/
/** Resolves legacy provider/model pairs whose model field may still contain an alias. */
function resolveModelAliasFromPair(params) {
	const bareAlias = resolveModelRefFromString({
		...params,
		raw: params.model,
		defaultProvider: params.provider
	});
	const providerAlias = resolveModelRefFromString({
		...params,
		raw: `${params.provider}/${params.model}`
	});
	if (providerAlias?.alias) return providerAlias.ref;
	const provider = normalizeProviderId(params.provider);
	return bareAlias?.alias && (normalizeProviderId(bareAlias.ref.provider) === provider || provider === normalizeProviderId(params.defaultProvider)) ? bareAlias.ref : null;
}
/** Resolve agent-owned fallback overrides without loading the full selection facade. */
function resolveConfiguredModelFallbacks(params) {
	if (params.agentId) {
		const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
		if (override !== void 0) return override;
	}
	return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
}
/** Resolves a raw model string into an allowed model ref or an explanatory error. */
function resolveAllowedModelRefCore(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	});
	return resolveAllowedModelRefFromAliasIndex({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		agentId: params.agentId,
		aliasIndex,
		manifestPlugins: params.manifestPlugins,
		getStatus: (ref) => getModelRefStatus({
			cfg: params.cfg,
			catalog: params.catalog,
			ref,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel,
			agentId: params.agentId,
			manifestPlugins: params.manifestPlugins
		})
	});
}
//#endregion
export { resolveConfiguredModelFallbacks as n, resolveModelAliasFromPair as r, resolveAllowedModelRefCore as t };

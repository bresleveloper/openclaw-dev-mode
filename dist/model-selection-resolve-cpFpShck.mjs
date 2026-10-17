import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CG17uXFn.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { f as resolveAllowedModelRefFromAliasIndex, i as buildModelAliasIndex, s as getModelRefStatus, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
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
	return resolveAllowedModelRefFromAliasIndex({
		...params,
		aliasIndex: buildModelAliasIndex(params),
		getStatus: (ref) => getModelRefStatus({
			...params,
			ref
		})
	});
}
//#endregion
export { resolveConfiguredModelFallbacks as n, resolveModelAliasFromPair as r, resolveAllowedModelRefCore as t };

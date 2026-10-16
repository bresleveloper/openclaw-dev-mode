import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { B as parseOperatorModelPolicyWildcardRef, m as resolveConfiguredAgentId, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DrwZe41_.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-CwR4D88b.mjs";
//#region src/agents/operator-model-policy.ts
const modelPolicyMembership = /* @__PURE__ */ new WeakMap();
/** Comparison uses the original predicate, including models outside concrete discovery choices. */
function readOperatorModelPolicyMembership(policy) {
	return policy ? modelPolicyMembership.get(policy) : "unrestricted";
}
/** Preserve the already-selected default when allowed, otherwise use the first compatible source choice. */
function resolveOperatorModelDefault(params) {
	if (!params.policy || params.policy.allows(params.model)) return params.model;
	const automatic = new Set(prepareAgentModels(params).models.map(identity));
	return params.policy.models.find((ref) => automatic.has(identity(ref)) || params.allows(ref));
}
function identity(ref) {
	return JSON.stringify([normalizeProviderId(ref.provider), ref.model]);
}
function prepareAgentModels(params) {
	const normalization = {
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins,
		allowPluginNormalization: false
	};
	const primary = resolveDefaultModelForAgent(normalization);
	const selection = {
		...normalization,
		defaultProvider: primary.provider
	};
	const aliasIndex = buildModelAliasIndex(selection);
	const resolve = (raw) => resolveModelRefFromString({
		...selection,
		raw,
		aliasIndex
	})?.ref;
	const models = [primary];
	for (const raw of resolveConfiguredModelFallbacks(params)) {
		const ref = resolve(raw);
		if (ref) models.push(ref);
	}
	return {
		models,
		resolve
	};
}
function prepareRefs(refs, resolve) {
	const exact = /* @__PURE__ */ new Map();
	const wildcards = /* @__PURE__ */ new Set();
	for (const raw of refs) {
		const wildcard = parseOperatorModelPolicyWildcardRef(raw);
		if (wildcard) wildcards.add(wildcard.key);
		else {
			const ref = resolve(raw);
			if (ref) exact.set(identity(ref), ref);
		}
	}
	return {
		exact,
		wildcards: [...wildcards].toSorted(),
		patterns: compileGlobPatterns({
			raw: [...wildcards],
			normalize: (raw) => raw
		})
	};
}
function matches(prepared, ref) {
	return prepared.exact.has(identity(ref)) || matchesAnyGlobPattern(`${normalizeProviderId(ref.provider)}/${ref.model}`, prepared.patterns);
}
/** Prepare once per current role/config view; row and execution checks consume only these facts. */
function prepareOperatorModelPolicy(params) {
	const { cfg, policy } = params;
	if (!policy) return;
	const { models: sourceModels, resolve } = prepareAgentModels({
		cfg,
		agentId: resolveConfiguredAgentId(cfg, resolveAmbientOwnerAgentId(cfg, policy.sourceAgent)),
		manifestPlugins: params.manifestPlugins
	});
	const allowed = policy.allow === void 0 ? {
		exact: new Map(sourceModels.map((ref) => [identity(ref), ref])),
		wildcards: [],
		patterns: []
	} : prepareRefs(policy.allow, resolve);
	const denied = prepareRefs(policy.deny ?? [], resolve);
	const allows = (ref) => matches(allowed, ref) && !matches(denied, ref);
	const models = [...new Map([...sourceModels, ...allowed.exact.values()].map((ref) => [identity(ref), ref])).values()].filter(allows).map((ref) => Object.freeze({ ...ref }));
	const prepared = Object.freeze({
		models: Object.freeze(models),
		allows
	});
	modelPolicyMembership.set(prepared, JSON.stringify([
		[...allowed.exact.keys()].toSorted(),
		allowed.wildcards,
		[...denied.exact.keys()].toSorted(),
		denied.wildcards
	]));
	return prepared;
}
//#endregion
export { readOperatorModelPolicyMembership as n, resolveOperatorModelDefault as r, prepareOperatorModelPolicy as t };

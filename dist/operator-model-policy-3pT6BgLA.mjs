import "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { c as parseOperatorModelPolicyWildcardRef } from "./model-policy-allowlist-migration-BErDvsnV.mjs";
import { h as resolveConfiguredAgentId, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DuaaJ-nB.mjs";
import { i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-B4Z5ZIMD.mjs";
//#region src/agents/operator-model-policy.ts
const modelPolicySnapshots = /* @__PURE__ */ new WeakMap();
/** Preserve resolved identities and wildcard predicates, not only discovered default choices. */
function captureOperatorModelPolicySnapshot(policy) {
	return policy ? modelPolicySnapshots.get(policy)?.snapshot : void 0;
}
function restoreOperatorModelPolicySnapshot(snapshot) {
	const prepare = (refs) => ({
		exact: new Set(refs.exact),
		patterns: compileGlobPatterns({
			raw: refs.wildcards,
			normalize: (raw) => raw
		})
	});
	const captured = freezeJsonSnapshot(structuredClone(snapshot));
	const allowed = prepare(captured.allowed);
	const denied = prepare(captured.denied);
	const policy = Object.freeze({
		models: captured.models,
		allows: (ref) => matches(allowed, ref) && !matches(denied, ref)
	});
	modelPolicySnapshots.set(policy, {
		snapshot: captured,
		membership: JSON.stringify([
			captured.allowed.exact,
			captured.allowed.wildcards,
			captured.denied.exact,
			captured.denied.wildcards
		])
	});
	return policy;
}
/** Comparison uses the original predicate, including models outside concrete discovery choices. */
function readOperatorModelPolicyMembership(policy) {
	return policy ? modelPolicySnapshots.get(policy)?.membership : "unrestricted";
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
	return restoreOperatorModelPolicySnapshot({
		models: [...new Map([...sourceModels, ...allowed.exact.values()].map((ref) => [identity(ref), ref])).values()].filter(allows),
		allowed: {
			exact: [...allowed.exact.keys()].toSorted(),
			wildcards: allowed.wildcards
		},
		denied: {
			exact: [...denied.exact.keys()].toSorted(),
			wildcards: denied.wildcards
		}
	});
}
//#endregion
export { restoreOperatorModelPolicySnapshot as a, resolveOperatorModelDefault as i, prepareOperatorModelPolicy as n, readOperatorModelPolicyMembership as r, captureOperatorModelPolicySnapshot as t };

import { i as parseConcreteConfigPathTokens } from "./dot-path-BSC76DAI.mjs";
import { l as isValidEnvSecretRefId, t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
//#region src/config/resolution-facts.ts
const configResolutionFacts = /* @__PURE__ */ new WeakMap();
const envSecretRefsByFacts = /* @__PURE__ */ new WeakMap();
function createConfigResolutionFacts(warnings, pendingEnvSecretRefs = /* @__PURE__ */ new Map(), envProvider = DEFAULT_SECRET_PROVIDER_ALIAS, resolvedEnvSecretRefs = /* @__PURE__ */ new Map()) {
	const facts = new Set(warnings.map(({ configPath }) => configPath));
	const provider = envProvider?.trim() || "default";
	if (pendingEnvSecretRefs.size > 0 || resolvedEnvSecretRefs.size > 0) {
		const envSecretRefs = /* @__PURE__ */ new Map();
		for (const [path, id] of pendingEnvSecretRefs) envSecretRefs.set(path, {
			ref: {
				source: "env",
				provider,
				id
			},
			state: "pending"
		});
		for (const [path, id] of resolvedEnvSecretRefs) envSecretRefs.set(path, {
			ref: {
				source: "env",
				provider,
				id
			},
			state: "resolved"
		});
		envSecretRefsByFacts.set(facts, envSecretRefs);
	}
	return facts;
}
function setConfigResolutionFacts(target, facts) {
	if (!target || typeof target !== "object") return;
	if (facts === null) {
		configResolutionFacts.delete(target);
		return;
	}
	configResolutionFacts.set(target, facts);
}
function getConfigResolutionFacts(target) {
	return target && typeof target === "object" ? configResolutionFacts.get(target) ?? null : null;
}
function copyConfigResolutionFacts(source, target) {
	setConfigResolutionFacts(target, getConfigResolutionFacts(source));
}
function cloneConfigWithResolutionFacts(value) {
	const cloned = structuredClone(value);
	copyConfigResolutionFacts(value, cloned);
	return cloned;
}
function copyConfigResolutionFactsExcept(source, target, paths) {
	const facts = getConfigResolutionFacts(source);
	if (facts === null) {
		setConfigResolutionFacts(target, null);
		return;
	}
	const envSecretRefs = envSecretRefsByFacts.get(facts);
	if (!paths.some((path) => facts.has(path) || envSecretRefs?.has(path) === true)) {
		setConfigResolutionFacts(target, facts);
		return;
	}
	const remaining = new Set(facts);
	paths.forEach((path) => remaining.delete(path));
	if (envSecretRefs) {
		const remainingEnvSecretRefs = new Map(envSecretRefs);
		paths.forEach((path) => remainingEnvSecretRefs.delete(path));
		if (remainingEnvSecretRefs.size > 0) envSecretRefsByFacts.set(remaining, remainingEnvSecretRefs);
	}
	setConfigResolutionFacts(target, remaining);
}
/** Captures loader provenance as deterministic data for a prepared worker generation. */
function serializeConfigResolutionFacts(target) {
	const facts = getConfigResolutionFacts(target);
	return facts === null ? null : {
		unresolvedPaths: [...facts].toSorted(),
		envSecretRefs: [...envSecretRefsByFacts.get(facts) ?? []].toSorted(([left], [right]) => left.localeCompare(right))
	};
}
/** Restores known-empty facts too: absence would reparse decoded literals as references. */
function restoreConfigResolutionFacts(target, data) {
	if (data === null) {
		setConfigResolutionFacts(target, null);
		return;
	}
	const facts = new Set(data.unresolvedPaths);
	if (data.envSecretRefs.length > 0) envSecretRefsByFacts.set(facts, new Map(data.envSecretRefs));
	setConfigResolutionFacts(target, facts);
}
function hasUnresolvedConfigPath(target, path) {
	return getConfigResolutionFacts(target)?.has(path) === true;
}
/** Returns only a still-pending reference recorded from the authored config source. */
function getAuthoredConfigSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	const fact = facts ? envSecretRefsByFacts.get(facts)?.get(path) : void 0;
	return fact?.state === "pending" ? fact.ref : null;
}
/** Returns the env source of a value that config substitution already materialized. */
function getResolvedConfigEnvSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	const fact = facts ? envSecretRefsByFacts.get(facts)?.get(path) : void 0;
	return fact?.state === "resolved" ? fact.ref : null;
}
/** Collect authored env references, including shorthand already materialized by config loading. */
function collectEnvSecretRefIds(value) {
	const facts = getConfigResolutionFacts(value);
	const ids = /* @__PURE__ */ new Set();
	for (const { ref } of (facts && envSecretRefsByFacts.get(facts))?.values() ?? []) ids.add(ref.id);
	const seen = /* @__PURE__ */ new WeakSet();
	const visit = (candidate) => {
		const ref = typeof candidate === "string" && facts !== null ? null : coerceSecretRef(candidate);
		if (ref?.source === "env" && isValidEnvSecretRefId(ref.id)) {
			ids.add(ref.id);
			return;
		}
		if (typeof candidate !== "object" || candidate === null || seen.has(candidate)) return;
		seen.add(candidate);
		for (const child of Array.isArray(candidate) ? candidate : Object.values(candidate)) visit(child);
	};
	visit(value);
	return ids;
}
/** An absent path is distinct from an own property whose value is undefined. */
function readConfigFactPathValue(root, tokens) {
	let cursor = root;
	for (const token of tokens) {
		if (typeof cursor !== "object" || cursor === null || Array.isArray(cursor) !== (typeof token === "number") || !Object.hasOwn(cursor, token)) return;
		cursor = Reflect.get(cursor, token);
	}
	return { value: cursor };
}
/**
* Carries recorded facts onto a rewritten config, dropping the paths the rewrite invalidated.
*
* Repair and migration rebuild config through `structuredClone`, so the result reaches its callers
* without the facts keyed to the original object. A path whose value survived the rewrite unchanged
* still describes the same authored reference; one the rewrite moved, dropped, or overwrote does
* not, so it must not keep answering path lookups on the rewritten config.
*/
function copyConfigResolutionFactsThroughRewrite(source, target) {
	const facts = getConfigResolutionFacts(source);
	if (facts === null) {
		setConfigResolutionFacts(target, null);
		return;
	}
	copyConfigResolutionFactsExcept(source, target, [.../* @__PURE__ */ new Set([...facts, ...envSecretRefsByFacts.get(facts)?.keys() ?? []])].filter((path) => {
		let tokens;
		try {
			tokens = parseConcreteConfigPathTokens(path);
		} catch {
			return true;
		}
		const before = readConfigFactPathValue(source, tokens);
		const after = readConfigFactPathValue(target, tokens);
		return !before || !after || !Object.is(before.value, after.value);
	}));
}
/** Reads inline references from authored facts and structured references from their values. */
function resolveConfigSecretRef(params) {
	return typeof params.value === "string" && getConfigResolutionFacts(params.config) !== null ? getAuthoredConfigSecretRef(params.config, params.path) ?? (params.includeResolved ? getResolvedConfigEnvSecretRef(params.config, params.path) : null) : coerceSecretRef(params.value, params.defaults);
}
function hasUnresolvedConfigPathInSubtree(target, path) {
	const facts = getConfigResolutionFacts(target);
	if (facts === null) return false;
	for (const candidate of facts) if (candidate === path || candidate.startsWith(`${path}.`) || candidate.startsWith(`${path}[`)) return true;
	return false;
}
//#endregion
export { copyConfigResolutionFactsThroughRewrite as a, getConfigResolutionFacts as c, hasUnresolvedConfigPathInSubtree as d, resolveConfigSecretRef as f, setConfigResolutionFacts as h, copyConfigResolutionFactsExcept as i, getResolvedConfigEnvSecretRef as l, serializeConfigResolutionFacts as m, collectEnvSecretRefIds as n, createConfigResolutionFacts as o, restoreConfigResolutionFacts as p, copyConfigResolutionFacts as r, getAuthoredConfigSecretRef as s, cloneConfigWithResolutionFacts as t, hasUnresolvedConfigPath as u };

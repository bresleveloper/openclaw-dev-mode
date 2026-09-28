import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { X as resolveConfigEnvVars, Y as containsEnvVarReference } from "./redact-B5EGyLvV.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/env-preserve-authored.ts
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
function collectAuthoredEnvRefs(value) {
	const refs = [];
	for (let index = 0; index < value.length; index += 1) {
		if (value[index] !== "$") continue;
		const isEscaped = value[index + 1] === "$" && value[index + 2] === "{";
		const nameStart = index + (isEscaped ? 3 : 2);
		if (!isEscaped && value[index + 1] !== "{") continue;
		const nameEnd = value.indexOf("}", nameStart);
		if (nameEnd === -1 || !ENV_VAR_NAME_PATTERN.test(value.slice(nameStart, nameEnd))) continue;
		refs.push({
			kind: isEscaped ? "escaped" : "unescaped",
			name: value.slice(nameStart, nameEnd)
		});
		index = nameEnd;
	}
	return refs;
}
function hasEscapedEnvVarRef(value) {
	return collectAuthoredEnvRefs(value).some((ref) => ref.kind === "escaped");
}
function containsAuthoredUnescapedEnvTemplate(value) {
	if (typeof value === "string") return containsEnvVarReference(value);
	if (Array.isArray(value)) return value.some((item) => containsAuthoredUnescapedEnvTemplate(item));
	if (isPlainObject(value)) return Object.values(value).some((item) => containsAuthoredUnescapedEnvTemplate(item));
	return false;
}
function containsAuthoredEscapedEnvTemplate(value) {
	if (typeof value === "string") return hasEscapedEnvVarRef(value);
	if (Array.isArray(value)) return value.some((item) => containsAuthoredEscapedEnvTemplate(item));
	if (isPlainObject(value)) return Object.values(value).some((item) => containsAuthoredEscapedEnvTemplate(item));
	return false;
}
function countAuthoredEnvRefsByPath(value, kind) {
	const countsByName = /* @__PURE__ */ new Map();
	const visit = (item, path) => {
		if (typeof item === "string") {
			for (const ref of collectAuthoredEnvRefs(item)) if (ref.kind === kind) {
				const pathCounts = countsByName.get(ref.name) ?? /* @__PURE__ */ new Map();
				const pathKey = JSON.stringify(path);
				pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
				countsByName.set(ref.name, pathCounts);
			}
			return;
		}
		if (Array.isArray(item)) {
			item.forEach((child, index) => visit(child, [...path, String(index)]));
			return;
		}
		if (isPlainObject(item)) Object.entries(item).forEach(([key, child]) => visit(child, [...path, key]));
	};
	visit(value, []);
	return countsByName;
}
function countResolvedActiveEnvRefsByPath(incoming, parsed, resolved) {
	const countsByName = /* @__PURE__ */ new Map();
	const visit = (incomingItem, parsedItem, resolvedItem, path) => {
		if (typeof incomingItem === "string" && typeof parsedItem === "string") {
			if (!isDeepStrictEqual(incomingItem, resolvedItem)) return;
			for (const ref of collectAuthoredEnvRefs(parsedItem)) if (ref.kind === "unescaped") {
				const pathCounts = countsByName.get(ref.name) ?? /* @__PURE__ */ new Map();
				const pathKey = JSON.stringify(path);
				pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
				countsByName.set(ref.name, pathCounts);
			}
			return;
		}
		if (Array.isArray(incomingItem) && Array.isArray(parsedItem) && Array.isArray(resolvedItem)) {
			parsedItem.forEach((child, index) => visit(incomingItem[index], child, resolvedItem[index], [...path, String(index)]));
			return;
		}
		if (isPlainObject(incomingItem) && isPlainObject(parsedItem) && isPlainObject(resolvedItem)) Object.entries(parsedItem).forEach(([key, child]) => visit(incomingItem[key], child, resolvedItem[key], [...path, key]));
	};
	visit(incoming, parsed, resolved, []);
	return countsByName;
}
function containsUnaccountedActiveEscapedEnvRef(incoming, escapedParsed, matchedIncoming, matchedParsed, matchedResolved, explicitSetPaths) {
	const escapedCounts = countAuthoredEnvRefsByPath(escapedParsed, "escaped");
	const incomingActiveCounts = countAuthoredEnvRefsByPath(incoming, "unescaped");
	const incomingEscapedCounts = countAuthoredEnvRefsByPath(incoming, "escaped");
	const matchedActiveCounts = countResolvedActiveEnvRefsByPath(matchedIncoming, matchedParsed, matchedResolved);
	const matchedEscapedCounts = countAuthoredEnvRefsByPath(matchedParsed, "escaped");
	return [...escapedCounts].some(([name, escapedPathCounts]) => {
		const isExplicitActivation = (path) => {
			if (!escapedPathCounts.has(path) || !explicitSetPaths?.length) return false;
			const segments = JSON.parse(path);
			return explicitSetPaths.some((supplied) => supplied.every((segment, index) => segments[index] === segment));
		};
		return [...incomingActiveCounts.get(name) ?? /* @__PURE__ */ new Map()].some(([path, count]) => !isExplicitActivation(path) && count > (matchedActiveCounts.get(name)?.get(path) ?? 0)) || [...escapedPathCounts.keys()].some((path) => {
			const incomingActiveCount = incomingActiveCounts.get(name)?.get(path) ?? 0;
			return !isExplicitActivation(path) && incomingActiveCount > 0 && (incomingEscapedCounts.get(name)?.get(path) ?? 0) < (matchedEscapedCounts.get(name)?.get(path) ?? 0);
		});
	});
}
function preservesAuthoredEscapedEnvRefs(incoming, parsed) {
	const parsedEscapedCounts = countAuthoredEnvRefsByPath(parsed, "escaped");
	const incomingEscapedCounts = countAuthoredEnvRefsByPath(incoming, "escaped");
	return [...parsedEscapedCounts].every(([name, parsedPathCounts]) => [...parsedPathCounts].every(([path, count]) => (incomingEscapedCounts.get(name)?.get(path) ?? 0) >= count));
}
//#endregion
//#region src/config/env-preserve.ts
/**
* Preserves `${VAR}` environment variable references during config write-back.
*
* When config is read, `${VAR}` references are resolved to their values.
* When writing back, callers pass the resolved config. This module detects
* values that match what a `${VAR}` reference would resolve to and restores
* the original reference, so env var references survive config round-trips.
*
* A value is restored only if:
* 1. The pre-substitution value contained a `${VAR}` pattern
* 2. The corresponding resolved source value matches the incoming value
*
* If a caller intentionally set a new value (different from what the env var
* resolves to), the new value is kept as-is.
*/
const ENV_VAR_PATTERN = /\$\{[A-Z_][A-Z0-9_]*\}/;
var EnvRefArrayMutationError = class extends Error {
	constructor() {
		super("Config write would reorder or modify an array containing environment references.");
		this.name = "EnvRefArrayMutationError";
	}
};
/**
* Check if a string contains any `${VAR}` env var references.
*/
function hasEnvVarRef(value) {
	return ENV_VAR_PATTERN.test(value);
}
function getArrayIdentityPathValue(value, path) {
	let current = value;
	for (const segment of path) {
		if (!isPlainObject(current)) return;
		current = current[segment];
	}
	return current;
}
function collectStableArrayIdentityPaths(value) {
	if (!isPlainObject(value)) return [];
	for (const key of ["id", "agentId"]) {
		const child = value[key];
		if (typeof child === "string" && !hasEnvVarRef(child)) return [[key]];
	}
	return [];
}
function resolveStableArrayIdentityMatch(params) {
	const parsedItem = params.parsed[params.parsedIndex];
	const identityPaths = collectStableArrayIdentityPaths(parsedItem);
	if (identityPaths.length === 0) return { kind: "none" };
	let incomingIndex;
	let hasUniqueAuthoredIdentity = false;
	for (const identityPath of identityPaths) {
		const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
		if (params.parsed.filter((item) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)).length !== 1) continue;
		hasUniqueAuthoredIdentity = true;
		const incomingMatches = params.incoming.flatMap((item, index) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue) ? [index] : []);
		if (incomingMatches.length !== 1 || incomingIndex !== void 0 && incomingIndex !== incomingMatches[0]) return { kind: "invalid" };
		incomingIndex = incomingMatches[0];
	}
	if (incomingIndex !== void 0) return {
		kind: "match",
		incomingIndex
	};
	return hasUniqueAuthoredIdentity ? { kind: "invalid" } : { kind: "none" };
}
function collectLiteralArrayIdentityPaths(value, path = []) {
	if (typeof value === "string") return hasEnvVarRef(value) ? [] : [path];
	if (!isPlainObject(value)) return [];
	return Object.entries(value).flatMap(([key, child]) => collectLiteralArrayIdentityPaths(child, [...path, key]));
}
function hasStableSameIndexLiteralShape(params) {
	if (params.incoming.length !== params.parsed.length) return false;
	const parsedItem = params.parsed[params.parsedIndex];
	const literalPaths = collectLiteralArrayIdentityPaths(parsedItem);
	if (literalPaths.length === 0 || literalPaths.some((identityPath) => {
		const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
		return !isDeepStrictEqual(getArrayIdentityPathValue(params.incoming[params.parsedIndex], identityPath), identityValue);
	})) return false;
	return literalPaths.some((identityPath) => {
		const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
		const authoredCount = params.parsed.filter((item) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)).length;
		const incomingCount = params.incoming.filter((item) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)).length;
		return authoredCount === 1 && incomingCount === 1;
	});
}
function matchesArrayElementAtSameIndex(incoming, parsed, resolved) {
	return isDeepStrictEqual(incoming, parsed) || isDeepStrictEqual(incoming, resolved);
}
function matchesRetainedArrayItem(params) {
	if (matchesArrayElementAtSameIndex(params.incoming[params.incomingIndex], params.parsed[params.parsedIndex], params.resolved[params.parsedIndex])) return true;
	const stableIdentity = resolveStableArrayIdentityMatch({
		incoming: params.incoming,
		parsed: params.parsed,
		parsedIndex: params.parsedIndex
	});
	return stableIdentity.kind === "match" && stableIdentity.incomingIndex === params.incomingIndex;
}
function hasStableSameIndexNeighbors(params) {
	return params.incoming.length === params.parsed.length && params.parsed.every((item, index) => index === params.parsedIndex || matchesArrayElementAtSameIndex(params.incoming[index], item, params.resolved[index]));
}
function matchUniqueRetainedArrayItems(params) {
	if (params.incoming.length >= params.parsed.length) return;
	const earliestParsedIndexes = [];
	let nextParsedIndex = 0;
	for (let incomingIndex = 0; incomingIndex < params.incoming.length; incomingIndex += 1) {
		const parsedIndex = params.parsed.findIndex((_parsedItem, index) => index >= nextParsedIndex && matchesRetainedArrayItem({
			...params,
			incomingIndex,
			parsedIndex: index
		}));
		if (parsedIndex < 0) return;
		earliestParsedIndexes.push(parsedIndex);
		nextParsedIndex = parsedIndex + 1;
	}
	const latestParsedIndexes = Array.from({ length: params.incoming.length }, () => 0);
	nextParsedIndex = params.parsed.length - 1;
	for (let incomingIndex = params.incoming.length - 1; incomingIndex >= 0; incomingIndex -= 1) {
		let parsedIndex = nextParsedIndex;
		while (parsedIndex >= 0 && !matchesRetainedArrayItem({
			...params,
			incomingIndex,
			parsedIndex
		})) parsedIndex -= 1;
		if (parsedIndex < 0) return;
		latestParsedIndexes[incomingIndex] = parsedIndex;
		nextParsedIndex = parsedIndex - 1;
	}
	if (!isDeepStrictEqual(earliestParsedIndexes, latestParsedIndexes)) return;
	return new Map(earliestParsedIndexes.map((parsedIndex, incomingIndex) => [parsedIndex, incomingIndex]));
}
function matchAuthoredTemplateArrayItems(params) {
	const templateIndexes = params.parsed.flatMap((item, index) => containsAuthoredUnescapedEnvTemplate(item) ? [index] : []);
	if (params.incoming.length === params.parsed.length && params.incoming.every((item, index) => matchesArrayElementAtSameIndex(item, params.parsed[index], params.resolved[index]))) return new Map(templateIndexes.map((index) => [index, index]));
	const retainedDeletionMatches = matchUniqueRetainedArrayItems(params);
	if (retainedDeletionMatches) return new Map(templateIndexes.flatMap((parsedIndex) => {
		const incomingIndex = retainedDeletionMatches.get(parsedIndex);
		return incomingIndex === void 0 ? [] : [[parsedIndex, incomingIndex]];
	}));
	const matches = /* @__PURE__ */ new Map();
	const usedIncomingIndexes = /* @__PURE__ */ new Set();
	const addMatch = (parsedIndex, incomingIndex) => {
		if (usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
		matches.set(parsedIndex, incomingIndex);
		usedIncomingIndexes.add(incomingIndex);
	};
	for (const parsedIndex of templateIndexes) {
		const parsedItem = params.parsed[parsedIndex];
		const stableIdentity = resolveStableArrayIdentityMatch({
			incoming: params.incoming,
			parsed: params.parsed,
			parsedIndex
		});
		if (stableIdentity.kind !== "none") {
			if (stableIdentity.kind === "invalid") throw new EnvRefArrayMutationError();
			addMatch(parsedIndex, stableIdentity.incomingIndex);
			continue;
		}
		if (parsedIndex < params.incoming.length && matchesArrayElementAtSameIndex(params.incoming[parsedIndex], parsedItem, params.resolved[parsedIndex])) {
			const precedingItemsRemainAligned = params.parsed.slice(0, parsedIndex).every((item, index) => matchesArrayElementAtSameIndex(params.incoming[index], item, params.resolved[index]));
			const duplicateAuthoredMatch = params.parsed.some((item, index) => index !== parsedIndex && matchesArrayElementAtSameIndex(params.incoming[parsedIndex], item, params.resolved[index]));
			const duplicateIncomingMatch = params.incoming.some((item, index) => index !== parsedIndex && matchesArrayElementAtSameIndex(item, parsedItem, params.resolved[parsedIndex]));
			if (!(params.incoming.length === params.parsed.length || precedingItemsRemainAligned) || duplicateAuthoredMatch || duplicateIncomingMatch) throw new EnvRefArrayMutationError();
			addMatch(parsedIndex, parsedIndex);
			continue;
		}
		if (isPlainObject(parsedItem) || Array.isArray(parsedItem)) {
			const isSinglePositionEdit = params.incoming.length === 1 && params.parsed.length === 1;
			const hasSameIndexLiteralIdentity = hasStableSameIndexLiteralShape({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex
			});
			const hasSameIndexNeighbors = hasStableSameIndexNeighbors({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex,
				resolved: params.resolved
			});
			if (!isSinglePositionEdit && !hasSameIndexLiteralIdentity && !hasSameIndexNeighbors) throw new EnvRefArrayMutationError();
			addMatch(parsedIndex, parsedIndex);
			continue;
		}
		if (params.incoming.some((item, incomingIndex) => incomingIndex !== parsedIndex && matchesArrayElementAtSameIndex(item, parsedItem, params.resolved[parsedIndex]))) throw new EnvRefArrayMutationError();
		if (parsedIndex < params.incoming.length) addMatch(parsedIndex, parsedIndex);
	}
	return matches;
}
function matchAuthoredEscapedTemplateArrayItems(params) {
	const escapedTemplateIndexes = params.parsed.flatMap((item, index) => containsAuthoredEscapedEnvTemplate(item) && !containsAuthoredUnescapedEnvTemplate(item) ? [index] : []);
	if (params.incoming.length === params.parsed.length && params.incoming.every((item, index) => matchesArrayElementAtSameIndex(item, params.parsed[index], params.resolved[index]))) return new Map(escapedTemplateIndexes.map((index) => [index, index]));
	const retainedDeletionMatches = matchUniqueRetainedArrayItems(params);
	if (retainedDeletionMatches) return new Map(escapedTemplateIndexes.flatMap((parsedIndex) => {
		const incomingIndex = retainedDeletionMatches.get(parsedIndex);
		if (incomingIndex === void 0) return [];
		if (params.usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
		return [[parsedIndex, incomingIndex]];
	}));
	const matches = /* @__PURE__ */ new Map();
	const usedIncomingIndexes = new Set(params.usedIncomingIndexes);
	const addMatch = (parsedIndex, incomingIndex) => {
		if (usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
		matches.set(parsedIndex, incomingIndex);
		usedIncomingIndexes.add(incomingIndex);
	};
	for (const parsedIndex of escapedTemplateIndexes) {
		const parsedItem = params.parsed[parsedIndex];
		const stableIdentity = resolveStableArrayIdentityMatch({
			incoming: params.incoming,
			parsed: params.parsed,
			parsedIndex
		});
		if (stableIdentity.kind !== "none") {
			if (stableIdentity.kind === "match") {
				addMatch(parsedIndex, stableIdentity.incomingIndex);
				continue;
			}
		}
		const resolvedItem = params.resolved[parsedIndex];
		const incomingMatches = params.incoming.flatMap((item, incomingIndex) => !usedIncomingIndexes.has(incomingIndex) && isDeepStrictEqual(item, resolvedItem) ? [incomingIndex] : []);
		const authoredMatches = escapedTemplateIndexes.filter((index) => isDeepStrictEqual(params.resolved[index], resolvedItem));
		const authoredRepresentationsAreIdentical = authoredMatches.every((index) => isDeepStrictEqual(params.parsed[index], parsedItem));
		if (incomingMatches.length > 0 && incomingMatches.length <= authoredMatches.length && authoredRepresentationsAreIdentical) {
			const sameIndexMatch = incomingMatches.includes(parsedIndex) ? parsedIndex : incomingMatches[0];
			addMatch(parsedIndex, expectDefined(sameIndexMatch, "env preserve same index match"));
			continue;
		}
		if (incomingMatches.length > 0) throw new EnvRefArrayMutationError();
		if (isPlainObject(parsedItem) || Array.isArray(parsedItem)) {
			const isSinglePositionEdit = params.incoming.length === 1 && params.parsed.length === 1;
			const hasSameIndexLiteralIdentity = hasStableSameIndexLiteralShape({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex
			});
			const hasSameIndexNeighbors = hasStableSameIndexNeighbors({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex,
				resolved: params.resolved
			});
			if (stableIdentity.kind === "none" && parsedIndex < params.incoming.length && !usedIncomingIndexes.has(parsedIndex) && (isSinglePositionEdit || hasSameIndexLiteralIdentity || hasSameIndexNeighbors)) {
				addMatch(parsedIndex, parsedIndex);
				continue;
			}
		}
	}
	return matches;
}
function resolveEnvVarRefsForComparison(value, env) {
	if (typeof value === "string") return hasEnvVarRef(value) ? resolveConfigEnvVars(value, env, { onMissing: () => {} }) : value;
	if (Array.isArray(value)) return value.map((item) => resolveEnvVarRefsForComparison(item, env));
	if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveEnvVarRefsForComparison(item, env)]));
	return value;
}
/**
* Deep-walk the incoming config and restore `${VAR}` references from the
* pre-substitution parsed config wherever the resolved value matches.
*
* @param incoming - The resolved config about to be written
* @param parsed - The pre-substitution parsed config (from the current file on disk)
* @param env - Environment variables for verification
* @returns A new config object with env var references restored where appropriate
*/
function restoreEnvVarRefs(incoming, parsed, env = process.env) {
	return restoreEnvVarRefsFromResolved(incoming, parsed, resolveEnvVarRefsForComparison(parsed, env));
}
/** Restore only references owned by the matching authored/resolved planning read. */
function restoreEnvVarRefsFromResolved(incoming, parsed, resolved, explicitSetPaths) {
	if (parsed === null || parsed === void 0) return incoming;
	if (typeof incoming === "string" && typeof parsed === "string") {
		if (hasEnvVarRef(incoming) && explicitSetPaths?.some((path) => path.length === 0)) return incoming;
		if (hasEnvVarRef(parsed)) {
			if (resolved === incoming) return parsed;
		}
		return incoming;
	}
	const childExplicitPaths = (key) => explicitSetPaths?.flatMap((path) => path.length === 0 ? [path] : path[0] === key ? [path.slice(1)] : []);
	if (Array.isArray(incoming) && Array.isArray(parsed) && Array.isArray(resolved)) {
		if (!containsAuthoredUnescapedEnvTemplate(parsed) && !containsAuthoredEscapedEnvTemplate(parsed)) return incoming.map((item, index) => index < parsed.length ? restoreEnvVarRefsFromResolved(item, parsed[index], resolved[index], childExplicitPaths(String(index))) : item);
		const unescapedMatches = matchAuthoredTemplateArrayItems({
			incoming,
			parsed,
			resolved
		});
		const escapedMatches = matchAuthoredEscapedTemplateArrayItems({
			incoming,
			parsed,
			resolved,
			usedIncomingIndexes: new Set(unescapedMatches.values())
		});
		const matches = new Map([...unescapedMatches, ...escapedMatches]);
		const next = [...incoming];
		const matchedIncomingIndexes = new Set(matches.values());
		for (const [parsedIndex, incomingIndex] of matches) next[incomingIndex] = restoreEnvVarRefsFromResolved(incoming[incomingIndex], parsed[parsedIndex], resolved[parsedIndex], childExplicitPaths(String(incomingIndex)));
		for (let index = 0; index < incoming.length && index < parsed.length; index += 1) if (!matchedIncomingIndexes.has(index) && !containsAuthoredUnescapedEnvTemplate(parsed[index]) && !containsAuthoredEscapedEnvTemplate(parsed[index])) next[index] = restoreEnvVarRefsFromResolved(incoming[index], parsed[index], resolved[index], childExplicitPaths(String(index)));
		const matchedParsedIndexByIncoming = new Map([...matches].map(([parsedIndex, incomingIndex]) => [incomingIndex, parsedIndex]));
		for (const [escapedParsedIndex, escapedParsedItem] of parsed.entries()) {
			if (!containsAuthoredEscapedEnvTemplate(escapedParsedItem)) continue;
			const matchedIncomingIndex = matches.get(escapedParsedIndex);
			if (matchedIncomingIndex !== void 0 && preservesAuthoredEscapedEnvRefs(next[matchedIncomingIndex], escapedParsedItem)) continue;
			const stableIdentity = resolveStableArrayIdentityMatch({
				incoming,
				parsed,
				parsedIndex: escapedParsedIndex
			});
			if (next.some((item, incomingIndex) => {
				const matchedParsedIndex = matchedParsedIndexByIncoming.get(incomingIndex);
				return containsUnaccountedActiveEscapedEnvRef(item, escapedParsedItem, incoming[incomingIndex], matchedParsedIndex === void 0 ? void 0 : parsed[matchedParsedIndex], matchedParsedIndex === void 0 ? void 0 : resolved[matchedParsedIndex], matchedParsedIndex === escapedParsedIndex && stableIdentity.kind === "match" && stableIdentity.incomingIndex === incomingIndex ? childExplicitPaths(String(incomingIndex)) : void 0);
			})) throw new EnvRefArrayMutationError();
		}
		return next;
	}
	if (isPlainObject(incoming) && isPlainObject(parsed) && isPlainObject(resolved)) {
		const result = {};
		for (const [key, value] of Object.entries(incoming)) if (Object.hasOwn(parsed, key)) result[key] = restoreEnvVarRefsFromResolved(value, parsed[key], resolved[key], childExplicitPaths(key));
		else result[key] = value;
		return result;
	}
	return incoming;
}
function resolveWriteEnvSnapshotForPath(params) {
	if (params.expectedConfigPath === void 0 || params.expectedConfigPath === params.actualConfigPath) return params.envSnapshotForRestore;
}
//#endregion
//#region src/config/io.types.ts
const configWriteCommittedSnapshot = Symbol("configWriteCommittedSnapshot");
const configWritePostCommitRollback = Symbol("configWritePostCommitRollback");
var ConfigRuntimeRefreshError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ConfigRuntimeRefreshError";
	}
};
//#endregion
export { restoreEnvVarRefs as a, resolveWriteEnvSnapshotForPath as i, configWriteCommittedSnapshot as n, restoreEnvVarRefsFromResolved as o, configWritePostCommitRollback as r, ConfigRuntimeRefreshError as t };

import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord, c as isRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { i as resolveConfigEnvVars, n as containsEnvVarReference } from "./env-substitution-4XQMuGXB.mjs";
import "./utils-gjJ-tD2q.mjs";
import { o as createConfigRuntimeEnvBase } from "./config-env-vars-BHneg24Q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as getConfigResolutionFacts, d as hasUnresolvedConfigPathInSubtree, h as setConfigResolutionFacts, u as hasUnresolvedConfigPath } from "./resolution-facts-D_pto3MV.mjs";
import "./session-key-CSDERtm3.mjs";
import { S as toAgentEntriesRecord } from "./agent-scope-config-fjA2T9Gz.mjs";
import { a as readAgentRosterProperty, n as listAgentEntries, r as listAgentEntriesWithSource, t as hasAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { t as coerceConfig, u as resolveConfigForRead } from "./io.read-helpers-KYk5dB53.mjs";
import { n as normalizeAgentModelMapForConfig, r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
import { n as projectLegacyAgentRosterEntries, t as parseLegacyAgentRoster } from "./legacy.roster-BkkM_O4n.mjs";
import { t as projectRuntimeChangesOntoSource } from "./source-value-projection-v5vH7oJ8.mjs";
import { n as configIncludeOwnsAgentRosterValues } from "./agent-roster-provenance-COeXJqiY.mjs";
import { t as isSecretRefShape } from "./redact-snapshot.secret-ref-VlPB9KBR.mjs";
import { r as restoreEnvVarRefsFromResolved, t as resolveWriteEnvSnapshotForPath } from "./env-preserve-ZftHp-Ht.mjs";
import { n as createConfigIncludeOwnershipError } from "./io.write-errors-BBNhGTcQ.mjs";
import { n as createMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/io.write-values.ts
/** Keep reference identity for persistence separate from values used by physical owners. */
function prepareProjectedConfigWriteValues(params, projectAuthoredAgentRosterForWrite) {
	const { snapshot } = params;
	const source = snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
	const authored = snapshot.authoredConfig ?? snapshot.parsed;
	const inputEnv = resolveWriteEnvSnapshotForPath({
		actualConfigPath: snapshot.path,
		expectedConfigPath: params.writeOptions?.expectedConfigPath,
		envSnapshotForRestore: params.writeOptions?.envSnapshotForRestore
	});
	const inputSource = inputEnv ? resolveConfigEnvVars(authored, inputEnv, { onMissing: () => {} }) : source;
	const restore = (config, explicitSetPaths, comparisonSource = source) => {
		const canonicalRoster = readAgentRosterProperty(config)?.kind === "entries";
		const project = (value) => canonicalRoster ? projectAuthoredAgentRosterForWrite({
			rootAuthoredConfig: value,
			sourceConfigBeforeMigrations: comparisonSource
		}) : value;
		return coerceConfig(restoreEnvVarRefsFromResolved(config, project(authored), project(comparisonSource), explicitSetPaths));
	};
	const authoredConfig = restore(params.nextConfig, params.explicitSetPaths, inputSource);
	const resolution = resolveConfigForRead(authoredConfig, createConfigRuntimeEnvBase(source, params.env), params.lowerPrecedenceEnv);
	const resolvedConfig = coerceConfig(resolution.resolvedConfigRaw);
	setConfigResolutionFacts(resolvedConfig, resolution.resolutionFacts);
	return {
		authoredConfig,
		resolutionEnv: resolution.envSnapshotForRestore,
		explicitSetValueSource: params.explicitSetValueSource ? restore(params.explicitSetValueSource, params.explicitSetPaths, inputSource) : authoredConfig,
		resolvedConfig,
		authoredSourceConfig: restore(snapshot.sourceConfig),
		authoredRuntimeConfig: restore(snapshot.runtimeConfig)
	};
}
//#endregion
//#region src/config/io.write-prepare.ts
function prepareConfigWriteValues(params) {
	return prepareProjectedConfigWriteValues(params, projectAuthoredAgentRosterForWrite);
}
const AGENT_ROSTER_PATHS = [["agents", "entries"], ["agents", "list"]];
var DuplicateAgentRosterIdError = class extends Error {
	constructor(agentId) {
		super(`Config write cannot canonicalize duplicate normalized agent id "${agentId}".`);
		this.name = "DuplicateAgentRosterIdError";
	}
};
function assertUniqueNormalizedLegacyRosterIds(value, resolveId = (entry) => entry.id) {
	const normalizedIds = /* @__PURE__ */ new Set();
	for (const [index, entry] of value.entries()) {
		if (!isRecord(entry)) continue;
		const id = resolveId(entry, index);
		if (typeof id !== "string") continue;
		const agentId = normalizeAgentId(id);
		if (normalizedIds.has(agentId)) throw new DuplicateAgentRosterIdError(agentId);
		normalizedIds.add(agentId);
	}
}
function hasOwnValidIncludeDirective(value) {
	if (!isRecord(value) || !Object.hasOwn(value, "$include")) return false;
	const includeValue = value.$include;
	return typeof includeValue === "string" || Array.isArray(includeValue) && includeValue.every((entry) => typeof entry === "string");
}
function collectConfigPaths(value, path, matches, skip) {
	if (skip?.(path)) return [];
	if (matches(value)) return [path];
	if (!Array.isArray(value) && !isRecord(value)) return [];
	return Object.entries(value).flatMap(([key, child]) => collectConfigPaths(child, [...path, key], matches, skip));
}
function collectIncludeOwnedPaths(value, path = []) {
	return collectConfigPaths(value, path, hasOwnValidIncludeDirective);
}
function collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath) {
	const includeValue = getPathValue(rootAuthoredConfig, includePath);
	if (!hasOwnValidIncludeDirective(includeValue)) return [];
	return Object.keys(includeValue).flatMap((key) => key === "$include" || isBlockedObjectKey(key) ? [] : [[...includePath, key]]);
}
function isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path) {
	return collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath).some((siblingPath) => {
		if (!pathStartsWith(path, siblingPath)) return false;
		return !collectIncludeOwnedPaths(getPathValue(rootAuthoredConfig, siblingPath), siblingPath).some((nestedIncludePath) => pathStartsWith(path, nestedIncludePath) || pathStartsWith(nestedIncludePath, path));
	});
}
function findContainingArrayPath(root, path) {
	let current = root;
	const currentPath = [];
	for (const segment of path) {
		if (Array.isArray(current)) return currentPath;
		if (!isRecord(current)) return;
		current = current[segment];
		currentPath.push(segment);
	}
}
function hasChangedEquivalentArraySibling(value, nextValue, index) {
	if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
	return value.some((item, itemIndex) => itemIndex !== index && isDeepStrictEqual(item, value[index]) && !isDeepStrictEqual(nextValue[itemIndex], item));
}
function hasNewEquivalentArraySibling(value, nextValue, index) {
	if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
	const includedValue = value[index];
	if (!isDeepStrictEqual(nextValue[index], includedValue)) return false;
	return nextValue.some((item, itemIndex) => itemIndex !== index && isDeepStrictEqual(item, includedValue) && !isDeepStrictEqual(value[itemIndex], includedValue));
}
function getPathValue(value, path) {
	let current = value;
	for (const segment of path) {
		if (Array.isArray(current)) {
			const index = parseConfigPathArrayIndex(segment);
			if (index === void 0 || index >= current.length) return;
			current = current[index];
			continue;
		}
		if (!isRecord(current)) return;
		current = current[segment];
	}
	return current;
}
function setPathValue(value, path, nextValue, createParents = false) {
	if (path.length === 0) return structuredClone(nextValue);
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	const index = parseConfigPathArrayIndex(head);
	if (Array.isArray(value) || createParents && !isRecord(value) && index !== void 0) {
		if (index === void 0 || !createParents && Array.isArray(value) && index >= value.length) return value;
		const next = Array.isArray(value) ? [...value] : [];
		next[index] = setPathValue(next[index], tail, nextValue, createParents);
		return next;
	}
	if (!createParents && !isRecord(value)) return value;
	const record = isRecord(value) ? value : {};
	return {
		...record,
		[head]: setPathValue(record[head], tail, nextValue, createParents)
	};
}
function pathStartsWith(path, prefix) {
	return prefix.length <= path.length && prefix.every((segment, index) => path[index] === segment);
}
function pathOverlapsAny(path, candidates) {
	return Boolean(candidates?.some((candidate) => pathStartsWith(path, candidate) || pathStartsWith(candidate, path)));
}
function findOverlappingIncludeOwnedPath(rootAuthoredConfig, path) {
	return collectIncludeOwnedPaths(rootAuthoredConfig).find((includePath) => {
		if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
		return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
	});
}
function deletePathValue(value, path) {
	if (path.length === 0) return value;
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseConfigPathArrayIndex(head);
		if (index === void 0 || index >= value.length || tail.length === 0) return value;
		const next = [...value];
		next[index] = deletePathValue(value[index], tail);
		return next;
	}
	if (!isRecord(value) || !Object.hasOwn(value, head)) return value;
	const next = { ...value };
	if (tail.length === 0) {
		delete next[head];
		return next;
	}
	next[head] = deletePathValue(value[head], tail);
	return next;
}
function normalizeTouchedAgentModelMapEntries(params) {
	const touchedMaps = /* @__PURE__ */ new Map();
	const addKey = (path, modelId) => {
		const serialized = path.join("\0");
		const target = touchedMaps.get(serialized) ?? {
			path,
			canonicalKeys: /* @__PURE__ */ new Set()
		};
		target.canonicalKeys.add(normalizeAgentModelRefForConfig(modelId));
		touchedMaps.set(serialized, target);
	};
	const defaultsModelsPatch = getPathValue(params.patch, [
		"agents",
		"defaults",
		"models"
	]);
	if (isRecord(defaultsModelsPatch)) for (const modelId of Object.keys(defaultsModelsPatch)) addKey([
		"agents",
		"defaults",
		"models"
	], modelId);
	const entriesPatch = getPathValue(params.patch, ["agents", "entries"]);
	if (isRecord(entriesPatch)) {
		for (const [agentId, entryPatch] of Object.entries(entriesPatch)) if (isRecord(entryPatch) && isRecord(entryPatch.models)) for (const modelId of Object.keys(entryPatch.models)) addKey([
			"agents",
			"entries",
			agentId,
			"models"
		], modelId);
	}
	const explicitModelMaps = [[
		"agents",
		"defaults",
		"models"
	]];
	const explicitEntries = getPathValue(params.explicitSetValueSource, ["agents", "entries"]);
	if (isRecord(explicitEntries)) for (const agentId of Object.keys(explicitEntries)) explicitModelMaps.push([
		"agents",
		"entries",
		agentId,
		"models"
	]);
	for (const modelMapPath of explicitModelMaps) for (const explicitPath of params.touchedPaths ?? []) {
		if (pathStartsWith(explicitPath, modelMapPath) && explicitPath.length > modelMapPath.length) {
			const modelId = explicitPath[modelMapPath.length];
			if (modelId) addKey(modelMapPath, modelId);
			continue;
		}
		if (!pathStartsWith(explicitPath, modelMapPath) && !pathStartsWith(modelMapPath, explicitPath)) continue;
		const explicitModels = getPathValue(params.explicitSetValueSource, modelMapPath);
		if (!isRecord(explicitModels)) continue;
		for (const modelId of Object.keys(explicitModels)) addKey(modelMapPath, modelId);
	}
	let next = params.projectedSource;
	for (const { path, canonicalKeys } of touchedMaps.values()) {
		const models = getPathValue(next, path);
		if (!isRecord(models)) continue;
		const touchedEntries = [];
		const untouchedEntries = [];
		let hasRetiredTouchedKey = false;
		for (const [modelId, entry] of Object.entries(models)) {
			const normalizedModelId = normalizeAgentModelRefForConfig(modelId);
			if (!canonicalKeys.has(normalizedModelId)) {
				untouchedEntries.push([modelId, entry]);
				continue;
			}
			touchedEntries.push([modelId, entry]);
			hasRetiredTouchedKey ||= normalizedModelId !== modelId;
		}
		if (hasRetiredTouchedKey) {
			const normalizedTouchedEntries = normalizeAgentModelMapForConfig(Object.fromEntries(touchedEntries));
			next = setPathValue(next, path, Object.fromEntries([...untouchedEntries, ...Object.entries(normalizedTouchedEntries)]));
		}
	}
	return next;
}
function preserveSourceValueAtPath(params) {
	if (pathOverlapsAny(params.path, params.unsetPaths)) return params.persistedCandidate;
	if (findOverlappingIncludeOwnedPath(params.rootAuthoredConfig, params.path)) return params.persistedCandidate;
	if (getPathValue(params.nextConfig, params.path) !== void 0) return params.persistedCandidate;
	const sourceValue = params.sourceValue ?? getPathValue(params.sourceConfig, params.path);
	if (sourceValue === void 0 || getPathValue(params.persistedCandidate, params.path) !== void 0) return params.persistedCandidate;
	return setPathValue(params.persistedCandidate, params.path, sourceValue, true);
}
function preserveAuthoredAgentParams(params) {
	const defaults = getPathValue(params.sourceConfig, ["agents", "defaults"]);
	if (!isRecord(defaults)) return params.persistedCandidate;
	let next = params.persistedCandidate;
	if (Object.hasOwn(defaults, "params")) next = preserveSourceValueAtPath({
		...params,
		persistedCandidate: next,
		path: [
			"agents",
			"defaults",
			"params"
		],
		sourceValue: defaults.params
	});
	const models = defaults.models;
	if (!isRecord(models)) return next;
	const nextModels = getPathValue(params.nextConfig, [
		"agents",
		"defaults",
		"models"
	]);
	for (const [modelId, modelEntry] of Object.entries(models)) {
		if (!isRecord(modelEntry) || !Object.hasOwn(modelEntry, "params")) continue;
		const modelPath = [
			"agents",
			"defaults",
			"models",
			normalizeAgentModelRefForConfig(modelId) || modelId
		];
		const normalizedModelId = modelPath.at(-1);
		if (isRecord(nextModels) && normalizedModelId && !Object.hasOwn(nextModels, normalizedModelId)) continue;
		const preserveModel = getPathValue(next, modelPath) === void 0;
		next = preserveSourceValueAtPath({
			...params,
			persistedCandidate: next,
			path: preserveModel ? modelPath : [...modelPath, "params"],
			sourceValue: preserveModel ? modelEntry : modelEntry.params
		});
	}
	return next;
}
function isRootOwnedArray(authored, baseline, sourceBeforeMigrations) {
	return (authored === void 0 || Array.isArray(authored)) && collectIncludeOwnedPaths(authored).length === 0 && (Array.isArray(sourceBeforeMigrations) ? (authored?.length ?? 0) === sourceBeforeMigrations.length : Array.isArray(authored) && isDeepStrictEqual(authored, baseline));
}
function projectRootAuthoredIncludeSibling(params) {
	if (params.nextPresent && params.baselinePresent && isDeepStrictEqual(params.next, params.baseline)) return {
		ok: true,
		present: true,
		value: structuredClone(params.authored)
	};
	if (!params.nextPresent) return collectIncludeOwnedPaths(params.authored).length > 0 ? { ok: false } : {
		ok: true,
		present: false
	};
	if (!params.baselinePresent) return {
		ok: true,
		present: true,
		value: structuredClone(params.next)
	};
	if (hasOwnValidIncludeDirective(params.authored)) return { ok: false };
	if (Array.isArray(params.authored)) return (Array.isArray(params.next) ? isRootOwnedArray(params.authored, params.baseline, params.sourceBeforeMigrations) : collectIncludeOwnedPaths(params.authored).length === 0) ? {
		ok: true,
		present: true,
		value: structuredClone(params.next)
	} : { ok: false };
	if (!isRecord(params.authored)) return {
		ok: true,
		present: true,
		value: structuredClone(params.next)
	};
	if (!isRecord(params.next)) return collectIncludeOwnedPaths(params.authored).length > 0 ? { ok: false } : {
		ok: true,
		present: true,
		value: structuredClone(params.next)
	};
	if (!isRecord(params.baseline)) return {
		ok: true,
		present: true,
		value: structuredClone(params.next)
	};
	const value = structuredClone(params.authored);
	const keys = /* @__PURE__ */ new Set([
		...Object.keys(params.authored),
		...Object.keys(params.baseline),
		...Object.keys(params.next)
	]);
	for (const key of keys) {
		if (isBlockedObjectKey(key)) continue;
		const authoredPresent = Object.hasOwn(params.authored, key);
		const baselinePresent = Object.hasOwn(params.baseline, key);
		const nextPresent = Object.hasOwn(params.next, key);
		if (!authoredPresent) {
			if (baselinePresent && nextPresent && isDeepStrictEqual(params.baseline[key], params.next[key])) continue;
			if (!nextPresent) return { ok: false };
			if (baselinePresent && Array.isArray(params.baseline[key]) && Array.isArray(params.next[key])) return { ok: false };
		}
		const projected = projectRootAuthoredIncludeSibling({
			authored: authoredPresent ? params.authored[key] : {},
			baseline: params.baseline[key],
			sourceBeforeMigrations: getPathValue(params.sourceBeforeMigrations, [key]),
			next: params.next[key],
			baselinePresent,
			nextPresent
		});
		if (!projected.ok) return projected;
		if (projected.present) value[key] = projected.value;
		else delete value[key];
	}
	return {
		ok: true,
		present: true,
		value
	};
}
function includeOwnershipError(rootAuthoredConfig, includePath) {
	const directive = getPathValue(rootAuthoredConfig, [...includePath, "$include"]);
	const includeTargets = (Array.isArray(directive) ? directive : [directive]).filter((entry) => typeof entry === "string");
	return createConfigIncludeOwnershipError({
		ownedConfigPath: includePath.length > 0 ? includePath.join(".") : "<root>",
		...includeTargets.length > 0 ? { includeTargets } : {}
	});
}
function preserveUntouchedIncludes(params) {
	let next = params.persistedCandidate;
	for (const includePath of collectIncludeOwnedPaths(params.rootAuthoredConfig)) {
		const containingArrayPath = findContainingArrayPath(params.rootAuthoredConfig, includePath);
		const includeIsArrayEntry = containingArrayPath !== void 0 && includePath.length === containingArrayPath.length + 1;
		const comparisonPath = includeIsArrayEntry ? includePath : containingArrayPath ?? includePath;
		const mutableSiblingPaths = collectMutableSiblingPathsAtInclude(params.rootAuthoredConfig, includePath);
		const relativeMutableSiblingPaths = mutableSiblingPaths.map((path) => path.slice(comparisonPath.length));
		const omitMutableSiblingValues = (value) => relativeMutableSiblingPaths.reduce((current, path) => deletePathValue(current, path), value);
		const nextValue = omitMutableSiblingValues(getPathValue(params.nextConfig, comparisonPath));
		const sourceValue = omitMutableSiblingValues(getPathValue(params.sourceConfig, comparisonPath));
		const runtimeValue = omitMutableSiblingValues(getPathValue(params.runtimeConfig, comparisonPath));
		if (!isDeepStrictEqual(nextValue, sourceValue) && !isDeepStrictEqual(nextValue, runtimeValue)) throw includeOwnershipError(params.rootAuthoredConfig, includePath);
		if (includeIsArrayEntry) {
			const index = parseConfigPathArrayIndex(includePath.at(-1) ?? "");
			const nextArray = getPathValue(params.nextConfig, containingArrayPath);
			const sourceArray = getPathValue(params.sourceConfig, containingArrayPath);
			const runtimeArray = getPathValue(params.runtimeConfig, containingArrayPath);
			if (index !== void 0 && (hasChangedEquivalentArraySibling(sourceArray, nextArray, index) || hasChangedEquivalentArraySibling(runtimeArray, nextArray, index) || hasNewEquivalentArraySibling(sourceArray, nextArray, index) || hasNewEquivalentArraySibling(runtimeArray, nextArray, index))) throw includeOwnershipError(params.rootAuthoredConfig, includePath);
		}
		let authoredIncludeValue = getPathValue(params.rootAuthoredConfig, includePath);
		for (const siblingPath of mutableSiblingPaths) {
			const relativeSiblingPath = siblingPath.slice(includePath.length);
			const nextPresent = hasPathValue(params.persistedCandidate, siblingPath);
			const projectAgainst = (baselineConfig) => projectRootAuthoredIncludeSibling({
				authored: getPathValue(params.rootAuthoredConfig, siblingPath),
				baseline: getPathValue(baselineConfig, siblingPath),
				sourceBeforeMigrations: getPathValue(params.sourceConfigBeforeMigrations, siblingPath),
				next: getPathValue(params.persistedCandidate, siblingPath),
				baselinePresent: hasPathValue(baselineConfig, siblingPath),
				nextPresent
			});
			const sourceProjection = projectAgainst(params.sourceConfig);
			const projection = sourceProjection.ok ? sourceProjection : projectAgainst(params.runtimeConfig);
			if (!projection.ok) throw includeOwnershipError(params.rootAuthoredConfig, includePath);
			authoredIncludeValue = projection.present ? setPathValue(authoredIncludeValue, relativeSiblingPath, projection.value) : deletePathValue(authoredIncludeValue, relativeSiblingPath);
		}
		next = setPathValue(next, includePath, authoredIncludeValue);
	}
	return next;
}
function hasPathValue(value, path) {
	let nextValue = value;
	for (const segment of path) if (Array.isArray(nextValue)) {
		const index = parseConfigPathArrayIndex(segment);
		if (index === void 0 || index >= nextValue.length) return false;
		nextValue = nextValue[index];
	} else if (isRecord(nextValue) && !isBlockedObjectKey(segment) && Object.hasOwn(nextValue, segment)) nextValue = nextValue[segment];
	else return false;
	return true;
}
function mergeMissingExplicitValues(currentValue, explicitValue) {
	if (hasOwnValidIncludeDirective(currentValue)) return currentValue;
	if (!(isRecord(currentValue) && isRecord(explicitValue)) && !(Array.isArray(currentValue) && Array.isArray(explicitValue))) return currentValue;
	let changed = false;
	const next = Array.isArray(currentValue) ? [...currentValue] : { ...currentValue };
	for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
		if (Array.isArray(next) ? parseConfigPathArrayIndex(key) === void 0 : isBlockedObjectKey(key)) continue;
		const missing = Array.isArray(next) ? Number(key) >= next.length || next[Number(key)] === void 0 : !Object.hasOwn(next, key);
		const currentChild = missing ? void 0 : Reflect.get(next, key);
		const childMerged = missing ? structuredClone(childExplicitValue) : mergeMissingExplicitValues(currentChild, childExplicitValue);
		if (missing || !Object.is(childMerged, currentChild)) {
			Reflect.set(next, key, childMerged);
			changed = true;
		}
	}
	return changed ? next : currentValue;
}
function injectExplicitlySetPaths(params) {
	if (!params.explicitSetPaths || params.explicitSetPaths.length === 0) return params.persistedCandidate;
	const includePaths = collectIncludeOwnedPaths(params.rootAuthoredConfig);
	let next = params.persistedCandidate;
	explicitPath: for (const path of params.explicitSetPaths) {
		if (path.length === 0 || path.some(isBlockedObjectKey)) continue;
		const includeOwnedPath = params.rootAuthoredConfig ? findOverlappingIncludeOwnedPath(params.rootAuthoredConfig, [...path]) : void 0;
		const preserveDescendantInclude = includeOwnedPath && params.preserveDescendantIncludes === true && includeOwnedPath.length > path.length && pathStartsWith(includeOwnedPath, path);
		const allowIncludeAncestorOverride = includeOwnedPath !== void 0 && includeOwnedPath.length < path.length && pathStartsWith(path, includeOwnedPath) && params.allowIncludeAncestorExplicitSetPaths === true;
		if (includeOwnedPath && !preserveDescendantInclude && !allowIncludeAncestorOverride) throw includeOwnershipError(params.rootAuthoredConfig, includeOwnedPath);
		let nextValue = getPathValue(params.valueSource, path);
		if (nextValue === void 0) continue;
		const arrayPaths = includePaths.length > 0 ? [...path.flatMap((_, index) => {
			const parent = path.slice(0, index);
			return Array.isArray(getPathValue(params.valueSource, parent)) ? [parent] : [];
		}), ...collectConfigPaths(nextValue, [...path], Array.isArray, (candidatePath) => hasOwnValidIncludeDirective(getPathValue(next, candidatePath)))] : [];
		for (const arrayPath of arrayPaths) {
			const owner = includePaths.find((includePath) => pathStartsWith(arrayPath, includePath));
			if (owner && !isRootOwnedArray(getPathValue(params.rootAuthoredConfig, arrayPath), getPathValue(params.sourceConfig, arrayPath), getPathValue(params.sourceConfigBeforeMigrations, arrayPath))) {
				const valuePath = arrayPath.length < path.length ? path : arrayPath;
				const requested = getPathValue(params.valueSource, valuePath);
				if (!isDeepStrictEqual(requested, getPathValue(params.sourceConfig, valuePath)) && !isDeepStrictEqual(requested, getPathValue(params.runtimeConfig, valuePath))) throw includeOwnershipError(params.rootAuthoredConfig, owner);
				if (arrayPath.length <= path.length) continue explicitPath;
				const retained = getPathValue(next, arrayPath);
				const relativePath = arrayPath.slice(path.length);
				nextValue = retained === void 0 ? deletePathValue(nextValue, relativePath) : setPathValue(nextValue, relativePath, retained);
			}
		}
		if (!hasPathValue(next, path)) {
			next = setPathValue(next, path, nextValue, true);
			continue;
		}
		const currentValue = getPathValue(next, path);
		const merged = mergeMissingExplicitValues(currentValue, nextValue);
		if (!Object.is(merged, currentValue)) next = setPathValue(next, path, merged);
	}
	return next;
}
function pathTouchesAgentRoster(path) {
	return AGENT_ROSTER_PATHS.some((rosterPath) => pathStartsWith(path, rosterPath) || pathStartsWith(rosterPath, path));
}
function pathTargetsAgentRoster(path) {
	return AGENT_ROSTER_PATHS.some((rosterPath) => pathStartsWith(path, rosterPath));
}
function hasOnlyPreparedKeyedAgentEntryRosterIncludes(rootAuthoredConfig, preparedIncludePaths) {
	const authoredEntries = getPathValue(rootAuthoredConfig, ["agents", "entries"]);
	if (!isRecord(authoredEntries) || !preparedIncludePaths || preparedIncludePaths.length === 0) return false;
	const rosterIncludePaths = collectIncludeOwnedPaths(rootAuthoredConfig).filter((path) => pathTouchesAgentRoster(path));
	return rosterIncludePaths.length > 0 && rosterIncludePaths.every((path) => path.length === 3 && path[0] === "agents" && path[1] === "entries" && preparedIncludePaths.some((prepared) => prepared.length === path.length && path.every((segment, index) => segment === prepared[index]))) && preparedIncludePaths.length === rosterIncludePaths.length;
}
function canCanonicalizeAgentRoster(value) {
	const roster = readAgentRosterProperty(value);
	if (!roster) return false;
	if (roster.kind === "list") {
		if (!Array.isArray(roster.value) || !roster.value.every((entry) => isRecord(entry) && typeof entry.id === "string")) return false;
		assertUniqueNormalizedLegacyRosterIds(roster.value);
		return true;
	}
	return isRecord(roster.value) && Object.values(roster.value).every(isRecord);
}
function shouldPersistCanonicalAgentRoster(params) {
	if (!canCanonicalizeAgentRoster(params.nextConfig)) return false;
	if (params.persistCanonicalAgentRoster === true || params.explicitSetPaths?.some(pathTouchesAgentRoster) || params.unsetPaths?.some(pathTouchesAgentRoster)) return true;
	const runtimeRoster = toAgentEntriesRecord(listAgentEntries(params.runtimeConfig));
	const sourceRoster = toAgentEntriesRecord(listAgentEntries(params.sourceConfig));
	const nextRoster = toAgentEntriesRecord(listAgentEntries(params.nextConfig));
	return !isDeepStrictEqual(runtimeRoster, nextRoster) && !isDeepStrictEqual(sourceRoster, nextRoster);
}
function assertCanonicalAgentRosterRetainsEntries(params) {
	const allowedRemovals = new Set((params.allowedRemovals ?? []).map((agentId) => normalizeAgentId(agentId)));
	const canonicalIds = new Set(listAgentEntries(params.canonicalConfig).map((entry) => normalizeAgentId(entry.id)));
	const currentRoster = readAgentRosterProperty(params.currentConfig);
	const droppedIds = (currentRoster?.kind === "list" && Array.isArray(currentRoster.value) ? projectLegacyAgentRosterEntries(currentRoster.value).entries : listAgentEntries(params.currentConfig)).filter((entry) => {
		const agentId = normalizeAgentId(entry.id);
		return !canonicalIds.has(agentId) && !allowedRemovals.has(agentId);
	}).map((entry) => entry.id).toSorted();
	if (droppedIds.length === 0) return;
	throw new Error(`Config write would drop agent roster entries without an explicit deletion: ${droppedIds.join(", ")}.`);
}
function containsAuthoredRosterReference(value, includeEnvStrings) {
	if (typeof value === "string") return includeEnvStrings && containsEnvVarReference(value);
	if (Array.isArray(value)) return value.some((entry) => containsAuthoredRosterReference(entry, includeEnvStrings));
	if (!isRecord(value)) return false;
	return isSecretRefShape(value) || Object.values(value).some((entry) => containsAuthoredRosterReference(entry, includeEnvStrings));
}
function indexAgentRosterSourcePaths(config, legacyIdsByIndex) {
	return new Map(listAgentEntriesWithSource(config).flatMap(({ entry, source }) => {
		const id = source.kind === "list" ? legacyIdsByIndex.get(source.index) : entry.id;
		return id === void 0 ? [] : [[normalizeAgentId(id), source.kind === "list" ? `agents.list[${source.index}]` : appendConfigPathSegment("agents.entries", source.key)]];
	}));
}
function readRosterChild(value, key) {
	if (key === void 0) return {
		value: void 0,
		present: false
	};
	if (typeof key === "number") {
		const array = Array.isArray(value) ? value : [];
		return {
			value: array[key],
			present: key < array.length
		};
	}
	const record = isRecord(value) ? value : {};
	return {
		value: record[key],
		present: Object.hasOwn(record, key)
	};
}
function projectAuthoredRosterValue(params) {
	const explicitlySet = params.explicitPaths.some((path) => pathStartsWith(params.path, path));
	if (isRecord(params.next)) {
		const value = {};
		for (const [key, nextValue] of Object.entries(params.next)) {
			if (isBlockedObjectKey(key)) continue;
			value[key] = projectAuthoredRosterValue({
				authored: readRosterChild(params.authored.value, key),
				explicit: readRosterChild(params.explicit.value, key),
				explicitPaths: params.explicitPaths,
				path: [...params.path, key],
				runtime: readRosterChild(params.runtime.value, key),
				source: readRosterChild(params.source.value, key),
				next: nextValue
			});
		}
		return value;
	}
	if (Array.isArray(params.next)) {
		if (explicitlySet && params.explicit.present && Array.isArray(params.explicit.value)) return structuredClone(params.explicit.value);
		const runtime = Array.isArray(params.runtime.value) ? params.runtime.value : [];
		const source = Array.isArray(params.source.value) ? params.source.value : [];
		const usedRuntimeIndexes = /* @__PURE__ */ new Set();
		const usedSourceIndexes = /* @__PURE__ */ new Set();
		const claimMatchingIndex = (values, used, nextValue, preferredIndex) => {
			if (preferredIndex < values.length && !used.has(preferredIndex) && isDeepStrictEqual(values[preferredIndex], nextValue)) {
				used.add(preferredIndex);
				return preferredIndex;
			}
			const index = values.findIndex((value, candidate) => !used.has(candidate) && isDeepStrictEqual(value, nextValue));
			if (index < 0) return;
			used.add(index);
			return index;
		};
		return params.next.map((nextValue, index) => {
			const runtimeIndex = claimMatchingIndex(runtime, usedRuntimeIndexes, nextValue, index);
			const sourceIndex = claimMatchingIndex(source, usedSourceIndexes, nextValue, index);
			const fallbackIndexAvailable = !usedRuntimeIndexes.has(index) && !usedSourceIndexes.has(index);
			const authoredIndex = runtimeIndex ?? sourceIndex ?? (fallbackIndexAvailable ? index : void 0);
			return projectAuthoredRosterValue({
				authored: readRosterChild(params.authored.value, authoredIndex),
				explicit: readRosterChild(params.explicit.value, index),
				explicitPaths: params.explicitPaths,
				path: [...params.path, String(index)],
				runtime: readRosterChild(runtime, runtimeIndex ?? (fallbackIndexAvailable ? index : void 0)),
				source: readRosterChild(source, sourceIndex ?? (fallbackIndexAvailable ? index : void 0)),
				next: nextValue
			});
		});
	}
	if (explicitlySet && params.explicit.present) return structuredClone(params.explicit.value);
	const unchangedFromRuntime = params.runtime.present && isDeepStrictEqual(params.runtime.value, params.next);
	const unchangedFromSource = params.source.present && isDeepStrictEqual(params.source.value, params.next);
	return structuredClone(params.authored.present && (unchangedFromRuntime || unchangedFromSource) ? params.authored.value : params.next);
}
function readLegacyAgentList(config) {
	const roster = readAgentRosterProperty(config);
	return roster?.kind === "list" && Array.isArray(roster.value) ? roster.value : void 0;
}
function indexAgentRosterForWrite(config, legacyIdsByIndex) {
	const list = readLegacyAgentList(config);
	if (!list) return toAgentEntriesRecord(listAgentEntries(config));
	return Object.fromEntries(list.flatMap((entry, index) => {
		const id = legacyIdsByIndex.get(index);
		if (!isRecord(entry) || id === void 0) return [];
		const { id: _legacyId, ...value } = entry;
		return [[id, value]];
	}));
}
function canonicalizeAgentRosterForExplicitWrite(params) {
	const authoredList = readLegacyAgentList(params.rootAuthoredConfig);
	const resolvedLegacyList = readLegacyAgentList(params.sourceConfigBeforeMigrations);
	const legacyIdsByIndex = new Map(projectLegacyAgentRosterEntries(resolvedLegacyList ?? authoredList ?? []).entries.map(({ sourceIndex, id }) => [sourceIndex, id]));
	const authoredEntries = indexAgentRosterForWrite(params.rootAuthoredConfig, legacyIdsByIndex);
	const runtimeEntries = indexAgentRosterForWrite(params.runtimeConfig, legacyIdsByIndex);
	const sourceEntries = indexAgentRosterForWrite(params.sourceConfig, legacyIdsByIndex);
	const nextEntries = toAgentEntriesRecord(listAgentEntries(params.nextConfig));
	const explicitList = readLegacyAgentList(params.valueSource);
	const rosterFactOwner = coerceConfig(params.sourceConfigBeforeMigrations ?? params.rootAuthoredConfig);
	const sourcePathsByAgentId = indexAgentRosterSourcePaths(rosterFactOwner, legacyIdsByIndex);
	const resolutionEvaluated = getConfigResolutionFacts(rosterFactOwner) !== null;
	const renamedLegacyIndexes = new Set((params.explicitSetPaths ?? []).flatMap((path) => {
		if (path[0] !== "agents" || path[1] !== "list" || path.length !== 4 || path[3] !== "id") return [];
		const index = parseConfigPathArrayIndex(path[2] ?? "");
		return index === void 0 ? [] : [index];
	}));
	const structurallyExplicitLegacyIndexes = new Set(renamedLegacyIndexes);
	for (const path of params.explicitSetPaths ?? []) {
		if (path[0] !== "agents" || path[1] !== "list") continue;
		if (path.length === 2 && explicitList) {
			explicitList.forEach((_entry, index) => structurallyExplicitLegacyIndexes.add(index));
			continue;
		}
		if (path.length === 3) {
			const index = parseConfigPathArrayIndex(path[2] ?? "");
			if (index !== void 0) structurallyExplicitLegacyIndexes.add(index);
		}
	}
	for (const index of renamedLegacyIndexes) {
		const entry = explicitList ? explicitList[index] : void 0;
		if (isRecord(entry) && typeof entry.id === "string" && (hasUnresolvedConfigPath(rosterFactOwner, `agents.list[${index}].id`) || !resolutionEvaluated && containsEnvVarReference(entry.id))) throw new Error("Config write cannot safely resolve an env-backed renamed agent id; set the resolved literal id or rename the authored entry directly.");
	}
	const resolveExplicitLegacyEntryId = (entry, index) => {
		const explicitId = entry.id;
		if (typeof explicitId !== "string") return;
		if (renamedLegacyIndexes.has(index) || Object.hasOwn(nextEntries, explicitId)) return explicitId;
		if (authoredList) {
			const authoredIndex = authoredList.findIndex((authoredEntry) => isRecord(authoredEntry) && authoredEntry.id === explicitId);
			const resolvedEntry = authoredIndex < 0 ? void 0 : resolvedLegacyList?.[authoredIndex];
			if (isRecord(resolvedEntry) && typeof resolvedEntry.id === "string") return resolvedEntry.id;
		}
		return hasUnresolvedConfigPath(rosterFactOwner, `agents.list[${index}].id`) || containsEnvVarReference(explicitId) ? void 0 : explicitId;
	};
	if (explicitList) assertUniqueNormalizedLegacyRosterIds(explicitList, resolveExplicitLegacyEntryId);
	const explicitEntries = explicitList ? Object.fromEntries(explicitList.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const id = structurallyExplicitLegacyIndexes.has(index) ? resolveExplicitLegacyEntryId(entry, index) : legacyIdsByIndex.get(index) ?? entry.id;
		if (typeof id !== "string") {
			if (structurallyExplicitLegacyIndexes.has(index) && typeof entry.id === "string") throw new Error(`Config write cannot safely resolve an explicitly replaced agent list slot for id "${entry.id}"; use a resolved literal id before writing the roster.`);
			return [];
		}
		const { id: _explicitId, ...config } = entry;
		return [[id, config]];
	})) : toAgentEntriesRecord(listAgentEntries(params.valueSource));
	const explicitPaths = (params.explicitSetPaths ?? []).flatMap((path) => {
		if (path[0] !== "agents") return [];
		if (path.length === 1) return [[]];
		if (path[1] === "entries") return [path.slice(2)];
		if (path[1] !== "list") return [];
		if (path.length === 2) return [[]];
		const index = parseConfigPathArrayIndex(path[2] ?? "");
		const explicitEntry = explicitList && index !== void 0 ? explicitList[index] : void 0;
		const id = index !== void 0 && (renamedLegacyIndexes.has(index) || path.length === 3 && structurallyExplicitLegacyIndexes.has(index)) && isRecord(explicitEntry) ? explicitEntry.id : index === void 0 ? void 0 : legacyIdsByIndex.get(index);
		return typeof id === "string" ? [[id, ...path.slice(3)]] : [];
	});
	const entryIdentityByNextId = /* @__PURE__ */ new Map();
	for (const id of Object.keys(nextEntries)) if (Object.hasOwn(runtimeEntries, id) || Object.hasOwn(sourceEntries, id)) entryIdentityByNextId.set(id, id);
	if (authoredList && explicitList) for (const index of renamedLegacyIndexes) {
		const explicitEntry = explicitList[index];
		const oldId = legacyIdsByIndex.get(index);
		const nextId = isRecord(explicitEntry) ? explicitEntry.id : void 0;
		if (typeof oldId === "string" && typeof nextId === "string") entryIdentityByNextId.set(nextId, oldId);
	}
	const priorIds = /* @__PURE__ */ new Set([...Object.keys(runtimeEntries), ...Object.keys(sourceEntries)]);
	const removedIds = [...priorIds].filter((id) => !Object.hasOwn(nextEntries, id));
	const addedIds = Object.keys(nextEntries).filter((id) => !priorIds.has(id));
	const claimedPriorIds = new Set(entryIdentityByNextId.values());
	for (const nextId of addedIds) {
		if (entryIdentityByNextId.has(nextId)) continue;
		const candidates = removedIds.filter((oldId) => !claimedPriorIds.has(oldId) && (isDeepStrictEqual(nextEntries[nextId], runtimeEntries[oldId]) || isDeepStrictEqual(nextEntries[nextId], sourceEntries[oldId])));
		if (candidates.length === 1) {
			const oldId = candidates[0];
			entryIdentityByNextId.set(nextId, oldId);
			claimedPriorIds.add(oldId);
		}
	}
	const ambiguousAddedIds = addedIds.filter((id) => !entryIdentityByNextId.has(id));
	const ambiguousRemovedIds = removedIds.filter((id) => !claimedPriorIds.has(id));
	if (ambiguousAddedIds.length > 0 && ambiguousRemovedIds.some((id) => {
		const sourcePath = sourcePathsByAgentId.get(normalizeAgentId(id));
		return containsAuthoredRosterReference(authoredEntries[id], !resolutionEvaluated) || Boolean(sourcePath && hasUnresolvedConfigPathInSubtree(rosterFactOwner, sourcePath));
	})) throw new Error("Config write cannot safely match renamed agent entries with authored references; rename agents one at a time.");
	let entries = Object.fromEntries(Object.entries(nextEntries).map(([id, nextEntry]) => {
		const priorId = entryIdentityByNextId.get(id) ?? id;
		const value = projectAuthoredRosterValue({
			authored: readRosterChild(authoredEntries, priorId),
			explicit: readRosterChild(explicitEntries, id),
			explicitPaths,
			path: [id],
			runtime: readRosterChild(runtimeEntries, priorId),
			source: readRosterChild(sourceEntries, priorId),
			next: nextEntry
		});
		if (isRecord(value) && isRecord(nextEntry)) {
			if (Object.hasOwn(nextEntry, "default")) {
				const sourcePath = sourcePathsByAgentId.get(normalizeAgentId(priorId));
				if (!(Object.hasOwn(value, "default") && (containsAuthoredRosterReference(value.default, !resolutionEvaluated) || Boolean(sourcePath && hasUnresolvedConfigPathInSubtree(rosterFactOwner, `${sourcePath}.default`))) && (Object.hasOwn(runtimeEntries, priorId) && isRecord(runtimeEntries[priorId]) && isDeepStrictEqual(runtimeEntries[priorId].default, nextEntry.default) || Object.hasOwn(sourceEntries, priorId) && isRecord(sourceEntries[priorId]) && isDeepStrictEqual(sourceEntries[priorId].default, nextEntry.default)))) value.default = structuredClone(nextEntry.default);
			} else delete value.default;
		}
		return [id, value];
	}));
	if (authoredList) {
		const nextIdByPriorId = new Map([...entryIdentityByNextId].map(([nextId, priorId]) => [priorId, nextId]));
		const resolveExplicitLegacyIdCandidate = (index) => {
			if (!explicitList) return;
			const explicitEntry = explicitList[index];
			if (!isRecord(explicitEntry)) return;
			const id = resolveExplicitLegacyEntryId(explicitEntry, index);
			return id === void 0 ? void 0 : normalizeAgentId(id);
		};
		const resolveExplicitLegacyId = (index) => {
			const resolvedId = resolveExplicitLegacyIdCandidate(index);
			if (!resolvedId || !explicitList) throw new Error("Config write cannot safely resolve an explicitly replaced agent list slot for unset.");
			for (const [candidateIndex] of explicitList.entries()) {
				if (candidateIndex === index) continue;
				const candidateId = resolveExplicitLegacyIdCandidate(candidateIndex);
				if (!candidateId) throw new Error("Config write cannot safely resolve every explicit agent id across an indexed list unset.");
				if (candidateId === resolvedId) throw new Error("Config write cannot safely resolve duplicate agent ids across an indexed list unset.");
			}
			return resolvedId;
		};
		for (const unsetPath of params.unsetPaths ?? []) {
			if (unsetPath[0] !== "agents" || unsetPath[1] !== "list") continue;
			if (unsetPath.length === 2) {
				entries = void 0;
				break;
			}
			if (unsetPath.length === 4 && unsetPath[3] === "id") throw new Error("Config write cannot unset an agent id; delete the complete roster entry instead.");
			const index = parseConfigPathArrayIndex(unsetPath[2] ?? "");
			const explicitResolvedId = index !== void 0 && structurallyExplicitLegacyIndexes.has(index) && index !== void 0 ? resolveExplicitLegacyId(index) : void 0;
			const id = explicitResolvedId !== void 0 ? explicitResolvedId : index === void 0 ? void 0 : legacyIdsByIndex.get(index);
			if (typeof id !== "string") continue;
			const targetId = explicitResolvedId !== void 0 ? id : nextIdByPriorId.get(id) ?? id;
			entries = deletePathValue(entries, [targetId, ...unsetPath.slice(3)]);
		}
	}
	const withoutLegacyList = deletePathValue(params.valueSource, ["agents", "list"]);
	return entries === void 0 ? deletePathValue(withoutLegacyList, ["agents", "entries"]) : setPathValue(withoutLegacyList, ["agents", "entries"], entries, true);
}
function restoreAuthoredAgentRoster(value, rootAuthoredConfig) {
	const roster = readAgentRosterProperty(rootAuthoredConfig);
	let next = deletePathValue(value, ["agents", roster?.kind === "entries" ? "list" : "entries"]);
	if (roster) return setPathValue(next, ["agents", roster.kind], roster.value, true);
	next = deletePathValue(next, ["agents", "list"]);
	return !hasPathValue(rootAuthoredConfig, ["agents"]) && isDeepStrictEqual(getPathValue(next, ["agents"]), {}) ? deletePathValue(next, ["agents"]) : next;
}
function projectAuthoredAgentRosterForWrite(params) {
	const authoredList = readLegacyAgentList(params.rootAuthoredConfig);
	if (!authoredList) return params.rootAuthoredConfig;
	const resolvedLegacyList = readLegacyAgentList(params.sourceConfigBeforeMigrations);
	if (collectIncludeOwnedPaths(authoredList).length > 0 && !parseLegacyAgentRoster(resolvedLegacyList ?? authoredList)) throw new Error("Config write cannot safely match $include-owned legacy agent entries; repair their ids in the authored config first.");
	const legacyIdsByIndex = new Map(projectLegacyAgentRosterEntries(resolvedLegacyList ?? authoredList).entries.map(({ sourceIndex, id }) => [sourceIndex, id]));
	const entries = indexAgentRosterForWrite(params.rootAuthoredConfig, legacyIdsByIndex);
	return setPathValue(deletePathValue(deletePathValue(params.rootAuthoredConfig, ["agents", "list"]), ["agents", "entries"]), ["agents", "entries"], entries, true);
}
function projectConfigWriteSource(params) {
	const inputBasis = params.inputBasis ?? {
		kind: "runtime",
		config: params.runtimeConfig
	};
	if (inputBasis.kind === "source") return structuredClone(params.nextConfig);
	const patch = createMergePatch(inputBasis.config, params.nextConfig);
	const projectedSource = normalizeTouchedAgentModelMapEntries({
		projectedSource: params.sourceConfig,
		patch,
		touchedPaths: [...params.explicitSetPaths ?? [], ...params.unsetPaths ?? []],
		explicitSetValueSource: params.explicitSetValueSource ?? params.nextConfig
	});
	return projectRuntimeChangesOntoSource(projectedSource, inputBasis.config, params.nextConfig);
}
function resolvePersistCandidateForWrite(params) {
	const inputBasis = params.inputBasis ?? {
		kind: "runtime",
		config: params.runtimeConfig
	};
	const rootAuthoredConfig = params.rootAuthoredConfig ?? params.sourceConfig;
	const wantsCanonicalRoster = shouldPersistCanonicalAgentRoster(params);
	const includeOwnsRoster = wantsCanonicalRoster && configIncludeOwnsAgentRosterValues({
		parsed: rootAuthoredConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations ?? params.sourceConfig,
		includeContributesRoster: params.agentRosterIncludeOwned
	});
	const preserveKeyedEntryIncludes = includeOwnsRoster && hasOnlyPreparedKeyedAgentEntryRosterIncludes(rootAuthoredConfig, params.keyedAgentEntryIncludePaths);
	if (includeOwnsRoster && !preserveKeyedEntryIncludes) throw createConfigIncludeOwnershipError({ ownedConfigPath: "agents" });
	const persistCanonicalRoster = wantsCanonicalRoster && !preserveKeyedEntryIncludes;
	const projectedAuthoredRoster = persistCanonicalRoster ? projectAuthoredAgentRosterForWrite({
		rootAuthoredConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations
	}) : rootAuthoredConfig;
	const includeProjectionSourceBeforeMigrations = persistCanonicalRoster ? projectAuthoredAgentRosterForWrite({ rootAuthoredConfig: params.sourceConfigBeforeMigrations }) : params.sourceConfigBeforeMigrations;
	const includeProjectionRootAuthoredConfig = persistCanonicalRoster && !hasAgentRosterProperty(projectedAuthoredRoster) ? setPathValue(projectedAuthoredRoster, ["agents", "entries"], toAgentEntriesRecord(listAgentEntries(params.sourceConfig)), true) : projectedAuthoredRoster;
	const explicitSetPaths = persistCanonicalRoster ? params.explicitSetPaths?.filter((path) => !pathTargetsAgentRoster(path)) : preserveKeyedEntryIncludes ? (params.explicitSetPaths ?? []).filter((path) => findOverlappingIncludeOwnedPath(includeProjectionRootAuthoredConfig, [...path]) === void 0) : params.explicitSetPaths;
	const explicitSetValueSource = persistCanonicalRoster ? canonicalizeAgentRosterForExplicitWrite({
		...params,
		valueSource: params.explicitSetValueSource ?? params.nextConfig,
		rootAuthoredConfig
	}) : params.explicitSetValueSource ?? params.nextConfig;
	let persistedBase = projectConfigWriteSource(params);
	if (persistCanonicalRoster) {
		persistedBase = deletePathValue(persistedBase, ["agents", "entries"]);
		persistedBase = deletePathValue(persistedBase, ["agents", "list"]);
		const entries = getPathValue(explicitSetValueSource, ["agents", "entries"]);
		if (entries !== void 0) persistedBase = setPathValue(persistedBase, ["agents", "entries"], entries, true);
	}
	const includeProjection = {
		...params,
		runtimeConfig: inputBasis.config,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		sourceConfigBeforeMigrations: includeProjectionSourceBeforeMigrations
	};
	const withPreservedIncludes = preserveUntouchedIncludes({
		...includeProjection,
		persistedCandidate: persistedBase
	});
	const persisted = injectExplicitlySetPaths({
		...includeProjection,
		valueSource: explicitSetValueSource,
		persistedCandidate: withPreservedIncludes,
		explicitSetPaths,
		preserveDescendantIncludes: persistCanonicalRoster
	});
	const preserveAuthoredRoster = canCanonicalizeAgentRoster(params.nextConfig) || params.preserveLegacyAgentRoster === true;
	const withAuthoredRoster = wantsCanonicalRoster || !preserveAuthoredRoster ? persisted : restoreAuthoredAgentRoster(persisted, rootAuthoredConfig);
	if (wantsCanonicalRoster) assertCanonicalAgentRosterRetainsEntries({
		currentConfig: params.sourceConfig,
		canonicalConfig: withAuthoredRoster,
		allowedRemovals: params.allowedAgentRosterRemovals
	});
	const withSchema = preserveRootSchemaUri({
		rootAuthoredConfig,
		nextConfig: params.nextConfig,
		persistedCandidate: withAuthoredRoster
	});
	return params.sourceConfigValid === false || inputBasis.kind === "source" ? withSchema : preserveAuthoredAgentParams({
		...params,
		rootAuthoredConfig,
		persistedCandidate: withSchema
	});
}
function preserveRootSchemaUri(params) {
	if (isRecord(params.nextConfig) && Object.hasOwn(params.nextConfig, "$schema")) return params.persistedCandidate;
	const sourceSchema = readStringField(asOptionalRecord(params.rootAuthoredConfig), "$schema");
	if (sourceSchema === void 0 || !isRecord(params.persistedCandidate)) return params.persistedCandidate;
	return {
		...params.persistedCandidate,
		$schema: sourceSchema
	};
}
//#endregion
export { resolvePersistCandidateForWrite as a, projectConfigWriteSource as i, prepareConfigWriteValues as n, projectAuthoredAgentRosterForWrite as r, injectExplicitlySetPaths as t };

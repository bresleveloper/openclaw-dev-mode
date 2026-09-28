import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { o as toDotPath, r as parseConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-BX-jIwaa.mjs";
import { r as formatDeferredPluginMigration } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/config-path-mutation.ts
const MANAGED_CONFIG_UNSET_PATHS = [["plugins", "installs"]];
const WRITE_PRUNED_OBJECT = Symbol("write-pruned-object");
function unsetPathForWriteAt(value, pathSegments, depth) {
	if (depth >= pathSegments.length) return {
		changed: false,
		value
	};
	const segment = expectDefined(pathSegments[depth], "path segments entry at depth");
	const isLeaf = depth === pathSegments.length - 1;
	if (Array.isArray(value)) {
		const index = parseConfigPathArrayIndex(segment);
		if (index === void 0 || index >= value.length) return {
			changed: false,
			value
		};
		const child = isLeaf ? {
			changed: true,
			value: WRITE_PRUNED_OBJECT
		} : unsetPathForWriteAt(value[index], pathSegments, depth + 1);
		if (!child.changed) return {
			changed: false,
			value
		};
		const next = value.slice();
		if (child.value === WRITE_PRUNED_OBJECT) next.splice(index, 1);
		else next[index] = child.value;
		return {
			changed: true,
			value: next
		};
	}
	if (isBlockedObjectKey(segment) || !isRecord(value) || !Object.hasOwn(value, segment)) return {
		changed: false,
		value
	};
	const child = isLeaf ? {
		changed: true,
		value: WRITE_PRUNED_OBJECT
	} : unsetPathForWriteAt(value[segment], pathSegments, depth + 1);
	if (!child.changed) return {
		changed: false,
		value
	};
	const next = { ...value };
	if (child.value === WRITE_PRUNED_OBJECT) delete next[segment];
	else next[segment] = child.value;
	return {
		changed: true,
		value: Object.keys(next).length === 0 ? WRITE_PRUNED_OBJECT : next
	};
}
function unsetPathForWrite(root, pathSegments) {
	if (pathSegments.length === 0) return {
		changed: false,
		next: root
	};
	const result = unsetPathForWriteAt(root, pathSegments, 0);
	if (!result.changed) return {
		changed: false,
		next: root
	};
	if (result.value === WRITE_PRUNED_OBJECT) return {
		changed: true,
		next: {}
	};
	if (isRecord(result.value)) return {
		changed: true,
		next: result.value
	};
	return {
		changed: false,
		next: root
	};
}
function applyUnsetPathsForWrite(root, unsetPaths) {
	let next = root;
	for (const unsetPath of unsetPaths ?? []) {
		if (!Array.isArray(unsetPath) || unsetPath.length === 0) continue;
		const unsetResult = unsetPathForWrite(next, unsetPath);
		if (unsetResult.changed) next = unsetResult.next;
	}
	return next;
}
function resolveManagedUnsetPathsForWrite(unsetPaths) {
	const next = [];
	for (const managedPath of MANAGED_CONFIG_UNSET_PATHS) next.push(Array.from(managedPath));
	for (const unsetPath of unsetPaths ?? []) {
		if (!Array.isArray(unsetPath) || unsetPath.length === 0) continue;
		if (next.some((existing) => isDeepStrictEqual(existing, unsetPath))) continue;
		next.push([...unsetPath]);
	}
	return next;
}
//#endregion
//#region src/config/deferred-plugin-migration-config.ts
const snapshotMigrationFacts = /* @__PURE__ */ new WeakMap();
/** Revalidation consumes the same pending generation that admitted this source snapshot. */
function setDeferredPluginMigrationConfigFacts(source, pending) {
	if (pending?.length) snapshotMigrationFacts.set(source, structuredClone(pending));
}
function getDeferredPluginMigrationConfigFacts(source) {
	return isRecord(source) ? snapshotMigrationFacts.get(source) : void 0;
}
function readPathValue(value, segments) {
	let current = value;
	for (const segment of segments) {
		if (isBlockedObjectKey(segment)) return;
		if (Array.isArray(current)) {
			const index = parseConfigPathArrayIndex(segment);
			current = index === void 0 ? void 0 : current[index];
		} else current = isRecord(current) && Object.hasOwn(current, segment) ? current[segment] : void 0;
	}
	return current;
}
function uniquePaths(paths) {
	return [...new Map(paths.map((path) => [JSON.stringify(path), path])).values()];
}
/** Preserve only current source inputs owned by the deferred plugin or the shared session locator. */
function resolveDeferredPluginMigrationConfigPaths(params) {
	const compatibilityPaths = (params.compatibilityMigrationPaths ?? []).flatMap((pathPattern) => collectPluginConfigContractMatches({
		root: params.config,
		pathPattern
	}).map(({ path }) => parseConcreteConfigPath(path)));
	const configPaths = uniquePaths([
		[
			"plugins",
			"entries",
			params.pluginId,
			"config"
		],
		["session", "store"],
		...compatibilityPaths
	]).filter((path) => readPathValue(params.config, path) !== void 0);
	return {
		...configPaths.length > 0 ? { configPaths } : {},
		...compatibilityPaths.length > 0 ? { validationExcludedPaths: uniquePaths(compatibilityPaths) } : {}
	};
}
function restorePath(source, candidate, segments) {
	const [segment, ...rest] = segments;
	if (segment === void 0) return structuredClone(source);
	if (isBlockedObjectKey(segment)) return candidate;
	if (Array.isArray(source)) {
		const index = parseConfigPathArrayIndex(segment);
		if (index === void 0 || index >= source.length) return candidate;
		const next = Array.isArray(candidate) ? [...candidate] : [];
		next[index] = restorePath(source[index], next[index], rest);
		return next;
	}
	if (!isRecord(source) || !Object.hasOwn(source, segment)) return candidate;
	const next = isRecord(candidate) ? { ...candidate } : {};
	next[segment] = restorePath(source[segment], next[segment], rest);
	return next;
}
/** Explicit edits must not report success after preservation restores their old values. */
function assertDeferredPluginMigrationConfigEditAllowed(params) {
	for (const pending of params.pending) for (const retainedPath of pending.configPaths ?? []) if (params.editedPaths.some((editedPath) => retainedPath.every((segment, index) => editedPath[index] === segment) || editedPath.every((segment, index) => retainedPath[index] === segment)) && !isDeepStrictEqual(readPathValue(params.sourceConfig, retainedPath), readPathValue(params.nextConfig, retainedPath))) throw new Error(`Cannot edit retained config at "${toDotPath(retainedPath)}". ${formatDeferredPluginMigration(pending)}`);
}
/** The current config snapshot owns retained values; migration receipts contain paths only. */
function preserveDeferredPluginMigrationConfig(params) {
	const { explicitSetPaths, unsetPaths, auditOrigin } = params.writeOptions ?? {};
	if (params.pending.length > 0) assertDeferredPluginMigrationConfigEditAllowed({
		...params,
		nextConfig: applyUnsetPathsForWrite(params.nextConfig, unsetPaths),
		editedPaths: auditOrigin === "config-rpc" ? [[]] : [...explicitSetPaths ?? [], ...unsetPaths ?? []]
	});
	let next = params.nextConfig;
	for (const pending of params.pending) for (const path of pending.configPaths ?? []) if (path.length > 0) next = restorePath(params.sourceConfig, next, path);
	return isRecord(next) ? inheritLegacyDefaultAgentId(params.nextConfig, next) : params.nextConfig;
}
/** Retained plugin-owned legacy fields are inert until their migration owner becomes available. */
function omitDeferredPluginMigrationConfig(raw, pending) {
	return isRecord(raw) ? inheritLegacyDefaultAgentId(raw, applyUnsetPathsForWrite(raw, pending?.flatMap((entry) => entry.validationExcludedPaths ?? []))) : raw;
}
//#endregion
export { resolveDeferredPluginMigrationConfigPaths as a, resolveManagedUnsetPathsForWrite as c, preserveDeferredPluginMigrationConfig as i, getDeferredPluginMigrationConfigFacts as n, setDeferredPluginMigrationConfigFacts as o, omitDeferredPluginMigrationConfig as r, applyUnsetPathsForWrite as s, assertDeferredPluginMigrationConfigEditAllowed as t };

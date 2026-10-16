import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
//#region src/channels/plugins/dm-access.ts
function normalizeChannelDmPolicy(value) {
	return value === "pairing" || value === "allowlist" || value === "open" || value === "disabled" ? value : void 0;
}
function resolveDmFieldPaths(mode, kind) {
	const topKey = kind === "policy" ? "dmPolicy" : "allowFrom";
	const nestedKey = kind === "policy" ? "policy" : "allowFrom";
	if (mode === "nestedOnly") return {
		canonicalPath: ["dm", nestedKey],
		legacyPath: [topKey]
	};
	return {
		canonicalPath: [topKey],
		legacyPath: ["dm", nestedKey]
	};
}
function readPath(entry, path) {
	let current = entry;
	for (const segment of path) {
		const record = asNullableRecord(current);
		if (!record) return;
		current = record[segment];
	}
	return current;
}
function deletePath(entry, path) {
	const [head, tail] = path;
	if (tail === void 0) {
		if (entry[head] === void 0) return false;
		delete entry[head];
		return true;
	}
	const parent = asNullableRecord(entry[head]);
	if (!parent || parent[tail] === void 0) return false;
	delete parent[tail];
	if (Object.keys(parent).length === 0) delete entry[head];
	else entry[head] = parent;
	return true;
}
function writePath(entry, path, value) {
	const [head, tail] = path;
	if (tail === void 0) {
		entry[head] = value;
		return;
	}
	const existingParent = asNullableRecord(entry[head]);
	const parent = existingParent ? { ...existingParent } : {};
	parent[tail] = value;
	entry[head] = parent;
}
function allowFromListsMatch(left, right) {
	if (!Array.isArray(left) || !Array.isArray(right)) return false;
	const normalizedLeft = normalizeStringEntries(left);
	const normalizedRight = normalizeStringEntries(right);
	if (normalizedLeft.length !== normalizedRight.length) return false;
	return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}
function formatPath(pathPrefix, path) {
	return `${pathPrefix}.${path.join(".")}`;
}
function readCanonicalOrLegacy(entry, mode, kind) {
	const paths = resolveDmFieldPaths(mode, kind);
	return readPath(entry, paths.canonicalPath) ?? readPath(entry, paths.legacyPath);
}
function resolveChannelDmPolicy(params) {
	const mode = params.mode ?? "topOnly";
	const value = readCanonicalOrLegacy(params.account, mode, "policy") ?? readCanonicalOrLegacy(params.parent, mode, "policy") ?? params.defaultPolicy;
	return typeof value === "string" ? normalizeChannelDmPolicy(value) : void 0;
}
function resolveChannelDmAllowFrom(params) {
	const mode = params.mode ?? "topOnly";
	const value = readCanonicalOrLegacy(params.account, mode, "allowFrom") ?? readCanonicalOrLegacy(params.parent, mode, "allowFrom");
	return Array.isArray(value) ? value : void 0;
}
function resolveChannelDmAccess(params) {
	return {
		dmPolicy: resolveChannelDmPolicy(params),
		allowFrom: resolveChannelDmAllowFrom(params)
	};
}
function setCanonicalDmAllowFrom(params) {
	const paths = resolveDmFieldPaths(params.mode, "allowFrom");
	writePath(params.entry, paths.canonicalPath, [...params.allowFrom]);
	if (deletePath(params.entry, paths.legacyPath)) params.changes?.push(`- ${formatPath(params.pathPrefix, paths.legacyPath)}: removed after moving allowlist to ${formatPath(params.pathPrefix, paths.canonicalPath)}`);
	params.changes?.push(`- ${formatPath(params.pathPrefix, paths.canonicalPath)}: ${params.reason}`);
}
function normalizeLegacyDmAliases(params) {
	const rawDm = asNullableRecord(params.entry.dm);
	if (!rawDm) return {
		entry: params.entry,
		changed: false
	};
	const dm = { ...rawDm };
	let updated = { ...params.entry };
	let changed = false;
	for (const [topKey, legacyKey] of [["dmPolicy", "policy"], ["allowFrom", "allowFrom"]]) {
		if (topKey === "allowFrom" && params.promoteAllowFrom === false) continue;
		const canonical = updated[topKey];
		const legacy = dm[legacyKey];
		if (legacy === void 0) continue;
		if (canonical === void 0) {
			updated[topKey] = legacy;
			params.changes.push(`Moved ${params.pathPrefix}.dm.${legacyKey} → ${params.pathPrefix}.${topKey}.`);
		} else if (topKey === "dmPolicy" ? canonical === legacy : allowFromListsMatch(canonical, legacy)) params.changes.push(`Removed ${params.pathPrefix}.dm.${legacyKey} (${topKey} already set).`);
		else continue;
		delete dm[legacyKey];
		changed = true;
	}
	if (!changed) return {
		entry: params.entry,
		changed: false
	};
	if (Object.keys(dm).length === 0) {
		const { dm: _ignored, ...rest } = updated;
		updated = rest;
		params.changes.push(`Removed empty ${params.pathPrefix}.dm after migration.`);
	} else updated = {
		...updated,
		dm
	};
	return {
		entry: updated,
		changed: true
	};
}
function hasWildcard(list) {
	return list?.some((value) => String(value).trim() === "*") ?? false;
}
function ensureOpenDmPolicyAllowFromWildcard(params) {
	if (resolveChannelDmPolicy({
		account: params.entry,
		mode: params.mode
	}) !== "open") return;
	const policyPaths = resolveDmFieldPaths(params.mode, "policy");
	const canonicalPolicy = readPath(params.entry, policyPaths.canonicalPath);
	const legacyPolicy = readPath(params.entry, policyPaths.legacyPath);
	if (canonicalPolicy === void 0 && legacyPolicy === "open") {
		writePath(params.entry, policyPaths.canonicalPath, "open");
		deletePath(params.entry, policyPaths.legacyPath);
		params.changes.push(`- ${formatPath(params.pathPrefix, policyPaths.canonicalPath)}: set to "open" (migrated from ${formatPath(params.pathPrefix, policyPaths.legacyPath)})`);
	}
	const allowPaths = resolveDmFieldPaths(params.mode, "allowFrom");
	const canonicalAllowFrom = readPath(params.entry, allowPaths.canonicalPath);
	const legacyAllowFrom = readPath(params.entry, allowPaths.legacyPath);
	const sourceAllowFrom = Array.isArray(canonicalAllowFrom) ? canonicalAllowFrom : Array.isArray(legacyAllowFrom) ? legacyAllowFrom : void 0;
	if (hasWildcard(sourceAllowFrom)) {
		if (canonicalAllowFrom === void 0 && sourceAllowFrom) setCanonicalDmAllowFrom({
			entry: params.entry,
			mode: params.mode,
			allowFrom: sourceAllowFrom,
			pathPrefix: params.pathPrefix,
			changes: params.changes,
			reason: `moved wildcard allowlist from ${formatPath(params.pathPrefix, allowPaths.legacyPath)}`
		});
		return;
	}
	const nextAllowFrom = [...sourceAllowFrom ?? [], "*"];
	setCanonicalDmAllowFrom({
		entry: params.entry,
		mode: params.mode,
		allowFrom: nextAllowFrom,
		pathPrefix: params.pathPrefix,
		changes: params.changes,
		reason: Array.isArray(sourceAllowFrom) ? "added \"*\" (required by dmPolicy=\"open\")" : "set to [\"*\"] (required by dmPolicy=\"open\")"
	});
}
//#endregion
export { resolveChannelDmAllowFrom as a, resolveChannelDmAccess as i, normalizeChannelDmPolicy as n, resolveChannelDmPolicy as o, normalizeLegacyDmAliases as r, setCanonicalDmAllowFrom as s, ensureOpenDmPolicyAllowFromWildcard as t };

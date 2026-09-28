import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
//#region src/commands/doctor/shared/legacy-tool-policy-scopes.ts
/**
* Core-owned config roots only. plugins.entries.*.config is opaque plugin-owned
* data; repairing tool policies there belongs to the owning plugin's doctor
* contract (legacyConfigRules), never to a core migration.
*/
const TOOL_POLICY_ROOTS = [
	"tools",
	"agents",
	"channels",
	"gateway"
];
/** True when a config path addresses a tool policy scope holding allow/alsoAllow/deny lists. */
function isToolPolicyPath(path) {
	if (path.at(-1) === "tools" || path.includes("toolsBySender")) return true;
	const byProviderIndex = path.lastIndexOf("byProvider");
	return byProviderIndex >= 0 && path.slice(0, byProviderIndex).includes("tools");
}
//#endregion
//#region src/commands/doctor/shared/legacy-tool-name-migration.ts
const TASK_SUGGESTION_TOOL_NAME_MIGRATION = {
	legacyName: "spawn_task",
	canonicalName: "suggest_task"
};
const IMAGE_INSPECTION_TOOL_NAME_MIGRATION = {
	legacyName: "image",
	canonicalName: "view_image"
};
function inspectLegacyToolNameList(value, migration) {
	if (!Array.isArray(value)) return null;
	const entries = value.filter((entry) => typeof entry === "string");
	const legacyName = normalizeToolPolicyName(migration.legacyName);
	const patterns = compileGlobPatterns({
		raw: entries,
		normalize: normalizeToolPolicyName
	});
	const exactLegacy = entries.some((entry) => normalizeToolPolicyName(entry) === legacyName);
	return {
		exactLegacy,
		appendCanonical: !exactLegacy && matchesAnyGlobPattern(legacyName, patterns) && !matchesAnyGlobPattern(normalizeToolPolicyName(migration.canonicalName), patterns)
	};
}
function hasLegacyToolNameList(value, migration) {
	const state = inspectLegacyToolNameList(value, migration);
	return state?.exactLegacy === true || state?.appendCanonical === true;
}
function migrateLegacyToolNameList(value, migration) {
	const state = inspectLegacyToolNameList(value, migration);
	if (!state || !Array.isArray(value)) return false;
	let mutated = false;
	if (state.exactLegacy) {
		const legacyName = normalizeToolPolicyName(migration.legacyName);
		for (const [index, entry] of value.entries()) if (typeof entry === "string" && normalizeToolPolicyName(entry) === legacyName) {
			value[index] = migration.canonicalName;
			mutated = true;
		}
	}
	if (state.appendCanonical) {
		value.push(migration.canonicalName);
		mutated = true;
	}
	return mutated;
}
function visitLegacyToolName(value, path, migration, migrate, matchedPaths) {
	if (Array.isArray(value)) {
		for (const [index, entry] of value.entries()) visitLegacyToolName(entry, [...path, String(index)], migration, migrate, matchedPaths);
		return;
	}
	if (!isRecord(value)) return;
	const listKeys = isToolPolicyPath(path) ? [
		"allow",
		"alsoAllow",
		"deny"
	] : [];
	if (Object.hasOwn(value, "toolsAllow")) listKeys.push("toolsAllow");
	for (const key of listKeys) {
		const list = value[key];
		if (!hasLegacyToolNameList(list, migration)) continue;
		matchedPaths.push([...path, key].join("."));
		if (migrate) migrateLegacyToolNameList(list, migration);
	}
	for (const [key, entry] of Object.entries(value)) visitLegacyToolName(entry, [...path, key], migration, migrate, matchedPaths);
}
function findLegacyToolNamePaths(value, migration, path = []) {
	const matchedPaths = [];
	visitLegacyToolName(value, path, migration, false, matchedPaths);
	return matchedPaths;
}
function migrateLegacyToolNamePolicies(value, migration, path = []) {
	const matchedPaths = [];
	visitLegacyToolName(value, path, migration, true, matchedPaths);
	return matchedPaths;
}
//#endregion
export { migrateLegacyToolNameList as a, isToolPolicyPath as c, hasLegacyToolNameList as i, TASK_SUGGESTION_TOOL_NAME_MIGRATION as n, migrateLegacyToolNamePolicies as o, findLegacyToolNamePaths as r, TOOL_POLICY_ROOTS as s, IMAGE_INSPECTION_TOOL_NAME_MIGRATION as t };

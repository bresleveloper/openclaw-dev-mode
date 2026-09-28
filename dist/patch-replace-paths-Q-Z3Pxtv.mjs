import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
//#region src/config/patch-replace-paths.ts
function formatConfigPatchPath(parentPath, key) {
	return parentPath ? `${parentPath}.${key}` : key;
}
/** Whether a merge-patch key is safe at its exact config path. */
function isMergePatchObjectKeyAllowed(key, parentPath) {
	if (!isBlockedObjectKey(key)) return true;
	return parentPath === "browser.profiles" && (key === "constructor" || key === "prototype");
}
/** Collect only beneath a subtree the caller explicitly intends to delete. */
function collectBaseArrayPaths(base, path) {
	if (Array.isArray(base)) return [path];
	if (!isPlainObject(base)) return [];
	const paths = [];
	for (const [key, value] of Object.entries(base)) {
		const childPath = formatConfigPatchPath(path, key);
		if (!isMergePatchObjectKeyAllowed(key, path)) continue;
		paths.push(...collectBaseArrayPaths(value, childPath));
	}
	return paths;
}
function normalizeConfigPatchReplacePath(value) {
	const trimmed = value.trim();
	if (trimmed.endsWith("[]")) return trimmed.slice(0, -2).replace(/\[\d+\](?=\.)/g, "[]");
	return trimmed.replace(/\[\d+\](?=\.)/g, "[]");
}
function normalizeConfigPatchReplacePaths(values) {
	if (!values) return /* @__PURE__ */ new Set();
	return new Set(values.filter((value) => typeof value === "string").map(normalizeConfigPatchReplacePath).filter((value) => value.length > 0));
}
//#endregion
export { normalizeConfigPatchReplacePaths as i, formatConfigPatchPath as n, isMergePatchObjectKeyAllowed as r, collectBaseArrayPaths as t };

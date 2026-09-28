import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { n as formatConfigPatchPath, r as isMergePatchObjectKeyAllowed } from "./patch-replace-paths-Q-Z3Pxtv.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/merge-patch.ts
function cloneUnknown(value) {
	return structuredClone(value);
}
/** Builds a merge patch; ID-keyed array mode emits changed fields for upserts. */
function createMergePatch(base, target, options = {}) {
	if (!isRecord(base) || !isRecord(target)) return cloneUnknown(target);
	const patch = {};
	const keys = /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(target)]);
	for (const key of keys) {
		const hasBase = Object.hasOwn(base, key);
		if (!Object.hasOwn(target, key)) {
			patch[key] = null;
			continue;
		}
		const targetValue = target[key];
		if (!hasBase) {
			patch[key] = cloneUnknown(targetValue);
			continue;
		}
		const baseValue = base[key];
		if (options.mergeObjectArraysById && isIdKeyedArray(baseValue) && isIdKeyedArray(targetValue)) {
			const baseById = new Map(baseValue.map((entry) => [entry.id, entry]));
			const updates = [];
			for (const entry of targetValue) {
				const baseEntry = baseById.get(entry.id);
				const update = createMergePatch(baseEntry, applyMergePatch(baseEntry, entry, options), options);
				if (isRecord(update) && Object.keys(update).length > 0) updates.push({
					...update,
					id: entry.id
				});
			}
			if (updates.length > 0) patch[key] = updates;
			continue;
		}
		if (isRecord(baseValue) && isRecord(targetValue)) {
			const childPatch = createMergePatch(baseValue, targetValue, options);
			if (isRecord(childPatch) && Object.keys(childPatch).length === 0) continue;
			patch[key] = childPatch;
			continue;
		}
		if (!isDeepStrictEqual(baseValue, targetValue)) patch[key] = cloneUnknown(targetValue);
	}
	return patch;
}
/** Whether a merge patch would replace a value changed since its source was read. */
function mergePatchConflicts(base, current, patch, options = {}) {
	if (options.mergeObjectArraysById && isIdKeyedArray(base) && isIdKeyedArray(current) && isIdKeyedArray(patch)) {
		const baseById = new Map(base.map((entry) => [entry.id, entry]));
		const currentById = new Map(current.map((entry) => [entry.id, entry]));
		return patch.some((entry) => mergePatchConflicts(baseById.get(entry.id), currentById.get(entry.id), entry, options));
	}
	if (!isRecord(patch)) return !isDeepStrictEqual(base, current);
	const baseIsObject = isRecord(base);
	const currentIsObject = isRecord(current);
	if (baseIsObject !== currentIsObject && base !== void 0) return true;
	if (!baseIsObject && !currentIsObject && !isDeepStrictEqual(base, current)) return true;
	const baseRecord = baseIsObject ? base : {};
	const currentRecord = currentIsObject ? current : {};
	return Object.entries(patch).some(([key, childPatch]) => mergePatchConflicts(baseRecord[key], currentRecord[key], childPatch, options));
}
function isObjectWithStringId(value) {
	if (!isPlainObject(value)) return false;
	return typeof value.id === "string" && value.id.length > 0;
}
function isIdKeyedArray(value) {
	return Array.isArray(value) && value.every(isObjectWithStringId);
}
function formatMergePatchArrayEntryPath(arrayPath) {
	return `${arrayPath}[]`;
}
/**
* Merge arrays of object-like entries keyed by `id`.
*
* Contract:
* - Base array must be fully id-keyed; otherwise return undefined (caller should replace).
* - Patch entries with valid id merge by id (or append when the id is new).
* - Patch entries without valid id append as-is, avoiding destructive full-array replacement.
*/
function mergeObjectArraysById(base, patch, options, arrayPath) {
	if (!base.every(isObjectWithStringId)) return;
	const merged = [...base];
	const indexById = /* @__PURE__ */ new Map();
	for (const [index, entry] of merged.entries()) {
		if (!isObjectWithStringId(entry)) return;
		indexById.set(entry.id, index);
	}
	for (const patchEntry of patch) {
		if (!isObjectWithStringId(patchEntry)) {
			merged.push(structuredClone(patchEntry));
			continue;
		}
		const existingIndex = indexById.get(patchEntry.id);
		if (existingIndex === void 0) {
			merged.push(structuredClone(patchEntry));
			indexById.set(patchEntry.id, merged.length - 1);
			continue;
		}
		merged[existingIndex] = applyMergePatch(merged[existingIndex], patchEntry, {
			...options,
			path: formatMergePatchArrayEntryPath(arrayPath)
		});
	}
	return merged;
}
/**
* Applies an RFC 7396-style object merge patch with OpenClaw config safeguards.
*
* Non-object patches replace the base, `null` deletes keys, blocked prototype
* keys are ignored outside schema-owned record-key paths, and id-keyed arrays
* may merge when the caller opts in.
*/
function applyMergePatch(base, patch, options = {}) {
	if (!isPlainObject(patch)) return patch;
	const result = isPlainObject(base) ? { ...base } : {};
	for (const [key, value] of Object.entries(patch)) {
		const path = formatConfigPatchPath(options.path, key);
		if (!isMergePatchObjectKeyAllowed(key, options.path)) continue;
		if (value === null) {
			delete result[key];
			continue;
		}
		if (options.mergeObjectArraysById && Array.isArray(result[key]) && Array.isArray(value)) {
			if (options.replaceArrayPaths?.has(path)) {
				result[key] = value;
				continue;
			}
			const mergedArray = mergeObjectArraysById(result[key], value, options, path);
			if (mergedArray) {
				result[key] = mergedArray;
				continue;
			}
		}
		if (isPlainObject(value)) {
			const baseValue = result[key];
			result[key] = applyMergePatch(isPlainObject(baseValue) ? baseValue : {}, value, {
				...options,
				path
			});
			continue;
		}
		result[key] = value;
	}
	return result;
}
//#endregion
export { createMergePatch as n, mergePatchConflicts as r, applyMergePatch as t };

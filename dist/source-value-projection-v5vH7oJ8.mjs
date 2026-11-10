import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatConfigPatchPath, r as isMergePatchObjectKeyAllowed } from "./patch-replace-paths-smD0Mrey.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/source-value-projection.ts
/** Projects runtime edits onto source values; only missing keys represent deletion. */
function projectRuntimeChangesOntoSource(sourceConfig, runtimeConfig, nextConfig, options = {}) {
	const absent = Symbol("absent config value");
	const unchanged = Symbol("unchanged config value");
	const project = (source, runtime, candidate, path, prune) => {
		if (isDeepStrictEqual(runtime, candidate)) return unchanged;
		if (!isRecord(candidate)) return structuredClone(candidate);
		const sourceRecord = isRecord(source) ? source : {};
		const runtimeRecord = isRecord(runtime) ? runtime : {};
		const projected = structuredClone(sourceRecord);
		const pruneChildren = prune && (source === void 0 || isRecord(source)) && Object.keys(candidate).length > 0;
		let changed = !isRecord(runtime);
		for (const key of /* @__PURE__ */ new Set([...Object.keys(runtimeRecord), ...Object.keys(candidate)])) {
			const sourceValue = Object.hasOwn(sourceRecord, key) ? sourceRecord[key] : void 0;
			const value = Object.hasOwn(candidate, key) ? project(sourceValue, Object.hasOwn(runtimeRecord, key) ? runtimeRecord[key] : absent, candidate[key], formatConfigPatchPath(path, key), pruneChildren) : absent;
			if (value === unchanged || value === absent && pruneChildren && sourceValue === void 0) continue;
			changed = true;
			if (!isMergePatchObjectKeyAllowed(key, path)) continue;
			if (value === absent) delete projected[key];
			else projected[key] = value;
		}
		return changed ? projected : unchanged;
	};
	const projected = project(sourceConfig, runtimeConfig, nextConfig, "", options.pruneUnauthoredDeletions === true);
	return projected === unchanged ? structuredClone(sourceConfig) : projected;
}
//#endregion
export { projectRuntimeChangesOntoSource as t };

import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { M as captureRuntimeConfigWithSource, N as getRuntimeConfigCapture, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { n as formatConfigPatchPath, r as isMergePatchObjectKeyAllowed } from "./patch-replace-paths-Q-Z3Pxtv.mjs";
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
//#region src/config/runtime-source-projection.ts
/** Captures runtime and authored values together for one admitted preparation generation. */
function captureRuntimeConfig(config) {
	if (getRuntimeConfigCapture(config)) return config;
	return captureRuntimeConfigWithSource(config, projectConfigOntoRuntimeSourceSnapshot(config));
}
/** Projects a runtime-derived config back onto the active authored source snapshot. */
function projectConfigOntoRuntimeSourceSnapshot(config) {
	const captured = getRuntimeConfigCapture(config);
	if (captured) return captured.source;
	const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
	const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfigSnapshot || !runtimeConfigSourceSnapshot) return config;
	if (config === runtimeConfigSnapshot) return runtimeConfigSourceSnapshot;
	const runtime = runtimeConfigSnapshot;
	const candidate = config;
	for (const key of Object.keys(runtime)) {
		if (!Object.hasOwn(candidate, key)) return config;
		const runtimeValue = runtime[key];
		const candidateValue = candidate[key];
		if (Array.isArray(runtimeValue) !== Array.isArray(candidateValue) || runtimeValue === null !== (candidateValue === null) || typeof runtimeValue !== typeof candidateValue) return config;
	}
	return projectRuntimeChangesOntoSource(runtimeConfigSourceSnapshot, runtimeConfigSnapshot, config);
}
/** Projects partial legacy inputs without persisting deleted runtime-only parents. */
function projectLegacyRuntimeConfigWrite(config, runtimeSnapshot = getRuntimeConfigSnapshot(), sourceSnapshot = getRuntimeConfigSourceSnapshot()) {
	if (!runtimeSnapshot || !sourceSnapshot) return config;
	return asOptionalRecord(projectRuntimeChangesOntoSource(sourceSnapshot, runtimeSnapshot, config, { pruneUnauthoredDeletions: true })) ?? {};
}
//#endregion
export { projectRuntimeChangesOntoSource as i, projectConfigOntoRuntimeSourceSnapshot as n, projectLegacyRuntimeConfigWrite as r, captureRuntimeConfig as t };

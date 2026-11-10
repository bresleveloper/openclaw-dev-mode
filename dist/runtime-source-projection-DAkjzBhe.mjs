import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as getRuntimeConfigCapture, t as captureRuntimeConfigWithSource } from "./runtime-config-capture-state-CxduIFzk.mjs";
import { t as projectRuntimeChangesOntoSource } from "./source-value-projection-v5vH7oJ8.mjs";
//#region src/config/runtime-source-projection.ts
/** Captures runtime and authored values together for one admitted preparation generation. */
function captureRuntimeConfig(config) {
	if (config === getRuntimeConfigSnapshot()) return getRuntimeConfigSnapshot({ capture: true });
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
export { projectConfigOntoRuntimeSourceSnapshot as n, projectLegacyRuntimeConfigWrite as r, captureRuntimeConfig as t };

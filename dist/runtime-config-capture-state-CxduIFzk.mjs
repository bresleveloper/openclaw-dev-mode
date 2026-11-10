import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { n as createNormalizedPluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
//#region src/config/runtime-config-capture-state.ts
const captures = /* @__PURE__ */ new WeakMap();
function getRuntimeConfigCapture(config) {
	return config ? captures.get(config) : void 0;
}
/** Freeze a selected runtime/source pair before its publication owner yields. */
function captureRuntimeConfigWithSource(config, source) {
	const clone = (value) => freezeJsonSnapshot(cloneConfigWithResolutionFacts(value));
	const captured = clone(config);
	const capturedSource = source === config ? captured : clone(source);
	captures.set(captured, {
		source: capturedSource,
		origin: config,
		plugins: createNormalizedPluginsConfig(captured.plugins)
	});
	if (capturedSource !== captured) captures.set(capturedSource, {
		source: capturedSource,
		origin: source,
		plugins: createNormalizedPluginsConfig(capturedSource.plugins)
	});
	return captured;
}
//#endregion
export { getRuntimeConfigCapture as n, captureRuntimeConfigWithSource as t };

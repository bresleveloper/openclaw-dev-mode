import { I as getRuntimeConfigCapture, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
//#region src/plugins/activation-source-config.ts
/** Resolves the source config snapshot used for plugin activation policy decisions. */
/** Resolves the source config used for plugin activation policy decisions. */
function resolvePluginActivationSourceConfig(params) {
	if (params.activationSourceConfig !== void 0) return params.activationSourceConfig;
	const captured = getRuntimeConfigCapture(params.config);
	if (captured) return captured.source;
	const sourceSnapshot = getRuntimeConfigSourceSnapshot();
	if (sourceSnapshot && params.config === getRuntimeConfigSnapshot()) return sourceSnapshot;
	return params.config ?? {};
}
//#endregion
export { resolvePluginActivationSourceConfig as t };

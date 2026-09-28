import { N as getRuntimeConfigCapture, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
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

import { t as isXaiToolEnabled } from "./tool-auth-shared-BKm-JLrq.mjs";
//#region extensions/xai/src/code-execution-config.ts
function readCodeExecutionConfigRecord(config) {
	return config && typeof config === "object" ? config : void 0;
}
function readPluginCodeExecutionConfig(cfg) {
	if (!cfg || typeof cfg !== "object") return;
	const plugins = cfg.plugins;
	const entries = plugins && typeof plugins === "object" ? plugins.entries : void 0;
	const entry = entries && entries.xai;
	const config = entry && typeof entry === "object" ? entry.config : void 0;
	const value = config && typeof config === "object" ? config.codeExecution : void 0;
	return value && typeof value === "object" ? value : void 0;
}
function resolveCodeExecutionEnabled(params) {
	return isXaiToolEnabled({
		enabled: readCodeExecutionConfigRecord(params.config)?.enabled,
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		auth: params.auth
	});
}
//#endregion
export { readPluginCodeExecutionConfig as n, resolveCodeExecutionEnabled as r, readCodeExecutionConfigRecord as t };

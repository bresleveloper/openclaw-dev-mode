import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { s as getRuntimeConfigSourceSnapshot, v as setRuntimeConfigSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import "./config-A41fTHlt.js";
import { l as getModelsCommandSecretTargetIds } from "./command-secret-targets-8T81-Xu7.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-BGrtQcbA.js";
//#region src/commands/models/load-config.ts
/** Config loader for model commands with command-scoped secret resolution. */
/** Loads config, resolves model command secrets, and preserves the source snapshot. */
async function loadModelsConfigWithSource(params) {
	const runtimeConfig = getRuntimeConfig();
	const sourceConfig = getRuntimeConfigSourceSnapshot() ?? runtimeConfig;
	const { resolvedConfig, diagnostics } = await resolveCommandConfigWithSecrets({
		config: runtimeConfig,
		commandName: params.commandName,
		targetIds: getModelsCommandSecretTargetIds(),
		runtime: params.runtime
	});
	setRuntimeConfigSnapshot(resolvedConfig, sourceConfig);
	return {
		sourceConfig,
		resolvedConfig,
		diagnostics
	};
}
/** Loads the resolved model command config when callers do not need source metadata. */
async function loadModelsConfig(params) {
	return (await loadModelsConfigWithSource(params)).resolvedConfig;
}
//#endregion
export { loadModelsConfigWithSource as n, loadModelsConfig as t };

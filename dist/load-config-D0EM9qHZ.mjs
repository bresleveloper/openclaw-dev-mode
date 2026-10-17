import { D as setRuntimeConfigSnapshot, l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { c as getModelsCommandSecretTargetIds } from "./command-secret-targets-C5LZrFZ5.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-BYPIp_np.mjs";
//#region src/commands/models/load-config.ts
/** Config loader for model commands with command-scoped secret resolution. */
/** Loads config, resolves model command secrets, and preserves the source snapshot. */
async function loadModelsConfigWithSource(params) {
	const runtimeConfig = getRuntimeConfig(params.skipPluginValidation ? { skipPluginValidation: true } : void 0);
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
async function loadModelsConfig(params) {
	return (await loadModelsConfigWithSource(params)).resolvedConfig;
}
//#endregion
export { loadModelsConfigWithSource as n, loadModelsConfig as t };

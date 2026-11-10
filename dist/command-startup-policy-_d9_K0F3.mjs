import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-u5WGwKHZ.mjs";
//#region src/cli/command-startup-policy.ts
function resolveCliStartupPolicy(params) {
	const commandPolicy = resolveCliCommandPathPolicy(params.commandPath);
	const nativeCheck = params.nativeUpdateExecutorCheck === true;
	const machineOutputMode = nativeCheck || params.jsonOutputMode || params.machineOutputMode === true;
	const suppressDoctorStdout = machineOutputMode || commandPolicy.ownsProtocolStdout;
	const configGuard = typeof commandPolicy.configGuard === "function" ? commandPolicy.configGuard({
		argv: params.argv ?? [],
		commandPath: params.commandPath,
		options: params.options
	}) : commandPolicy.configGuard;
	const env = params.env ?? process.env;
	return {
		suppressDoctorStdout,
		hideBanner: machineOutputMode || commandPolicy.hideBanner || isTruthyEnvValue(env.OPENCLAW_HIDE_BANNER),
		skipConfigGuard: nativeCheck || configGuard === "skip" || configGuard === "defer",
		...configGuard === "validate" || configGuard === "defer" ? { validateConfigOnly: true } : {},
		loadPlugins: !nativeCheck && (typeof commandPolicy.loadPlugins === "function" ? commandPolicy.loadPlugins({
			argv: params.argv ?? [],
			commandPath: params.commandPath,
			jsonOutputMode: params.jsonOutputMode
		}) : commandPolicy.loadPlugins === "always"),
		pluginRegistry: commandPolicy.pluginRegistry
	};
}
//#endregion
export { resolveCliStartupPolicy as t };

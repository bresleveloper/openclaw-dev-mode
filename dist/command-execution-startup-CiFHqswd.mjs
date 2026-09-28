import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as routeLogsToStderr } from "./console-DwqfhE-H.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-CoumbNZT.mjs";
import { t as ensureCliPluginRegistryLoaded } from "./plugin-registry-loader-DqlimX-H.mjs";
//#region src/cli/command-execution-startup.ts
const configGuardModuleLoader = createLazyImportLoader(() => import("./config-guard-BG4Sgpba.mjs"));
const hasJsonFlag = (argv) => argv.some((arg) => arg === "--json" || arg.startsWith("--json="));
const hasVersionFlag = (argv) => argv.some((arg) => arg === "--version" || arg === "-V");
async function applyCliExecutionStartupPresentation(params) {
	if (params.startupPolicy.suppressDoctorStdout && params.routeLogsToStderrOnSuppress !== false) routeLogsToStderr();
	if (params.startupPolicy.hideBanner || params.showBanner === false || !params.version) return;
	if (params.argv && (hasJsonFlag(params.argv) || hasVersionFlag(params.argv))) return;
	const { emitCliBanner } = await import("./banner-BtsIrLkD.mjs");
	if (params.argv) {
		emitCliBanner(params.version, { argv: params.argv });
		return;
	}
	emitCliBanner(params.version);
}
async function ensureCliExecutionBootstrap(params) {
	const { runtime, commandPath, startupPolicy, allowInvalid, beforeStateMigrations, skipPristineCoreStateMigrations, skipPristineStartupStateMigrations } = params;
	const { suppressDoctorStdout, pluginRegistry } = startupPolicy;
	const loadPlugins = params.loadPlugins ?? startupPolicy.loadPlugins;
	const skipConfigGuard = params.skipConfigGuard ?? startupPolicy.skipConfigGuard;
	const validateConfigOnly = params.validateConfigOnly ?? startupPolicy.validateConfigOnly;
	if (!skipConfigGuard) await measureCliCommandStartup("config-ready", async () => {
		const { ensureConfigReady } = await configGuardModuleLoader.load();
		const runConfigGuard = () => ensureConfigReady({
			runtime,
			commandPath,
			measure: (stage, run) => measureCliCommandStartup(stage, run),
			...allowInvalid ? { allowInvalid: true } : {},
			...validateConfigOnly ? { validateConfigOnly: true } : {},
			...beforeStateMigrations ? { beforeStateMigrations } : {},
			...suppressDoctorStdout ? { suppressDoctorStdout: true } : {},
			...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
			...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
		});
		if (commandPath[0] === "gateway" && (commandPath.length === 1 || commandPath.length === 2 && commandPath[1] === "run") && !validateConfigOnly) {
			const [{ withConfigSnapshotPreparation }, { prepareHostConfigSnapshot }, { resolveConfigPath }] = await Promise.all([
				import("./io.snapshot-preparation-scope-CY-JnBTR.mjs"),
				import("./io.snapshot-preparation-FzdN_oRo.mjs"),
				import("./paths-bFNjVB0r.mjs")
			]);
			await withConfigSnapshotPreparation({
				configPath: resolveConfigPath(),
				prepare: prepareHostConfigSnapshot
			}, runConfigGuard);
		} else await runConfigGuard();
	});
	if (!loadPlugins) return;
	await measureCliCommandStartup("plugin-registry", () => ensureCliPluginRegistryLoaded({
		scope: pluginRegistry.scope,
		routeLogsToStderr: suppressDoctorStdout
	}));
}
//#endregion
export { ensureCliExecutionBootstrap as n, applyCliExecutionStartupPresentation as t };

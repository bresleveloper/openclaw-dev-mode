import { r as resolveOpenClawPackageRootSync } from "../openclaw-root-Cur9Uhkp.mjs";
import { n as loadBundledPluginManifestRegistry } from "../manifest-registry-build-BbQTPsvD.mjs";
import { t as loadPluginManifestRegistryCore } from "../manifest-registry-CEG7WMVu.mjs";
import { a as tryLoadActivatedBundledPluginPublicSurfaceModuleSync, r as loadBundledPluginPublicSurfaceModuleSync } from "../facade-runtime-CSNstsFk.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugin-sdk/private-qa-bundled-env.ts
/**
* Runtime helper for private QA CLI source-checkout bundled plugin resolution.
*/
/** Returns an env override that points bundled plugin loading at source extensions. */
function resolvePrivateQaBundledPluginsEnv(env = process.env) {
	if (env.OPENCLAW_ENABLE_PRIVATE_QA_CLI !== "1") return;
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		cwd: process.cwd(),
		moduleUrl: import.meta.url
	});
	if (!packageRoot) return;
	const sourceExtensionsDir = path.join(packageRoot, "extensions");
	if (!fs.existsSync(path.join(packageRoot, ".git")) || !fs.existsSync(path.join(packageRoot, "src")) || !fs.existsSync(sourceExtensionsDir)) return;
	return {
		...env,
		OPENCLAW_BUNDLED_PLUGINS_DIR: sourceExtensionsDir
	};
}
//#endregion
//#region src/plugin-sdk/qa-runner-runtime.ts
/** Memoize a lazy CLI runtime import so repeated command paths share one loaded module. */
function createLazyCliRuntimeLoader(load) {
	let promise = null;
	return async () => {
		promise ??= load();
		return await promise;
	};
}
function collectLiveTransportQaStringOption(value, previous) {
	const trimmed = value.trim();
	return trimmed ? [...previous, trimmed] : previous;
}
function mapLiveTransportQaCommanderOptions(opts, normalizeInactiveSelectionOptions) {
	if (!normalizeInactiveSelectionOptions) return {
		...opts.channelDriver ? { channelDriver: opts.channelDriver } : {},
		concurrency: opts.concurrency,
		repoRoot: opts.repoRoot,
		outputDir: opts.outputDir,
		providerMode: opts.providerMode,
		primaryModel: opts.model,
		alternateModel: opts.altModel,
		fastMode: opts.fast,
		allowFailures: opts.allowFailures,
		failFast: opts.failFast,
		profile: opts.profile,
		scenarioIds: opts.scenario,
		listScenarios: opts.listScenarios,
		sutAccountId: opts.sutAccount,
		credentialFile: opts.credentialFile,
		credentialSource: opts.credentialSource,
		credentialRole: opts.credentialRole
	};
	return {
		...opts.channelDriver ? { channelDriver: opts.channelDriver } : {},
		...opts.concurrency !== void 0 ? { concurrency: opts.concurrency } : {},
		repoRoot: opts.repoRoot,
		outputDir: opts.outputDir,
		providerMode: opts.providerMode,
		primaryModel: opts.model,
		alternateModel: opts.altModel,
		fastMode: opts.fast,
		allowFailures: opts.allowFailures,
		failFast: opts.failFast,
		profile: opts.profile,
		scenarioIds: opts.scenario,
		listScenarios: opts.listScenarios || void 0,
		sutAccountId: opts.sutAccount,
		...opts.credentialFile ? { credentialFile: opts.credentialFile } : {},
		credentialSource: opts.credentialSource,
		credentialRole: opts.credentialRole
	};
}
function registerLiveTransportQaCli(params) {
	const command = params.qa.command(params.commandName).description(params.description).option("--repo-root <path>", "Repository root to target when running from a neutral cwd").option("--output-dir <path>", params.outputDirHelp).option("--provider-mode <mode>", params.providerModeHelp, params.defaultProviderMode).option("--model <ref>", "Primary provider/model ref").option("--alt-model <ref>", "Alternate provider/model ref").option("--scenario <id>", params.scenarioHelp, collectLiveTransportQaStringOption, []).option("--fast", "Enable provider fast mode where supported");
	if (params.concurrency) command.option("--concurrency <count>", params.concurrency.help, params.concurrency.parse);
	if (params.allowFailuresHelp) command.option("--allow-failures", params.allowFailuresHelp, false);
	command.option("--sut-account <id>", params.sutAccountHelp, "sut");
	if (params.credentialFileHelp) command.option("--credential-file <path>", params.credentialFileHelp);
	if (params.listScenariosHelp) command.option("--list-scenarios", params.listScenariosHelp, false);
	if (params.profileHelp) command.option("--profile <profile>", params.profileHelp);
	if (params.failFastHelp) command.option("--fail-fast", params.failFastHelp, false);
	if (params.credentialOptions) {
		command.option("--credential-source <source>", params.credentialOptions.sourceDescription ?? "Credential source for live lanes: env or convex (default: env)");
		if (params.credentialOptions.roleDescription) command.option("--credential-role <role>", params.credentialOptions.roleDescription);
	}
	command.action(async (opts) => {
		if (command.getOptionValueSource("scenario") === "cli" && opts.scenario?.length === 0) throw new Error("--scenario must name at least one non-empty scenario id.");
		await params.run(mapLiveTransportQaCommanderOptions(opts, params.normalizeInactiveSelectionOptions === true));
	});
}
/** Build a Commander registration object for one live-transport QA command. */
function createLiveTransportQaCliRegistration(params) {
	return {
		commandName: params.commandName,
		adapterFactory: params.adapterFactory,
		register(qa) {
			registerLiveTransportQaCli({
				...params,
				qa
			});
		}
	};
}
const QA_RUNNER_API_ARTIFACT_BASENAME = "qa-runner-api.js";
const LEGACY_QA_RUNNER_API_ARTIFACT_BASENAME = "runtime-api.js";
function isMissingQaRuntimeError(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("qa-lab") && (error.message.includes("runtime-api.js") || error.message.startsWith("Unable to open bundled plugin public surface "));
}
/** Load the private QA Lab runtime facade used by QA runner commands. */
function loadQaRuntimeModule() {
	const env = resolvePrivateQaBundledPluginsEnv();
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: ["qa", "lab"].join("-"),
		artifactBasename: ["runtime-api", "js"].join("."),
		...env ? { env } : {}
	});
}
/** Load a bundled QA runner plugin test API facade by plugin id. */
function loadQaRunnerBundledPluginTestApi(pluginId) {
	const env = resolvePrivateQaBundledPluginsEnv();
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: pluginId,
		artifactBasename: "test-api.js",
		...env ? { env } : {}
	});
}
/** Returns whether the private QA Lab runtime facade is available in this build. */
function isQaRuntimeAvailable() {
	try {
		loadQaRuntimeModule();
		return true;
	} catch (error) {
		if (isMissingQaRuntimeError(error)) return false;
		throw error;
	}
}
/** Run a plugin-owned transport adapter through QA Lab's shared suite host. */
async function runLiveTransportQaSuiteCommand(params) {
	return await loadQaRuntimeModule().runLiveTransportQaSuiteCommand(params);
}
function listDeclaredQaRunnerPlugins(env = resolvePrivateQaBundledPluginsEnv()) {
	return (env ? loadBundledPluginManifestRegistry({ env }) : loadPluginManifestRegistryCore()).plugins.filter((plugin) => Array.isArray(plugin.qaRunners) && plugin.qaRunners.length > 0).toSorted((left, right) => {
		const idCompare = left.id.localeCompare(right.id);
		if (idCompare !== 0) return idCompare;
		return left.rootDir.localeCompare(right.rootDir);
	});
}
function indexRuntimeRegistrations(pluginId, surface) {
	const registrations = surface.qaRunnerCliRegistrations ?? [];
	const registrationByCommandName = /* @__PURE__ */ new Map();
	for (const registration of registrations) {
		if (!registration?.commandName || typeof registration.register !== "function") throw new Error(`QA runner plugin "${pluginId}" exported an invalid CLI registration`);
		if (registrationByCommandName.has(registration.commandName)) throw new Error(`QA runner plugin "${pluginId}" exported duplicate CLI registration "${registration.commandName}"`);
		registrationByCommandName.set(registration.commandName, registration);
	}
	return registrationByCommandName;
}
function loadQaRunnerSurface(plugin, env) {
	if (plugin.origin === "bundled") return loadBundledPluginPublicSurfaceModuleSync({
		dirName: plugin.id,
		artifactBasename: QA_RUNNER_API_ARTIFACT_BASENAME,
		...env ? { env } : {}
	});
	try {
		return tryLoadActivatedBundledPluginPublicSurfaceModuleSync({
			dirName: plugin.id,
			artifactBasename: QA_RUNNER_API_ARTIFACT_BASENAME,
			...env ? { env } : {}
		});
	} catch (error) {
		if (!(error instanceof Error) || error.message !== `Unable to resolve bundled plugin public surface ${plugin.id}/${QA_RUNNER_API_ARTIFACT_BASENAME}`) throw error;
	}
	return tryLoadActivatedBundledPluginPublicSurfaceModuleSync({
		dirName: plugin.id,
		artifactBasename: LEGACY_QA_RUNNER_API_ARTIFACT_BASENAME,
		...env ? { env } : {}
	});
}
/** List QA runner CLI contributions declared by manifests and backed by runtime registrations. */
function listQaRunnerCliContributions() {
	const env = resolvePrivateQaBundledPluginsEnv();
	const contributions = /* @__PURE__ */ new Map();
	for (const plugin of listDeclaredQaRunnerPlugins(env)) {
		const runnerSurface = loadQaRunnerSurface(plugin, env);
		const runtimeRegistrationByCommandName = runnerSurface ? indexRuntimeRegistrations(plugin.id, runnerSurface) : null;
		const declaredCommandNames = new Set(plugin.qaRunners.map((runner) => runner.commandName));
		for (const runner of plugin.qaRunners) {
			const previous = contributions.get(runner.commandName);
			if (previous && previous.pluginId !== plugin.id) throw new Error(`QA runner command "${runner.commandName}" declared by both "${previous.pluginId}" and "${plugin.id}"`);
			const registration = runtimeRegistrationByCommandName?.get(runner.commandName);
			if (!runnerSurface) {
				contributions.set(runner.commandName, {
					pluginId: plugin.id,
					commandName: runner.commandName,
					...runner.description ? { description: runner.description } : {},
					status: "blocked"
				});
				continue;
			}
			if (!registration) throw new Error(`QA runner plugin "${plugin.id}" declared "${runner.commandName}" in openclaw.plugin.json but did not export a matching CLI registration from its QA runner surface`);
			const adapterFactory = registration.adapterFactory;
			const supportsModuleFlows = adapterFactory ? Reflect.get(adapterFactory, "supportsModuleFlows") : void 0;
			if (adapterFactory && (adapterFactory.id !== runner.commandName || supportsModuleFlows !== void 0 && supportsModuleFlows !== true || adapterFactory.isolatesInstances !== void 0 && typeof adapterFactory.isolatesInstances !== "boolean" || typeof adapterFactory.matches !== "function" || typeof adapterFactory.create !== "function")) throw new Error(`QA runner plugin "${plugin.id}" exported an invalid transport factory for "${runner.commandName}"`);
			contributions.set(runner.commandName, {
				pluginId: plugin.id,
				commandName: runner.commandName,
				...runner.description ? { description: runner.description } : {},
				status: "available",
				registration
			});
		}
		for (const commandName of runtimeRegistrationByCommandName?.keys() ?? []) if (!declaredCommandNames.has(commandName)) throw new Error(`QA runner plugin "${plugin.id}" exported "${commandName}" from its QA runner surface but did not declare it in openclaw.plugin.json`);
	}
	return [...contributions.values()];
}
//#endregion
export { createLazyCliRuntimeLoader, createLiveTransportQaCliRegistration, isQaRuntimeAvailable, listQaRunnerCliContributions, loadQaRunnerBundledPluginTestApi, loadQaRuntimeModule, runLiveTransportQaSuiteCommand };

#!/usr/bin/env node
import { n as resolveOpenClawCompileCacheDirectory, r as resolveOpenClawCompileCacheRespawnEnv, t as enableOpenClawCompileCache$1 } from "./node-compile-cache-D2yvJTzP.mjs";
import { u as isRootHelpInvocation } from "./argv-C7hqFLn5.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-uoU8-Fwk.mjs";
import "./detached-async-context-D04NzekX.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { i as shouldKeepNativeHookRelayInProcess, n as isNativeHookRelayArgv, r as isTerminalInteractiveRespawnArgv, t as isForegroundGmailRunArgv } from "./respawn-policy-XYVGlIrI.mjs";
import { n as fsSafeEnvInput } from "./fs-safe-env-wxBiM84C.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-Dw600tcl.mjs";
import { n as tryRunUpdateAdmissionBeforeStartup, t as isUpdateAdmissionInvocation } from "./run-main-update-admission-p8v6RIi-.mjs";
import { i as normalizeEnv } from "./env-DbG527wb.mjs";
import { i as createGatewayDispatchStartupTrace, n as configureGatewayStartupTraceConsoleFormatting, o as prepareGatewayStartupTraceConsoleFormatting } from "./startup-trace-AW_r3L-l.mjs";
import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { n as parseCliContainerArgs, r as resolveCliContainerTarget } from "./container-target-DzrX5jVY.mjs";
import { t as tryOutputPrecomputedCommandHelp } from "./precomputed-help-DJl_rjz7.mjs";
import { t as normalizeWindowsArgv } from "./windows-argv-YUCPtVGt.mjs";
import { t as attachChildProcessBridge } from "./child-process-bridge-b1ugIZyM.mjs";
import { n as runCliRespawnPlan, r as runRespawnChildWithSignalBridge, t as buildCliRespawnPlan } from "./entry.respawn-Cmajum_1.mjs";
import { t as tryHandleRootVersionFastPath } from "./entry.version-fast-path-DHWPhjmg.mjs";
import { i as ensureOpenClawExecMarkerOnProcess } from "./openclaw-exec-env-eyUZROLC.mjs";
import { t as installProcessWarningFilter } from "./warning-filter-DEomBGoF.mjs";
import { i as requestNodeHostLauncherBootstrap, n as isNodeHostLauncherChild, t as getManagedNodeHostStatePath } from "./launcher-client-DNBTHwUk.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { getCompileCacheDir } from "node:module";
import process from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { format as format$1 } from "node:util";
import { spawn } from "node:child_process";
//#region src/entry.compile-cache.ts
const COMPILE_CACHE_DISABLED_RESPAWNED_ENV = "OPENCLAW_COMPILE_CACHE_DISABLED_RESPAWNED";
function resolveEntryInstallRoot(entryFile) {
	const entryDir = path.dirname(entryFile);
	const entryParent = path.basename(entryDir);
	return entryParent === "dist" || entryParent === "src" ? path.dirname(entryDir) : entryDir;
}
function isSourceEntry(currentFile) {
	return path.extname(currentFile) === ".ts";
}
function isNodeCompileCacheRequested(env) {
	return env.NODE_COMPILE_CACHE !== void 0 && env.NODE_DISABLE_COMPILE_CACHE === void 0;
}
function buildOpenClawCompileCacheRespawnPlan(params) {
	const env = params.env ?? process.env;
	const argv = process.argv;
	const platform = process.platform;
	if (platform !== "win32" && isForegroundGatewayRunArgv(argv)) return;
	if (isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform)) return;
	if (!isSourceEntry(params.currentFile)) return;
	if (env[COMPILE_CACHE_DISABLED_RESPAWNED_ENV] === "1") return;
	if (!params.compileCacheDir && !isNodeCompileCacheRequested(env)) return;
	const nextEnv = {
		...env,
		NODE_DISABLE_COMPILE_CACHE: "1",
		[COMPILE_CACHE_DISABLED_RESPAWNED_ENV]: "1"
	};
	delete nextEnv.NODE_COMPILE_CACHE;
	return {
		command: process.execPath,
		args: [
			...process.execArgv,
			params.currentFile,
			...argv.slice(2)
		],
		env: nextEnv,
		detachForProcessTree: platform !== "win32" && !isTerminalInteractiveRespawnArgv(argv)
	};
}
async function respawnWithoutOpenClawCompileCacheIfNeeded(params) {
	if (!isSourceEntry(params.currentFile) && isForegroundGatewayRunArgv(process.argv)) {
		const env = resolveOpenClawCompileCacheRespawnEnv({
			directory: resolveOpenClawCompileCacheDirectory({
				installRoot: resolveEntryInstallRoot(params.currentFile),
				env: params.env,
				foregroundGateway: true
			}),
			env: params.env,
			foregroundGateway: true
		});
		if (env) {
			const args = [
				...process.execArgv,
				params.currentFile,
				...process.argv.slice(2)
			];
			if (process.platform !== "win32" && process.execve) process.execve(process.execPath, [process.execPath, ...args], env);
			const { runRespawnedChild } = await import("./node-runtime-recovery-Cs6l5Wzv.mjs");
			return runRespawnedChild(process.execPath, args, env);
		}
	}
	const plan = buildOpenClawCompileCacheRespawnPlan({
		currentFile: params.currentFile,
		compileCacheDir: getCompileCacheDir?.(),
		env: params.env
	});
	if (!plan) return false;
	const writeError = await params.prepareWriteError?.() ?? ((message) => {
		process.stderr.write(message);
	});
	process.exitCode = await runRespawnChildWithSignalBridge({
		command: plan.command,
		args: plan.args,
		env: plan.env,
		detachForProcessTree: plan.detachForProcessTree,
		runtime: {
			spawn,
			attachChildProcessBridge
		},
		onError: (error) => writeError(`[openclaw] Failed to respawn CLI without compile cache: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`)
	});
	return true;
}
function enableOpenClawCompileCache(params) {
	if (!isSourceEntry(params.currentFile)) enableOpenClawCompileCache$1({
		directory: resolveOpenClawCompileCacheDirectory({
			...params,
			foregroundGateway: isForegroundGatewayRunArgv(process.argv)
		}),
		env: params.env,
		foregroundGateway: isForegroundGatewayRunArgv(process.argv)
	});
}
//#endregion
//#region src/entry.ts
const inheritedRuntimeEnv = { ...process.env };
const ENTRY_WRAPPER_PAIRS = [
	{
		wrapperBasename: "openclaw.mjs",
		entryBasename: "entry.js"
	},
	{
		wrapperBasename: "openclaw.mjs",
		entryBasename: "entry.mjs"
	},
	{
		wrapperBasename: "openclaw.js",
		entryBasename: "entry.js"
	}
];
async function writeCapturedCliArgumentError(message) {
	const { loadCliDotEnv } = await import("./dotenv-Dr6nhquT.mjs");
	loadCliDotEnv({ quiet: true });
	await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
	const { enableConsoleCapture } = await import("./logging-DX5OCXqY.mjs");
	enableConsoleCapture();
	const [{ formatCliJsonFailure }, { isJsonOutputModeActive }] = await Promise.all([import("./failure-output-DuWfXOiW.mjs"), import("./json-output-mode-DJvhLoPt.mjs")]);
	if (isJsonOutputModeActive(process.argv)) defaultRuntime.writeJson(formatCliJsonFailure(message));
	console.error(`[openclaw] ${message}`);
}
async function prepareCliDiagnosticBlockWriter() {
	const loadWriter = async () => {
		const { loadCliDotEnv } = await import("./dotenv-Dr6nhquT.mjs");
		loadCliDotEnv({ quiet: true });
		await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
		const { formatConsoleDiagnosticBlock } = await import("./json-console-line-CytzoCTe.mjs");
		return (message, error) => {
			const formatted = error === void 0 ? message : format$1(message, error);
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message: formatted.endsWith("\n") ? formatted : `${formatted}\n`
			}));
		};
	};
	return gatewayEntryStartupTrace.enabled ? loadWriter() : async (message, error) => (await loadWriter())(message, error);
}
async function flushEntryStartupTraceForEarlyReturn(argv) {
	if (!gatewayEntryStartupTrace.enabled) return;
	const { loadCliDotEnvForEarlyDiagnostic } = await import("./dotenv-Dr6nhquT.mjs");
	await loadCliDotEnvForEarlyDiagnostic(argv);
	await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
}
function shouldForceReadOnlyAuthStore(argv) {
	const tokens = argv.slice(2).filter((token) => token.length > 0 && !token.startsWith("-"));
	for (let index = 0; index < tokens.length - 1; index += 1) if (tokens[index] === "secrets" && tokens[index + 1] === "audit") return true;
	return false;
}
const gatewayEntryStartupTrace = createGatewayDispatchStartupTrace(process.argv, "entry");
if (isMainModule({
	currentFile: fileURLToPath(import.meta.url),
	wrapperEntryPairs: [...ENTRY_WRAPPER_PAIRS]
})) try {
	await runEntryMain();
} catch (error) {
	if (!(error instanceof ExitError)) throw error;
	process.exitCode = error.code;
}
async function runEntryMain() {
	if (isUpdateAdmissionInvocation(resolveCliArgvInvocation(process.argv))) {
		await tryRunUpdateAdmissionBeforeStartup(resolveCliArgvInvocation(process.argv));
		return;
	}
	const entryFile = fileURLToPath(import.meta.url);
	const installRoot = resolveEntryInstallRoot(entryFile);
	ensureOpenClawExecMarkerOnProcess();
	installProcessWarningFilter();
	normalizeEnv();
	process.argv = normalizeWindowsArgv(process.argv);
	const earlyProfile = parseCliProfileArgs(process.argv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const startupEnv = { ...fsSafeEnvInput(process.env) };
	const { assertSupportedRuntime, isCurrentRuntimeSupported } = await import("./runtime-guard-BZ53YTeZ.mjs");
	if (!await isCurrentRuntimeSupported()) {
		const { loadCliDotEnv } = await import("./dotenv-Dr6nhquT.mjs");
		loadCliDotEnv({ quiet: true });
		await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
	}
	await assertSupportedRuntime(void 0, void 0, process.argv, false, inheritedRuntimeEnv);
	const { runNodeHostLauncher } = await import(new URL("../node-host-launcher.mjs", import.meta.url).href);
	if (await runNodeHostLauncher({
		entryPath: entryFile,
		packageRoot: installRoot
	})) {
		process.exitCode ??= 0;
		return;
	}
	gatewayEntryStartupTrace.mark("bootstrap");
	if (!(!isNodeHostLauncherChild() && await respawnWithoutOpenClawCompileCacheIfNeeded({
		currentFile: entryFile,
		env: startupEnv,
		prepareWriteError: async () => {
			const writeError = await prepareCliDiagnosticBlockWriter();
			return (message) => writeError(message);
		}
	}))) {
		enableOpenClawCompileCache({
			currentFile: entryFile,
			installRoot
		});
		if (shouldForceReadOnlyAuthStore(process.argv)) process.env.OPENCLAW_AUTH_STORE_READONLY = "1";
		if (process.argv.includes("--no-color")) {
			process.env.NO_COLOR = "1";
			process.env.FORCE_COLOR = "0";
		}
		async function ensureCliRespawnReady() {
			const plan = buildCliRespawnPlan({ env: startupEnv });
			if (!plan) return false;
			if (isNodeHostLauncherChild()) {
				await requestNodeHostLauncherBootstrap({
					execArgv: plan.argv.slice(0, plan.argv.length - process.argv.length + 1),
					env: plan.env
				});
				process.exitCode = 0;
				return true;
			}
			const writeError = await prepareCliDiagnosticBlockWriter();
			await runCliRespawnPlan(plan, void 0, writeError);
			return true;
		}
		if (!await ensureCliRespawnReady()) {
			await assertSupportedRuntime(void 0, void 0, process.argv, true, inheritedRuntimeEnv);
			process.title = "openclaw";
			const parsedContainer = parseCliContainerArgs(process.argv);
			if (!parsedContainer.ok) {
				await writeCapturedCliArgumentError(parsedContainer.error);
				process.exitCode = 2;
				return;
			}
			const parsed = parseCliProfileArgs(parsedContainer.argv);
			if (!parsed.ok) {
				await writeCapturedCliArgumentError(parsed.error);
				process.exitCode = 2;
				return;
			}
			const containerTargetName = resolveCliContainerTarget(process.argv);
			if (parsed.profile) {
				applyCliProfileEnv({ profile: parsed.profile });
				process.argv = parsed.argv;
			}
			if (containerTargetName && parsed.profile) {
				await writeCapturedCliArgumentError("--container cannot be combined with --profile/--dev");
				process.exitCode = 2;
				return;
			}
			gatewayEntryStartupTrace.mark("argv");
			if (!tryHandleRootVersionFastPath(process.argv)) {
				const run = async (finalize) => {
					const { withCliProcessScope } = await import("./runtime-cleanup-scope-B7DoY3fg.mjs");
					return withCliProcessScope(() => runMainOrRootHelp(process.argv, { finalize }));
				};
				const managedNodeStatePath = getManagedNodeHostStatePath();
				if (managedNodeStatePath) {
					const { withExistingOpenClawStateSchema } = await import("./openclaw-state-db-schema-policy-DaUcI9iY.mjs");
					await withExistingOpenClawStateSchema({ path: managedNodeStatePath }, async () => {
						const { openOpenClawStateDatabase, closeOpenClawStateDatabaseByPathAsync } = await import("./openclaw-state-db-C_MWM4sr.mjs");
						openOpenClawStateDatabase({ path: managedNodeStatePath });
						await run(async () => {
							await closeOpenClawStateDatabaseByPathAsync(managedNodeStatePath);
						});
					});
				} else await run();
			}
		}
	}
}
async function tryHandleRootHelpFastPath(argv) {
	const env = process.env;
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1" || resolveCliContainerTarget(argv, env)) return false;
	if (!isRootHelpInvocation(argv)) return false;
	try {
		const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await import("./root-help-live-config-DLFpCf-w.mjs");
		const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(env);
		if (!liveRootHelpOptions) {
			const { outputPrecomputedRootHelpText } = await import("./root-help-metadata-D_5fa834.mjs");
			if (outputPrecomputedRootHelpText()) return true;
		}
		const { outputRootHelp } = await import("./root-help-dZP3gIy2.mjs");
		await outputRootHelp(liveRootHelpOptions ?? void 0);
		return true;
	} catch (error) {
		const detail = error instanceof Error ? error.stack ?? error.message : String(error);
		await (await prepareCliDiagnosticBlockWriter())(`[openclaw] Failed to display help: ${detail}\n`);
		process.exitCode = 1;
		return true;
	}
}
async function tryHandlePrecomputedCommandHelpFastPath(argv) {
	if (resolveCliContainerTarget(argv)) return false;
	try {
		return await tryOutputPrecomputedCommandHelp(argv);
	} catch {
		return false;
	}
}
async function prepareCliFailureHandler(argv, commandStarted) {
	const [{ loadCliDotEnvForEarlyDiagnostic }, { enableConsoleCapture }, { formatCliFailureLines, formatCliJsonFailure }, { isJsonOutputModeActive }, configureTrace] = await Promise.all([
		import("./dotenv-Dr6nhquT.mjs"),
		import("./logging-DX5OCXqY.mjs"),
		import("./failure-output-DuWfXOiW.mjs"),
		import("./json-output-mode-DJvhLoPt.mjs"),
		prepareGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace)
	]);
	return async (error) => {
		await loadCliDotEnvForEarlyDiagnostic(argv);
		configureTrace();
		enableConsoleCapture();
		if (isJsonOutputModeActive(argv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
		for (const line of formatCliFailureLines({
			title: commandStarted() ? "The CLI command failed." : "Could not start the CLI.",
			error,
			argv
		})) console.error(line);
		process.exitCode = 1;
	};
}
async function runMainOrRootHelp(argv, deps = {}) {
	let commandStarted = false;
	let failureHandler;
	const { runCliWithExitFinalization, requestExitAfterOneShotOutput } = await import("./one-shot-exit-BcO1IrwG.mjs");
	await runCliWithExitFinalization({
		finalize: deps.finalize,
		run: async () => {
			if (isNativeHookRelayArgv(argv) && !argv.includes("--help") && !argv.includes("-h")) {
				const { runNativeHookRelayCliFromArgv } = await import("./native-hook-relay-cli-DgvIPGs2.mjs");
				const exitCode = await runNativeHookRelayCliFromArgv(argv);
				process.exitCode = exitCode;
				requestExitAfterOneShotOutput(defaultRuntime, exitCode);
				return;
			}
			if (await tryHandleRootHelpFastPath(argv)) {
				await flushEntryStartupTraceForEarlyReturn(argv);
				requestExitAfterOneShotOutput(defaultRuntime);
				return;
			}
			if (await tryHandlePrecomputedCommandHelpFastPath(argv)) {
				await flushEntryStartupTraceForEarlyReturn(argv);
				requestExitAfterOneShotOutput(defaultRuntime);
				return;
			}
			const { runCli } = await gatewayEntryStartupTrace.measure("run-main-import", deps.loadRunCli ?? (() => import("./cli/run-main.js")));
			failureHandler = await prepareCliFailureHandler(argv, () => commandStarted);
			commandStarted = true;
			await runCli(argv, {
				additionalStartupTrace: gatewayEntryStartupTrace,
				runtimeRecoveryEnv: inheritedRuntimeEnv,
				retainConsoleRoutingUntilProcessExit: true
			});
		},
		onError: async (error) => (failureHandler ?? await prepareCliFailureHandler(argv, () => commandStarted))(error)
	});
}
//#endregion
export { runMainOrRootHelp, tryHandlePrecomputedCommandHelpFastPath, tryHandleRootHelpFastPath };

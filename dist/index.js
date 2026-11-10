#!/usr/bin/env node
import { n as resolveOpenClawCompileCacheDirectory, r as resolveOpenClawCompileCacheRespawnEnv, t as enableOpenClawCompileCache } from "./node-compile-cache-D2yvJTzP.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-uoU8-Fwk.mjs";
import "./detached-async-context-D04NzekX.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { i as shouldKeepNativeHookRelayInProcess, t as isForegroundGmailRunArgv } from "./respawn-policy-XYVGlIrI.mjs";
import { n as tryRunUpdateAdmissionBeforeStartup } from "./run-main-update-admission-p8v6RIi-.mjs";
import { i as createGatewayDispatchStartupTrace, n as configureGatewayStartupTraceConsoleFormatting } from "./startup-trace-AW_r3L-l.mjs";
import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { existsSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
//#region src/index.ts
const isMain = isMainModule({ currentFile: fileURLToPath(import.meta.url) });
const handledAdmission = isMain && await tryRunUpdateAdmissionBeforeStartup(resolveCliArgvInvocation(process.argv));
const packageRootUrl = new URL("../", import.meta.url);
if (!handledAdmission && !existsSync(new URL("entry.ts", import.meta.url)) && (existsSync(new URL(".openclaw-lifecycle-pending", packageRootUrl)) || existsSync(new URL("dist/openclaw-install-guard", packageRootUrl)))) {
	const { completePendingPackageLifecycle } = await import("./infra/package-lifecycle.js");
	try {
		await completePendingPackageLifecycle({ packageRoot: fileURLToPath(packageRootUrl) });
	} catch (error) {
		throw new Error(`OpenClaw package lifecycle is incomplete. Reinstall with package scripts enabled, then retry. ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
}
let applyTemplate;
let createDefaultDeps;
let deriveSessionKey;
let describePortOwner;
let ensureBinary;
let ensurePortAvailable;
let getReplyFromConfig;
let handlePortError;
let loadConfig;
let monitorWebChannel;
let normalizeE164;
let PortInUseError;
let promptYesNo;
let resolveSessionKey;
let resolveStorePath;
let runCommandWithTimeout;
let runExec;
let waitForever;
async function loadLegacyCliDeps(argv) {
	const startupTrace = createGatewayDispatchStartupTrace(argv, "entry");
	await configureGatewayStartupTraceConsoleFormatting(startupTrace);
	const { runCli } = await startupTrace.measure("run-main-import", () => import("./cli/run-main.js"));
	return { runCli };
}
async function runLegacyCliEntry(argv = process.argv, deps, options) {
	const { runCli } = deps ?? await loadLegacyCliDeps(argv);
	await runCli(argv, options);
}
const handledRootVersion = isMain && !handledAdmission && (await import("./entry.version-fast-path-DsQRohZF.mjs")).tryHandleRootVersionFastPath(process.argv);
if (!isMain) ({applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, monitorWebChannel, normalizeE164, PortInUseError, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, waitForever} = await import("./library-B1SOwJoP.mjs"));
const shouldRunCli = isMain && !handledRootVersion && !handledAdmission;
const compileCacheDirectory = shouldRunCli ? resolveOpenClawCompileCacheDirectory({
	installRoot: fileURLToPath(packageRootUrl),
	foregroundGateway: isForegroundGatewayRunArgv(process.argv)
}) : void 0;
const compileCacheRespawnEnv = shouldRunCli && !isForegroundGmailRunArgv(process.argv) && !shouldKeepNativeHookRelayInProcess(process.argv, process.platform) ? resolveOpenClawCompileCacheRespawnEnv({
	directory: compileCacheDirectory,
	foregroundGateway: isForegroundGatewayRunArgv(process.argv)
}) : void 0;
if (compileCacheRespawnEnv) {
	const args = [
		...process.execArgv,
		fileURLToPath(import.meta.url),
		...process.argv.slice(2)
	];
	if (process.platform !== "win32" && process.execve && isForegroundGatewayRunArgv(process.argv)) process.execve(process.execPath, [process.execPath, ...args], compileCacheRespawnEnv);
	const { runRespawnedChild } = await import("./node-runtime-recovery-Cs6l5Wzv.mjs");
	await runRespawnedChild(process.execPath, args, compileCacheRespawnEnv);
}
if (shouldRunCli && !compileCacheRespawnEnv) {
	enableOpenClawCompileCache({
		directory: compileCacheDirectory,
		foregroundGateway: isForegroundGatewayRunArgv(process.argv)
	});
	const [{ formatCliFailureLines, formatCliJsonFailure, isExpectedCliError }, { isJsonOutputModeActive }, { runCliWithExitFinalization }, { withCliProcessScope }, { formatUncaughtError }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }] = await Promise.all([
		import("./failure-output-DuWfXOiW.mjs"),
		import("./json-output-mode-DJvhLoPt.mjs"),
		import("./one-shot-exit-BcO1IrwG.mjs"),
		import("./runtime-cleanup-scope-B7DoY3fg.mjs"),
		import("./infra/errors.js"),
		import("./fatal-error-hooks-DGD-L3B8.mjs"),
		import("./unhandled-rejections-DvTkjUPI.mjs")
	]);
	const { defaultRuntime, restoreRuntimeTerminalState } = await import("./runtime-DqKM42HJ.mjs");
	const { exitAfterSignalExitBarriers } = await import("./signal-exit-barrier-Bj-a5wKU.mjs");
	installUnhandledRejectionHandler();
	process.on("uncaughtException", (error) => {
		if (isUncaughtExceptionHandled(error)) return;
		if (isBenignUncaughtExceptionError(error)) {
			console.warn("[openclaw] Non-fatal uncaught exception (continuing):", formatUncaughtError(error));
			return;
		}
		if (isJsonOutputModeActive(process.argv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
		for (const line of formatCliFailureLines({
			title: "OpenClaw hit an unexpected runtime error.",
			error,
			argv: process.argv
		})) console.error(line);
		for (const message of runFatalErrorHooks({
			reason: "uncaught_exception",
			error
		})) console.error("[openclaw]", message);
		restoreRuntimeTerminalState("uncaught exception", { resumeStdinIfPaused: false });
		exitAfterSignalExitBarriers(1, "uncaught exception");
	});
	runCliWithExitFinalization({
		run: () => withCliProcessScope(() => runLegacyCliEntry(process.argv, void 0, { retainConsoleRoutingUntilProcessExit: true })),
		onError: (err) => {
			if (isJsonOutputModeActive(process.argv)) defaultRuntime.writeJson(formatCliJsonFailure(err));
			for (const line of formatCliFailureLines({
				title: "The CLI command failed.",
				error: err,
				argv: process.argv
			})) console.error(line);
			if (!isExpectedCliError(err)) for (const message of runFatalErrorHooks({
				reason: "legacy_cli_failure",
				error: err
			})) console.error("[openclaw]", message);
			restoreRuntimeTerminalState("legacy cli failure", { resumeStdinIfPaused: false });
			process.exitCode = 1;
		}
	});
}
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, runLegacyCliEntry, waitForever };

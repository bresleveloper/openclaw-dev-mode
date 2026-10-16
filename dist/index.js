#!/usr/bin/env node
import { t as disableExitUnsafeCompilers } from "./node-exit-safe-compilers-B7V3uapp.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { n as tryRunUpdateAdmissionBeforeStartup } from "./run-main-update-admission-BS1Ry2Ic.mjs";
import { i as createGatewayDispatchStartupTrace, n as configureGatewayStartupTraceConsoleFormatting } from "./startup-trace-D7hzafKJ.mjs";
import { t as tryHandleRootVersionFastPath } from "./detached-async-context-B1URpzvl.mjs";
import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { existsSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
//#region src/index.ts
const isMain = isMainModule({ currentFile: fileURLToPath(import.meta.url) });
if (isMain) disableExitUnsafeCompilers();
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
const handledRootVersion = isMain && !handledAdmission && tryHandleRootVersionFastPath(process.argv);
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
if (!isMain) ({applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, monitorWebChannel, normalizeE164, PortInUseError, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, waitForever} = await import("./library-QjBudDa6.mjs"));
if (isMain && !handledRootVersion && !handledAdmission) {
	const [{ formatCliFailureLines, formatCliJsonFailure, isExpectedCliError }, { isJsonOutputModeActive }, { runCliWithExitFinalization }, { withCliProcessScope }, { installDistEsmResolveFastPath: installFastPath }, { formatUncaughtError }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }] = await Promise.all([
		import("./failure-output-CKN7Q5cE.mjs"),
		import("./json-output-mode-BR-Z3WUl.mjs"),
		import("./one-shot-exit-45nwQ_jz.mjs"),
		import("./runtime-cleanup-scope-DfAoBUW-.mjs"),
		import("./entry.esm-resolve-fast-path-nYOOyhlm.mjs"),
		import("./infra/errors.js"),
		import("./fatal-error-hooks-Q7ktJSt7.mjs"),
		import("./unhandled-rejections-B3DEjwQf.mjs")
	]);
	installFastPath(import.meta.url);
	const { defaultRuntime, restoreRuntimeTerminalState } = await import("./runtime-C3rISTtF.mjs");
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
		process.exit(1);
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

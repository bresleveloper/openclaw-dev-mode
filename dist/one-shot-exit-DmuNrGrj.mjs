import { i as restoreRuntimeTerminalState, r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { c as waitForCliSignalExit } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { a as waitForPendingCliDisposers } from "./runtime-cleanup-DQlcWeTy.mjs";
import { writeSync } from "node:fs";
//#region src/cli/one-shot-exit.ts
let requestedExitCode;
let settledExitWatchdogMs;
function resolveProcessExitCode(fallback = 0) {
	const value = process.exitCode;
	if (typeof value === "number") return Number.isInteger(value) ? value : fallback;
	if (typeof value === "string" && /^-?\d+$/u.test(value.trim())) return Number.parseInt(value, 10);
	return fallback;
}
async function runCliWithExitFinalization(params) {
	const runtime = params.runtime ?? defaultRuntime;
	let finalizationFailure;
	try {
		await params.run();
	} catch (error) {
		if (error instanceof ExitError) {
			if (!requestExitAfterOneShotOutput(runtime, error.code)) throw error;
		} else {
			await params.onError(error);
			requestExitAfterOneShotOutput(runtime, resolveProcessExitCode(1));
		}
	} finally {
		let signalExitCode = await waitForCliSignalExit();
		if (runtime === defaultRuntime) await waitForPendingCliDisposers();
		if (params.finalize) try {
			await params.finalize();
		} catch (error) {
			try {
				await params.onError(error);
			} catch (reportError) {
				finalizationFailure = { error: reportError };
			}
			if (!requestExitAfterOneShotOutput(runtime, 1)) finalizationFailure ??= { error };
		}
		if (runtime === defaultRuntime) {
			await waitForPendingCliDisposers();
			signalExitCode = await waitForCliSignalExit() ?? signalExitCode;
			const requestedCode = requestedExitCode;
			requestedExitCode = void 0;
			if (signalExitCode !== void 0) process.exitCode = signalExitCode;
			else if (requestedCode !== void 0) process.exitCode = requestedCode === "process" ? resolveProcessExitCode() : requestedCode;
			if (signalExitCode !== void 0 || requestedCode !== void 0) restoreRuntimeTerminalState("CLI exit", { resumeStdinIfPaused: false });
			if (settledExitWatchdogMs !== void 0) {
				armSettledExitWatchdog(settledExitWatchdogMs);
				settledExitWatchdogMs = void 0;
			}
		}
	}
	if (finalizationFailure) throw finalizationFailure.error;
}
/** Unwind an already-reported CLI outcome before shared cleanup and output draining. */
function exitCliAfterOutput(runtime, exitCode) {
	if (runtime !== defaultRuntime) runtime.exit(exitCode);
	throw new ExitError(exitCode);
}
function requestExitAfterOneShotOutput(runtime = defaultRuntime, exitCode) {
	if (runtime !== defaultRuntime) return false;
	requestedExitCode = exitCode ?? "process";
	return true;
}
/**
* Long-lived owners retire their deadline watchdogs once shutdown settles. Ask the CLI to bound
* a referenced handle nobody closed after every command-owned job, disposer and finalizer ends.
*/
function requestSettledExitWatchdog(delayMs) {
	settledExitWatchdogMs = delayMs;
}
function armSettledExitWatchdog(delayMs) {
	setTimeout(() => {
		const counts = /* @__PURE__ */ new Map();
		for (const resource of process.getActiveResourcesInfo()) counts.set(resource, (counts.get(resource) ?? 0) + 1);
		const resources = [...counts].map(([name, count]) => `${name}x${count}`).join(", ");
		const terminate = process.platform !== "win32" && resolveProcessExitCode() === 0;
		writeSync(2, `command settled but the process is still alive after ${delayMs}ms; active resources: ${resources || "unreported"}${terminate ? "; terminating" : ""}\n`);
		if (terminate) {
			process.removeAllListeners("SIGTERM");
			process.kill(process.pid, "SIGTERM");
		}
	}, delayMs).unref();
}
/** Report unsettled cleanup without bypassing its native resource owner. */
function watchCliExitAfterOutput(onStall) {
	setTimeout(onStall, 1e4).unref();
}
//#endregion
export { watchCliExitAfterOutput as a, runCliWithExitFinalization as i, requestExitAfterOneShotOutput as n, requestSettledExitWatchdog as r, exitCliAfterOutput as t };

import { r as defaultRuntime, t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { t as drainProcessOutput } from "./output-drain-DMosb1D5.mjs";
import { c as waitForCliSignalExit, t as exitAfterSignalExitBarriers } from "./signal-exit-barrier-BFniU76K.mjs";
import { a as waitForPendingCliDisposers } from "./runtime-cleanup-BrX8Cb4t.mjs";
//#region src/cli/one-shot-exit.ts
const SYSTEM_CA_FLAG = "--use-system-ca";
let requestedExitCode;
function resolveVitestWorkerMarkers() {
	const processMarkers = process;
	const globalMarkers = globalThis;
	return {
		tinypoolState: processMarkers["__tinypool_state__"],
		vitestWorker: globalMarkers["__vitest_worker__"]
	};
}
function hasNodeRuntimeOption(option, env, execArgv) {
	const normalize = (value) => value.replaceAll("_", "-");
	if (execArgv.some((arg) => normalize(arg) === option)) return true;
	return (env.NODE_OPTIONS ?? "").split(/\s+/u).some((token) => {
		const quote = token[0];
		const unquoted = (quote === "\"" || quote === "'") && token.at(-1) === quote ? token.slice(1, -1) : token;
		return normalize(unquoted) === option;
	});
}
function resolveProcessExitCode(fallback = 0) {
	const value = process.exitCode;
	if (typeof value === "number") return Number.isInteger(value) ? value : fallback;
	if (typeof value === "string" && /^-?\d+$/u.test(value.trim())) return Number.parseInt(value, 10);
	return fallback;
}
function isVitestWorker(env, markers = resolveVitestWorkerMarkers()) {
	return (env.VITEST === "true" || env.VITEST === "1" || env.VITEST_POOL_ID !== void 0 || env.VITEST_WORKER_ID !== void 0) && (markers.tinypoolState !== void 0 || markers.vitestWorker !== void 0);
}
function requestExitAfterSystemCaCliCompletion(runtime = defaultRuntime, params = {}) {
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const platform = params.platform ?? process.platform;
	const usesSystemCa = env.NODE_USE_SYSTEM_CA === "1" || hasNodeRuntimeOption(SYSTEM_CA_FLAG, env, execArgv);
	if (platform !== "darwin" || !usesSystemCa || runtime !== defaultRuntime) return false;
	if (requestedExitCode !== void 0) return false;
	requestedExitCode = params.exitCode ?? "process";
	return true;
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
		await waitForCliSignalExit();
		const automaticExit = requestExitAfterSystemCaCliCompletion(runtime, {
			env: params.env,
			execArgv: params.execArgv,
			platform: params.platform
		});
		if (params.finalize || automaticExit && !isVitestWorker(params.env ?? process.env, params.markers)) await waitForPendingCliDisposers();
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
		flushExitAfterOneShotOutput(runtime, params.env, params.markers);
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
/** A recorded command outcome must not be held hostage by resource cleanup. */
function watchCliExitAfterOutput(exitCode, onStall) {
	if (isVitestWorker(process.env)) return;
	setTimeout(() => {
		try {
			onStall();
		} finally {
			exitAfterSignalExitBarriers(exitCode);
		}
	}, 1e4).unref();
}
function flushExitAfterOneShotOutput(runtime = defaultRuntime, env = process.env, markers = resolveVitestWorkerMarkers()) {
	const requestedCode = requestedExitCode;
	requestedExitCode = void 0;
	if (requestedCode === void 0 || runtime !== defaultRuntime || isVitestWorker(env, markers)) return;
	const exit = () => runtime.exit(requestedCode === "process" ? resolveProcessExitCode() : requestedCode);
	drainProcessOutput(exit);
}
//#endregion
export { watchCliExitAfterOutput as i, requestExitAfterOneShotOutput as n, runCliWithExitFinalization as r, exitCliAfterOutput as t };

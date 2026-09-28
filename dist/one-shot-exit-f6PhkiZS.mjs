import { t as drainProcessOutput } from "./output-drain-DMosb1D5.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { a as waitForCliSignalExit } from "./signal-exit-barrier-BG0KH3HC.mjs";
//#region src/cli/runtime-cleanup.ts
const DISPOSER_TIMEOUT_MS = 5e3;
const pendingDisposers = /* @__PURE__ */ new Map();
function getPendingCliDisposers() {
	return [...pendingDisposers.values()].map(({ name }) => name);
}
/** Automatic process exit must join cleanup that outlived its reporting grace. */
async function waitForPendingCliDisposers() {
	while (pendingDisposers.size > 0) await Promise.allSettled([...pendingDisposers.values()].map(({ operation }) => operation));
}
async function runCliDisposer(name, dispose, runCleanup, timeoutMs = DISPOSER_TIMEOUT_MS) {
	const token = Symbol(name);
	let timer;
	const operation = Promise.resolve().then(() => runCleanup ? runCleanup(dispose) : dispose()).finally(() => pendingDisposers.delete(token));
	pendingDisposers.set(token, {
		name,
		operation
	});
	try {
		await Promise.race([operation, new Promise((resolve) => {
			timer = setTimeout(() => {
				console.error(`CLI cleanup timed out: ${name} after ${timeoutMs}ms`);
				resolve();
			}, timeoutMs);
		})]);
	} catch {} finally {
		clearTimeout(timer);
	}
}
async function closeCliResources(cleanup) {
	const runCleanup = cleanup?.pluginResources?.runCleanup;
	const finalizers = {
		"agent-harnesses": async () => {
			const { listRegisteredAgentHarnesses, disposeRegisteredAgentHarnesses } = await import("./registry-CenZJDCM.mjs");
			const registered = listRegisteredAgentHarnesses();
			if (!cleanup) {
				if (registered.length > 0) await disposeRegisteredAgentHarnesses();
				return;
			}
			const { markPluginRegistryRetired } = await import("./registry-lifecycle-Cuzp_7Sp.mjs");
			try {
				await Promise.all([...cleanup.harnesses].map(([harness, dispose]) => runCliDisposer(`agent-harness/${harness.id}`, dispose, runCleanup)));
			} finally {
				for (const registry of cleanup.registries) markPluginRegistryRetired(registry);
				cleanup.harnesses.clear();
				cleanup.registries.clear();
			}
		},
		"provider-local-services": async () => {
			const { hasManagedProviderLocalServices } = await import("./provider-runtime-lifecycle-B_VEgtSV.mjs");
			if (hasManagedProviderLocalServices()) {
				const { stopManagedProviderLocalServices } = await import("./provider-local-service-q1tyyCxV.mjs");
				await stopManagedProviderLocalServices();
			}
		},
		"provider-transport-dispatchers": async () => {
			const { hasProviderTransportDispatcherPool } = await import("./provider-runtime-lifecycle-B_VEgtSV.mjs");
			if (hasProviderTransportDispatcherPool()) {
				const { closeProviderTransportDispatcherPool } = await import("./provider-transport-dispatcher-pool-u84GT_QT.mjs");
				await closeProviderTransportDispatcherPool();
			}
		},
		"mcp-loopback": async () => {
			const { getActiveMcpLoopbackRuntime } = await import("./mcp-http.loopback-runtime-2GFGMgN3.mjs");
			if (getActiveMcpLoopbackRuntime()) {
				const { closeMcpLoopbackServer } = await import("./mcp-http-KHwRWVq6.mjs");
				await closeMcpLoopbackServer();
			}
		},
		memory: async () => {
			const { hasMemoryRuntime } = await import("./plugins/memory-state.js");
			if (hasMemoryRuntime()) {
				const { closeActiveMemorySearchManagersCore } = await import("./memory-runtime-C0Z6eTr_.mjs");
				await closeActiveMemorySearchManagersCore();
			}
		},
		"agent-databases": async () => {
			const { hasOpenClawAgentDatabaseAsyncResources } = await import("./openclaw-agent-db-resources-DIgHBhZ5.mjs");
			if (!hasOpenClawAgentDatabaseAsyncResources()) return;
			const { closeOpenClawAgentDatabasesAsync } = await import("./openclaw-agent-db-lifecycle-BQzqKX-a.mjs");
			await closeOpenClawAgentDatabasesAsync();
		}
	};
	for (const [name, finalize] of Object.entries(finalizers)) await runCliDisposer(name, finalize, runCleanup);
}
//#endregion
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
			defaultRuntime.exit(exitCode);
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
export { closeCliResources as a, watchCliExitAfterOutput as i, requestExitAfterOneShotOutput as n, getPendingCliDisposers as o, runCliWithExitFinalization as r, runCliDisposer as s, exitCliAfterOutput as t };

import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "../../errors-DPfGDWk1.mjs";
import { i as resolveRuntimeWorkerUrl } from "../../runtime-worker-url-CvMrvFI1.mjs";
import { r as WorkerTaskError } from "../../src-NEpyeLp1.mjs";
import { t as WorkerTaskPool } from "../../worker-task-pool-D6ogd941.mjs";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { t as CODE_MODE_WORKER_WATCHDOG_GRACE_MS } from "../../code-mode-worker-types-BrXHJGAa.mjs";
import { n as EMPTY_CODE_MODE_OUTPUT } from "../../code-mode-json-DSNnk8AT.mjs";
import "../../error-runtime-ikopZs5O.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../process-runtime-CG9_3L3N.mjs";
import { n as CodeModeHeadlessTimeoutError, t as CodeModeHeadlessAbortError } from "../../code-mode-errors-BFRJzhNi.mjs";
import "../../code-mode-executor-runtime-CQMljPHJ.mjs";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
//#region extensions/code-mode-quickjs/src/executor.ts
const getQuickJsModules = createLazyRuntimeModule(async () => {
	const resolve = createRequire(import.meta.url).resolve;
	const sourceExecution = /\.[cm]?ts$/u.test(new URL(import.meta.url).pathname);
	const compile = async (asset, sourceSpecifier) => {
		const binary = sourceExecution ? resolve(sourceSpecifier) : new URL(`../assets/${asset}`, codeModeWorkerUrl());
		return WebAssembly.compile(await readFile(binary));
	};
	const [wasmModule, encoding] = await Promise.all([compile("quickjs.wasm", "quickjs-wasi/quickjs.wasm"), compile("encoding.so", "quickjs-wasi/encoding.so")]).catch((error) => {
		getQuickJsModules.clear();
		throw error;
	});
	return {
		wasmModule,
		wasmExtensions: [{
			name: "encoding",
			wasm: encoding
		}]
	};
});
let sharedPool;
function codeModeWorkerUrl() {
	return resolveRuntimeWorkerUrl({
		currentModuleUrl: import.meta.url,
		sourceWorkerName: "code-mode.worker",
		distWorkerPath: "extensions/code-mode-quickjs/src/code-mode.worker.js",
		package: {
			name: "@openclaw/code-mode-quickjs",
			distWorkerPath: "src/code-mode.worker.js"
		}
	});
}
function getCodeModePool() {
	const workerUrl = codeModeWorkerUrl();
	if (sharedPool?.url !== workerUrl.href) {
		sharedPool?.pool.close();
		sharedPool = {
			url: workerUrl.href,
			pool: new WorkerTaskPool({
				workerUrl,
				workerClass: "compute",
				sharedCompute: true
			})
		};
	}
	return sharedPool.pool;
}
function failedResult(error, code) {
	return {
		status: "failed",
		error: formatErrorMessage(error),
		code,
		failurePhase: "host",
		bridgeDispatchStarted: false,
		output: EMPTY_CODE_MODE_OUTPUT
	};
}
function retainSnapshot(snapshot) {
	let owned = snapshot;
	return {
		executor: "quickjs",
		retainedBytes: snapshot.memory.byteLength,
		async resume(input, options) {
			if (!owned) return failedResult("Code Mode continuation has already been consumed or disposed", "runtime_unavailable");
			const continuation = owned;
			owned = void 0;
			return runQuickJsWorker({
				...input,
				continuation
			}, options);
		},
		async dispose() {
			owned = void 0;
		}
	};
}
async function runQuickJsWorker(workerData, { timeoutMs, signal, inlineHost }) {
	const startedAt = performance.now();
	let workerId;
	let admittedTimeoutMs;
	try {
		const message = await getCodeModePool().run(async () => {
			const modules = await getQuickJsModules();
			admittedTimeoutMs = Math.max(0, workerData.config.timeoutMs - (performance.now() - startedAt));
			return {
				...workerData,
				...modules,
				config: {
					...workerData.config,
					timeoutMs: admittedTimeoutMs
				}
			};
		}, {
			timeoutMs,
			hostTimeout: "owner",
			signal,
			onNotification: inlineHost ? (value) => {
				if (!isRecord(value)) return;
				if (value.status === "worker" && typeof value.workerId === "string") {
					workerId = value.workerId;
					inlineHost?.onWorkerAssigned?.(workerId);
				} else if (value.status === "failure") inlineHost?.onFailure?.(value.error, value.failurePhase === "bridge" ? "bridge" : "guest", workerId);
			} : void 0,
			inputBytes: workerData.kind === "resume" ? workerData.continuation.memory.byteLength : workerData.source.length * 2,
			onInputConsumed: inlineHost?.onInputConsumed,
			onRequest: inlineHost ? async (value, context) => {
				if (!isRecord(value) || value.status !== "boundary") throw new Error("invalid code mode worker boundary");
				if (admittedTimeoutMs === void 0 || !Number.isFinite(admittedTimeoutMs) || admittedTimeoutMs <= 0) throw new Error("invalid code mode worker admission budget");
				if (value.networkContentObserved === true) inlineHost.onNetworkContent?.();
				const { onConsumed, ...input } = await inlineHost.onBoundary(value, {
					...context,
					maxTimeoutMs: admittedTimeoutMs
				});
				return {
					input,
					onConsumed,
					timeoutMs: (input.kind === "continue" ? input.timeoutMs : 0) + CODE_MODE_WORKER_WATCHDOG_GRACE_MS
				};
			} : void 0,
			transferList: (input) => {
				if (input.kind !== "resume") return [];
				return [input.continuation.memory.buffer];
			}
		});
		if (!isRecord(message)) return failedResult("invalid code mode worker response", "internal_error");
		if (message.networkContentObserved === true) inlineHost?.onNetworkContent?.();
		const result = message;
		return result.status === "waiting" ? {
			...result,
			continuation: retainSnapshot(result.continuation)
		} : result;
	} catch (error) {
		inlineHost?.onFailure?.(error, "host", workerId);
		if (signal?.aborted) return failedResult(signal.reason instanceof CodeModeHeadlessTimeoutError ? "code mode timeout exceeded" : "code mode execution aborted", signal.reason instanceof CodeModeHeadlessTimeoutError ? "timeout" : "aborted");
		if (error instanceof CodeModeHeadlessTimeoutError) return failedResult("code mode timeout exceeded", "timeout");
		if (error instanceof CodeModeHeadlessAbortError) return failedResult("code mode execution aborted", "aborted");
		return error instanceof WorkerTaskError && error.code === "timeout" ? failedResult("code mode worker timeout exceeded", "timeout") : failedResult(error, "runtime_unavailable");
	}
}
const codeModeExecutor = {
	id: "quickjs",
	execute: runQuickJsWorker
};
//#endregion
export { codeModeExecutor };

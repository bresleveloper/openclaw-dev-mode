import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-BPNHa36e.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { r as resolveRuntimeWorkerUrl } from "../../runtime-worker-url-B4o9tqvO.mjs";
import { r as WorkerTaskError, t as WorkerTaskPool } from "../../worker-task-pool-cppt7dT0.mjs";
import { t as CODE_MODE_WORKER_WATCHDOG_GRACE_MS } from "../../code-mode-worker-types-BrXHJGAa.mjs";
import { n as EMPTY_CODE_MODE_OUTPUT } from "../../code-mode-json-Cek5lI0P.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { n as CodeModeHeadlessTimeoutError, t as CodeModeHeadlessAbortError } from "../../code-mode-errors-C6Ok9ljJ.mjs";
import "../../code-mode-executor-runtime-yvGkOpkE.mjs";
import "../../process-runtime-BF3dUvYO.mjs";
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
	const [wasmModule, encoding] = await Promise.all([compile("quickjs.wasm", "quickjs-wasi/quickjs.wasm"), compile("encoding.so", "quickjs-wasi/encoding.so")]);
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
			signal,
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

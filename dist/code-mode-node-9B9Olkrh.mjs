import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { r as WorkerTaskError, t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { t as CODE_MODE_WORKER_WATCHDOG_GRACE_MS } from "./code-mode-worker-types-BrXHJGAa.mjs";
import { n as EMPTY_CODE_MODE_OUTPUT } from "./code-mode-json-Cek5lI0P.mjs";
import { n as CodeModeHeadlessTimeoutError, r as codeModeFailureCode, t as CodeModeHeadlessAbortError } from "./code-mode-errors-C6Ok9ljJ.mjs";
//#region src/agents/code-mode-node.ts
const retiringPools = /* @__PURE__ */ new Set();
let idle;
async function closePool(owner) {
	retiringPools.add(owner);
	await owner.tasks.close();
	retiringPools.delete(owner);
}
async function takePool(memoryLimitBytes, signal) {
	signal.throwIfAborted();
	await Promise.all([...retiringPools].map(closePool));
	signal.throwIfAborted();
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.codeModeNode);
	const previous = idle;
	idle = void 0;
	if (previous) {
		clearTimeout(previous.timer);
		const owner = previous.owner;
		if (owner.memoryLimitBytes === memoryLimitBytes && owner.url === workerUrl.href && !owner.tasks.isClosed) return owner;
		await closePool(owner);
		signal.throwIfAborted();
	}
	const owner = {
		url: workerUrl.href,
		memoryLimitBytes,
		tasks: new WorkerTaskPool({
			workerUrl,
			maxWorkers: 1,
			idleTimeoutMs: 0,
			restartOnError: false,
			sharedCompute: true,
			onRetirementFailure: () => {
				retiringPools.add(owner);
			},
			workerOptions: {
				env: {},
				resourceLimits: {
					maxOldGenerationSizeMb: Math.max(1, Math.floor(memoryLimitBytes / 1048576) - 4),
					maxYoungGenerationSizeMb: 4
				}
			}
		})
	};
	return owner;
}
async function releasePool(owner) {
	if (idle || owner.tasks.isClosed) {
		await closePool(owner);
		return;
	}
	const timer = setTimeout(() => {
		if (idle?.owner !== owner) return;
		idle = void 0;
		runBestEffortCleanup({
			cleanup: () => closePool(owner),
			onError: (error) => process.emitWarning(`Code Mode worker retirement failed: ${formatErrorMessage(error)}`)
		});
	}, 6e4);
	timer.unref();
	idle = {
		owner,
		timer
	};
}
function failure(error, code) {
	return {
		status: "failed",
		code,
		error: formatErrorMessage(error),
		failurePhase: "host",
		bridgeDispatchStarted: false,
		output: EMPTY_CODE_MODE_OUTPUT
	};
}
function continuation(pool) {
	let state = "owned";
	let closing;
	return {
		executor: "node",
		retainedBytes: pool.memoryLimitBytes,
		resume(input, options) {
			if (state !== "owned") return Promise.resolve(failure("code mode continuation is no longer available", "runtime_unavailable"));
			state = "resumed";
			return run(pool, input, options);
		},
		dispose() {
			if (state === "resumed" || state === "disposed") return Promise.resolve();
			state = "disposing";
			return closing ??= closePool(pool).then(() => {
				state = "disposed";
			}).finally(() => {
				closing = void 0;
			});
		}
	};
}
async function run(pool, input, options, startedAt = performance.now()) {
	const inlineHost = options.inlineHost;
	let admittedTimeoutMs = 0;
	let retained = false;
	try {
		const preparationMs = performance.now() - startedAt;
		if (input.config.timeoutMs <= preparationMs || options.timeoutMs <= preparationMs) throw new CodeModeHeadlessTimeoutError();
		const result = await pool.tasks.run(() => {
			admittedTimeoutMs = Math.max(0, input.config.timeoutMs - (performance.now() - startedAt));
			if (admittedTimeoutMs <= 0) throw new CodeModeHeadlessTimeoutError();
			return {
				...input,
				config: {
					...input.config,
					timeoutMs: admittedTimeoutMs
				}
			};
		}, {
			timeoutMs: options.timeoutMs - preparationMs,
			signal: options.signal,
			inputBytes: input.kind === "exec" ? input.source.length * 2 : 0,
			onInputConsumed: inlineHost?.onInputConsumed,
			onRequest: inlineHost ? async (value, context) => {
				if (!isRecord(value) || value.status !== "boundary") throw new Error("invalid code mode worker boundary");
				if (!Number.isFinite(admittedTimeoutMs) || admittedTimeoutMs <= 0) throw new Error("invalid code mode worker admission budget");
				if (value.networkContentObserved === true) inlineHost?.onNetworkContent?.();
				const { onConsumed, ...command } = await inlineHost.onBoundary(value, {
					...context,
					maxTimeoutMs: admittedTimeoutMs
				});
				return {
					input: command,
					onConsumed,
					timeoutMs: (command.kind === "continue" ? command.timeoutMs : 0) + CODE_MODE_WORKER_WATCHDOG_GRACE_MS
				};
			} : void 0
		});
		if (result.networkContentObserved === true) inlineHost?.onNetworkContent?.();
		if (result.status === "waiting") {
			retained = true;
			return {
				...result,
				continuation: continuation(pool)
			};
		}
		if (result.status === "completed") {
			await releasePool(pool);
			retained = true;
		}
		return result;
	} catch (error) {
		const reason = options.signal?.aborted ? options.signal.reason : error;
		if (reason instanceof CodeModeHeadlessTimeoutError || error instanceof WorkerTaskError && error.code === "timeout") return failure("code mode timeout exceeded", "timeout");
		if (options.signal?.aborted || reason instanceof CodeModeHeadlessAbortError) return failure("code mode execution aborted", "aborted");
		return failure(error, error instanceof WorkerTaskError ? "runtime_unavailable" : codeModeFailureCode(error));
	} finally {
		if (!retained) await closePool(pool);
	}
}
const nodeCodeModeExecutor = {
	id: "node",
	async execute(input, options) {
		const startedAt = performance.now();
		const deadline = new AbortController();
		const signal = options.signal ? AbortSignal.any([options.signal, deadline.signal]) : deadline.signal;
		const timer = setTimeout(() => deadline.abort(new CodeModeHeadlessTimeoutError()), Math.max(0, Math.min(input.config.timeoutMs, options.timeoutMs)));
		const acquisition = takePool(input.config.memoryLimitBytes, signal);
		let pool;
		try {
			pool = await racePromiseWithAbortSignal(acquisition, signal);
		} catch (error) {
			runBestEffortCleanup({
				cleanup: () => acquisition.then(closePool, () => void 0),
				onError: (cleanupError) => process.emitWarning(`Code Mode worker retirement failed: ${formatErrorMessage(cleanupError)}`)
			});
			if (signal.aborted) {
				const timeout = signal.reason instanceof CodeModeHeadlessTimeoutError;
				return failure(timeout ? "code mode timeout exceeded" : "code mode execution aborted", timeout ? "timeout" : "aborted");
			}
			throw error;
		} finally {
			clearTimeout(timer);
		}
		return run(pool, input, options, startedAt);
	}
};
//#endregion
export { nodeCodeModeExecutor };

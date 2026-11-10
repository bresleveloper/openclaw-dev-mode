import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./concurrency-runtime-Eh-iOyQU.mjs";
//#region extensions/memory-core/src/memory/paused-deadline.ts
function createPausedDeadline(params) {
	const now = () => performance.now();
	let remainingMs = params.timeoutMs;
	let segmentStartedAt = now();
	let paused = false;
	let timer;
	const arm = () => {
		segmentStartedAt = now();
		timer = setTimeout(() => {
			timer = void 0;
			params.expire();
		}, remainingMs);
		if (params.kind === "corpus") timer.unref?.();
	};
	const unsubscribe = params.control?.subscribe((action) => {
		if (params.kind === "corpus" && params.signal.aborted) return;
		paused = action === "pause";
		if (paused) {
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
			remainingMs = Math.max(0, remainingMs - (now() - segmentStartedAt));
			if (remainingMs === 0) params.expire();
		} else if (!params.signal.aborted) arm();
	});
	return {
		start() {
			if (!paused) arm();
		},
		isExpired: () => !paused && now() - segmentStartedAt >= remainingMs,
		close() {
			unsubscribe?.();
			if (timer) clearTimeout(timer);
		}
	};
}
async function runEmbeddingOperationWithTimeout(params) {
	const controller = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
	if (!Number.isFinite(params.timeoutMs) || params.timeoutMs <= 0) return await params.run(signal);
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const timeoutError = new Error(params.message);
	const timeout = createDeferredCore();
	const deadline = createPausedDeadline({
		kind: "embedding",
		timeoutMs,
		signal,
		control: params.deadlineControl,
		expire: () => {
			timeout.reject(timeoutError);
			controller.abort(timeoutError);
		}
	});
	deadline.start();
	try {
		const operation = params.run(signal);
		const result = await Promise.race([operation, timeout.promise]);
		params.signal?.throwIfAborted();
		if (deadline.isExpired()) {
			controller.abort(timeoutError);
			throw timeoutError;
		}
		return result;
	} finally {
		deadline.close();
	}
}
//#endregion
export { runEmbeddingOperationWithTimeout as n, createPausedDeadline as t };

import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CkhMiRw8.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as compactionWatchdogs } from "./compaction-watchdog-Brxblb6T.mjs";
import { t as runAbortableTimeout } from "./with-timeout-BD1Rfbmo.mjs";
//#region src/agents/embedded-agent-runner/compaction-safety-timeout.ts
const EMBEDDED_COMPACTION_TIMEOUT_MS = 18e4;
const COMPACTION_CEILING_WINDOWS = 10;
function resolveCompactionTimeoutMs(cfg) {
	return finiteSecondsToTimerSafeMilliseconds(cfg?.agents?.defaults?.compaction?.timeoutSeconds, { floorSeconds: true }) ?? EMBEDDED_COMPACTION_TIMEOUT_MS;
}
async function compactWithSafetyTimeout(compact, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, opts) {
	const deadlineAt = opts?.deadlineAt ?? Date.now() + timeoutMs * COMPACTION_CEILING_WINDOWS;
	let canceled = false;
	const cancel = () => {
		if (canceled) return;
		canceled = true;
		try {
			opts?.onCancel?.();
		} catch {}
	};
	return await runAbortableTimeout(async (timeoutSignal, resetTimeout) => {
		const abortSignal = opts?.abortSignal;
		const composedAbortSignal = timeoutSignal && abortSignal ? AbortSignal.any([timeoutSignal, abortSignal]) : timeoutSignal ?? abortSignal;
		timeoutSignal?.addEventListener("abort", cancel, { once: true });
		try {
			return await racePromiseWithAbortSignal(() => trackAsyncWork(() => compact(composedAbortSignal, resetTimeout)), abortSignal, (signal) => {
				cancel();
				const reason = signal.reason;
				return reason instanceof Error ? reason : createAbortError("aborted", reason ? { cause: reason } : void 0);
			});
		} finally {
			timeoutSignal?.removeEventListener("abort", cancel);
		}
	}, timeoutMs, "Compaction", deadlineAt - Date.now());
}
/**
* Every engine is bounded by one host window and receives the composed
* timeout/caller cancellation signal. Only the built-in runtime delegate, reached
* with that signal, refreshes the window while its model requests make progress,
* up to the operation ceiling it also receives.
*/
function compactContextEngineWithSafetyTimeout(contextEngine, params, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, abortSignal) {
	const deadlineAt = Date.now() + timeoutMs * COMPACTION_CEILING_WINDOWS;
	return compactWithSafetyTimeout((compactionAbortSignal, resetTimeout) => {
		if (!compactionAbortSignal) return contextEngine.compact(params);
		compactionWatchdogs.set(compactionAbortSignal, {
			reset: resetTimeout,
			deadlineAt
		});
		return contextEngine.compact({
			...params,
			abortSignal: compactionAbortSignal
		});
	}, timeoutMs, abortSignal ? {
		abortSignal,
		deadlineAt
	} : { deadlineAt });
}
//#endregion
export { compactWithSafetyTimeout as n, resolveCompactionTimeoutMs as r, compactContextEngineWithSafetyTimeout as t };

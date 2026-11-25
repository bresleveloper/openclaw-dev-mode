import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { racePromiseWithAbortSignal, raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
// extensions/feishu/src/async.ts
const RACE_TIMEOUT = Symbol("race-timeout");
const RACE_ABORT = Symbol("race-abort");
async function raceWithTimeoutAndAbort(promise, options = {}) {
	if (options.abortSignal?.aborted) return { status: "aborted" };
	try {
		const result = options.timeoutMs === void 0 ? await racePromiseWithAbortSignal(promise, options.abortSignal, () => RACE_ABORT) : await raceWithTimeout(promise, resolveTimerTimeoutMs(options.timeoutMs, 1), () => RACE_TIMEOUT, {
			signal: options.abortSignal,
			onAbort: () => RACE_ABORT
		});
		if (result === RACE_TIMEOUT) return { status: "timeout" };
		if (result === RACE_ABORT) return { status: "aborted" };
		return {
			status: "resolved",
			value: result
		};
	} catch (error) {
		if (error === RACE_ABORT) return { status: "aborted" };
		throw error;
	}
}
function waitForAbortableDelay(delayMs, abortSignal) {
	if (abortSignal?.aborted) return Promise.resolve(false);
	return sleepWithAbort(resolveTimerTimeoutMs(delayMs, 1), abortSignal, { ref: false }).then(() => true, (error) => {
		if (error instanceof Error && error.name === "AbortError") return false;
		throw error;
	});
}
export { waitForAbortableDelay as n, raceWithTimeoutAndAbort as t };

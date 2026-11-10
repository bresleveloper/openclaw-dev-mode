import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as sleepWithAbort, i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
//#region src/utils/sleep.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms, signal) {
	const delayMs = resolveTimerTimeoutMs(ms, 0, 0);
	if (signal) {
		if (signal.aborted) return Promise.reject(createAbortError("aborted", { cause: signal.reason ?? /* @__PURE__ */ new Error("aborted") }));
		return sleepWithAbort(delayMs, signal);
	}
	return new Promise((resolve) => {
		setTimeout(resolve, delayMs);
	});
}
//#endregion
export { sleep as t };

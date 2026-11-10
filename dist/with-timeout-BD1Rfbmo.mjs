import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
//#region src/node-host/with-timeout.ts
/**
* Run bounded work; dynamic labels identify the stage pending at the deadline.
* `resetTimeout` re-arms the window, but never past `maxTotalMs` from the start.
*/
async function runAbortableTimeout(work, timeoutMs, label, maxTotalMs) {
	const resolved = timeoutMs === void 0 ? void 0 : resolveTimerTimeoutMs(timeoutMs, 1);
	if (!resolved) return await work(void 0, () => {});
	const abortCtrl = new AbortController();
	const deadline = maxTotalMs === void 0 ? void 0 : performance.now() + maxTotalMs;
	let timer;
	let settled = false;
	const resetTimeout = () => {
		const remainingMs = (deadline ?? Number.POSITIVE_INFINITY) - performance.now();
		if (settled || abortCtrl.signal.aborted || timer && remainingMs <= 0) return;
		clearTimeout(timer);
		timer = setTimeout(() => {
			const operation = typeof label === "function" ? label() : label ?? "request";
			abortCtrl.abort(/* @__PURE__ */ new Error(`${operation} timed out`));
		}, Math.max(0, Math.min(resolved, remainingMs)));
		timer.unref?.();
	};
	resetTimeout();
	try {
		return await racePromiseWithAbortSignal(work(abortCtrl.signal, resetTimeout), abortCtrl.signal, (signal) => signal.reason);
	} finally {
		settled = true;
		clearTimeout(timer);
	}
}
//#endregion
export { runAbortableTimeout as t };

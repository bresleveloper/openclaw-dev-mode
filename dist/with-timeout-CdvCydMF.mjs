import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
//#region src/node-host/with-timeout.ts
/** Timeout wrapper for node-host operations using AbortSignal cancellation. */
/** Run bounded work; dynamic labels identify the stage pending at the deadline. */
async function runAbortableTimeout(work, timeoutMs, label) {
	const resolved = timeoutMs === void 0 ? void 0 : resolveTimerTimeoutMs(timeoutMs, 1);
	if (!resolved) return await work(void 0, () => {});
	const abortCtrl = new AbortController();
	let timer;
	let settled = false;
	const resetTimeout = () => {
		if (settled || abortCtrl.signal.aborted) return;
		clearTimeout(timer);
		timer = setTimeout(() => {
			const operation = typeof label === "function" ? label() : label ?? "request";
			abortCtrl.abort(/* @__PURE__ */ new Error(`${operation} timed out`));
		}, resolved);
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

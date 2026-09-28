import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
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
	const aborted = createDeferredCore();
	const abortListener = () => aborted.reject(abortCtrl.signal.reason);
	abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
	try {
		return await Promise.race([work(abortCtrl.signal, resetTimeout), aborted.promise]);
	} finally {
		settled = true;
		clearTimeout(timer);
		abortCtrl.signal.removeEventListener("abort", abortListener);
	}
}
//#endregion
export { runAbortableTimeout as t };

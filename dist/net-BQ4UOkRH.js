import { f as clampTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-env-Ds0QYZS5.js";
import "./plugin-runtime-d2eryCGb.js";
import "./gateway-runtime-BE_o8NR2.js";
import "./cli-runtime-DJOXyIoh.js";
//#region extensions/browser/src/sdk-node-runtime.ts
function normalizeTimeoutMs(timeoutMs) {
	return clampTimerTimeoutMs(timeoutMs);
}
function createTimeoutAbortSignal(timeoutMs, label) {
	const controller = new AbortController();
	const error = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
	const timer = setTimeout(() => controller.abort(error), timeoutMs);
	timer.unref?.();
	return {
		controller,
		error,
		timer
	};
}
function waitForAbort(signal, fallback) {
	if (signal.aborted) return {
		promise: Promise.reject(toLintErrorObject(signal.reason ?? fallback, "Non-Error rejection")),
		cleanup: () => void 0
	};
	let listener;
	return {
		cleanup: () => {
			if (listener) signal.removeEventListener("abort", listener);
		},
		promise: new Promise((_, reject) => {
			listener = () => reject(toLintErrorObject(signal.reason ?? fallback, "Non-Error rejection"));
			signal.addEventListener("abort", listener, { once: true });
		})
	};
}
/** Runs async work with an optional aborting timeout signal. */
async function withTimeout(work, timeoutMs, label) {
	const resolved = normalizeTimeoutMs(timeoutMs);
	if (!resolved) return await work(void 0);
	const timeout = createTimeoutAbortSignal(resolved, label);
	const abort = waitForAbort(timeout.controller.signal, timeout.error);
	try {
		return await Promise.race([work(timeout.controller.signal), abort.promise]);
	} finally {
		clearTimeout(timeout.timer);
		abort.cleanup();
	}
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { withTimeout as t };

import { withTimeout } from "openclaw/plugin-sdk/time-runtime";
//#region extensions/codex/src/app-server/timeout.ts
function resolveAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : new Error("Codex app-server operation aborted", { cause: signal.reason });
}
async function withTimeout$1(promise, timeoutMs, timeoutMessage, createError) {
	return await withTimeout(promise, timeoutMs, {
		message: timeoutMessage,
		...createError ? { createError } : {}
	});
}
/** Bounds an operation by both its owner lifecycle and one total wall-clock budget. */
async function withAbortableTimeout(params) {
	const signal = params.signal;
	if (signal?.aborted) throw resolveAbortError(signal);
	let removeAbortListener;
	const operation = signal ? Promise.race([params.promise, new Promise((_, reject) => {
		const onAbort = () => reject(resolveAbortError(signal));
		signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
	})]) : params.promise;
	try {
		return await withTimeout$1(operation, params.timeoutMs, params.timeoutMessage, params.createTimeoutError);
	} finally {
		removeAbortListener?.();
	}
}
async function waitForPromiseOrAbort(promise, signal) {
	if (signal.aborted) return false;
	let removeAbort;
	try {
		return await Promise.race([promise.then(() => true), new Promise((resolve) => {
			const onAbort = () => resolve(false);
			signal.addEventListener("abort", onAbort, { once: true });
			removeAbort = () => signal.removeEventListener("abort", onAbort);
			if (signal.aborted) onAbort();
		})]);
	} finally {
		removeAbort?.();
	}
}
function abortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : new Error(String(signal.reason ?? "codex app-server thread route aborted"));
}
//#endregion
export { withTimeout$1 as i, waitForPromiseOrAbort as n, withAbortableTimeout as r, abortReason as t };

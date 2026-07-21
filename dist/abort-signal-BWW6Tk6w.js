//#region src/infra/abort-signal.ts
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
function isAbortError(error) {
	if (!error || typeof error !== "object") return false;
	if (("name" in error ? String(error.name) : "") === "AbortError") return true;
	return ("message" in error && typeof error.message === "string" ? error.message : "") === "This operation was aborted";
}
function mergeAbortSignals(signals) {
	const activeSignals = [];
	for (const signal of signals) if (signal && !activeSignals.includes(signal)) activeSignals.push(signal);
	if (activeSignals.length <= 1) return {
		signal: activeSignals[0],
		dispose: () => {}
	};
	const controller = new AbortController();
	const listeners = /* @__PURE__ */ new Map();
	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		for (const [signal, listener] of listeners) signal.removeEventListener("abort", listener);
		listeners.clear();
	};
	const abortFrom = (signal) => {
		if (controller.signal.aborted) return;
		controller.abort(signal.reason);
		dispose();
	};
	for (const signal of activeSignals) {
		if (signal.aborted) {
			abortFrom(signal);
			break;
		}
		const listener = () => abortFrom(signal);
		listeners.set(signal, listener);
		signal.addEventListener("abort", listener, { once: true });
		if (controller.signal.aborted || signal.aborted) {
			if (!controller.signal.aborted) abortFrom(signal);
			break;
		}
	}
	return {
		signal: controller.signal,
		dispose
	};
}
/** Resolves when the signal aborts, or immediately when no wait is needed. */
async function waitForAbortSignal(signal) {
	if (!signal || signal.aborted) return;
	await new Promise((resolve) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
export { waitForAbortSignal as i, isAbortError as n, mergeAbortSignals as r, createAbortError as t };

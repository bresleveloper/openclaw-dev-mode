//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Clamps finite millisecond values into the Node-safe timer range. */
function clampTimerTimeoutMs(valueMs, minMs = 1) {
	const value = asFiniteNumber(valueMs);
	if (value === void 0) return;
	return Math.min(Math.max(Math.floor(value), Math.max(1, Math.floor(minMs))), MAX_TIMER_TIMEOUT_MS);
}
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
//#endregion
//#region packages/ai/src/utils/stream-first-event-timeout.ts
function getFirstStreamEventTimeoutMs(options) {
	return options?.firstEventTimeoutMs;
}
function getFirstStreamEventTimeoutHandler(options) {
	return options?.onFirstEventTimeout;
}
function formatOptionalField(name, value) {
	return value ? ` ${name}=${value}` : "";
}
function createFirstStreamEventTimeoutError(context) {
	const stage = context.stage ? `${context.stage} ` : "";
	const details = [
		formatOptionalField("provider", context.provider),
		formatOptionalField("api", context.api),
		formatOptionalField("model", context.model)
	].join("");
	return /* @__PURE__ */ new Error(`${stage}HTTP stream opened but did not deliver a first SSE event within ${context.timeoutMs}ms after streaming headers (first-event timeout).${details}` + (context.hint ? ` ${context.hint}` : ""));
}
function createFirstStreamEventAbortController(parentSignal) {
	const controller = new AbortController();
	const abortFromParent = () => {
		if (!controller.signal.aborted) controller.abort(parentSignal?.reason);
	};
	if (parentSignal?.aborted) abortFromParent();
	else parentSignal?.addEventListener("abort", abortFromParent, { once: true });
	return {
		signal: controller.signal,
		abort(reason) {
			if (!controller.signal.aborted) controller.abort(reason);
		},
		dispose() {
			parentSignal?.removeEventListener("abort", abortFromParent);
		}
	};
}
function withFirstStreamEventTimeout(stream, context) {
	const timeoutMs = clampTimerTimeoutMs(context.timeoutMs);
	if (timeoutMs === void 0 || context.timeoutMs <= 0) return stream;
	const timeoutContext = {
		...context,
		timeoutMs
	};
	return { async *[Symbol.asyncIterator]() {
		const iterator = stream[Symbol.asyncIterator]();
		let timer;
		let completed = false;
		const clear = () => {
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		};
		try {
			const first = await new Promise((resolve, reject) => {
				timer = setTimeout(() => {
					const timeoutError = createFirstStreamEventTimeoutError(timeoutContext);
					timeoutContext.onTimeout?.(timeoutError);
					timeoutContext.abort?.(timeoutError);
					reject(timeoutError);
				}, timeoutMs);
				timer.unref?.();
				iterator.next().then(resolve, reject);
			}).finally(clear);
			if (first.done) {
				completed = true;
				return;
			}
			yield first.value;
			for (;;) {
				const next = await iterator.next();
				if (next.done) {
					completed = true;
					return;
				}
				yield next.value;
			}
		} finally {
			clear();
			if (!completed) iterator.return?.().catch(() => void 0);
		}
	} };
}
//#endregion
export { withFirstStreamEventTimeout as a, getFirstStreamEventTimeoutMs as i, createFirstStreamEventTimeoutError as n, clampTimerTimeoutMs as o, getFirstStreamEventTimeoutHandler as r, resolveTimerTimeoutMs as s, createFirstStreamEventAbortController as t };

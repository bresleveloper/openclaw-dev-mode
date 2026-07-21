//#region packages/ai/src/utils/deferred-event-buffer.ts
function createDeferredEventBuffer(sink, onBufferedEvent) {
	let events = [];
	return {
		push(event) {
			events.push(event);
			onBufferedEvent?.();
		},
		flush() {
			for (const event of events) sink.push(event);
			events = [];
		},
		discard() {
			events = [];
		}
	};
}
//#endregion
//#region packages/ai/src/utils/llm-request-activity.ts
const requestActivityListeners = /* @__PURE__ */ new WeakMap();
function notifyLlmRequestActivity(signal) {
	if (!signal) return;
	for (const listener of requestActivityListeners.get(signal) ?? []) listener();
}
function onLlmRequestActivity(signal, listener) {
	const listeners = requestActivityListeners.get(signal) ?? /* @__PURE__ */ new Set();
	listeners.add(listener);
	requestActivityListeners.set(signal, listeners);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0) requestActivityListeners.delete(signal);
	};
}
//#endregion
export { onLlmRequestActivity as n, createDeferredEventBuffer as r, notifyLlmRequestActivity as t };

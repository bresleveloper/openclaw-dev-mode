// packages/ai/src/utils/llm-request-activity.ts
const requestActivityListeners = /* @__PURE__ */ new WeakMap();
function notifyLlmRequestActivity(signal, progress = true, progressTimeoutMs) {
	if (!signal) return;
	for (const listener of requestActivityListeners.get(signal) ?? []) listener(progress, progressTimeoutMs);
}
function onLlmRequestActivity(signal, listener) {
	const listeners = requestActivityListeners.get(signal) ?? /* @__PURE__ */ new Set();
	listeners.add(listener);
	requestActivityListeners.set(signal, listeners);
	return () => {
		if (listeners.delete(listener) && listeners.size === 0) requestActivityListeners.delete(signal);
	};
}
export { onLlmRequestActivity as n, notifyLlmRequestActivity as t };

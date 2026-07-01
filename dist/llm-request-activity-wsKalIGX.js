//#region src/shared/anthropic-refusal.ts
function readNullableString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readAnthropicRefusalDetails(value) {
	if (!value || typeof value !== "object") return {
		category: null,
		explanation: null
	};
	const details = value;
	return {
		category: readNullableString(details.category),
		explanation: readNullableString(details.explanation)
	};
}
function formatAnthropicRefusalMessage(details) {
	return `Anthropic refusal${details.category ? ` (category: ${details.category})` : ""}${details.explanation ? `: ${details.explanation}` : "."}`;
}
function applyAnthropicRefusal(output, stopDetails, provider) {
	const details = readAnthropicRefusalDetails(stopDetails);
	output.stopReason = "error";
	output.errorMessage = formatAnthropicRefusalMessage(details);
	output.diagnostics = [...output.diagnostics ?? [], {
		type: "provider_refusal",
		timestamp: Date.now(),
		details: {
			provider,
			category: details.category,
			explanation: details.explanation
		}
	}];
}
//#endregion
//#region src/shared/deferred-event-buffer.ts
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
//#region src/shared/llm-request-activity.ts
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
export { applyAnthropicRefusal as i, onLlmRequestActivity as n, createDeferredEventBuffer as r, notifyLlmRequestActivity as t };

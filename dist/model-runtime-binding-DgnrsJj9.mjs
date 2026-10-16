//#region src/llm/model-runtime-binding.ts
const MODEL_LLM_RUNTIME = Symbol("openclaw.modelLlmRuntime");
const streamLlmRuntimes = /* @__PURE__ */ new WeakMap();
function bindModelRuntime(model, binding) {
	const bound = { ...model };
	Object.defineProperty(bound, MODEL_LLM_RUNTIME, {
		value: binding,
		enumerable: false
	});
	return bound;
}
/** Carries the prepared lifecycle runtime without changing the serialized model shape. */
function bindModelLlmRuntime(model, runtime, completionTransport) {
	return bindModelRuntime(model, {
		runtime,
		completionTransport,
		completionOwner: getModelCompletionOwner(model)
	});
}
function bindModelCompletionOwner(model, completionOwner) {
	return bindModelRuntime(model, {
		...model[MODEL_LLM_RUNTIME],
		completionOwner
	});
}
function getModelCompletionOwner(model) {
	return model[MODEL_LLM_RUNTIME]?.completionOwner;
}
function getModelLlmRuntime(model) {
	return model[MODEL_LLM_RUNTIME]?.runtime;
}
function getModelCompletionTransport(model) {
	return model[MODEL_LLM_RUNTIME]?.completionTransport;
}
/** Associates a prepared stream entry point with the runtime that owns it. */
function bindStreamLlmRuntime(streamFn, runtime) {
	streamLlmRuntimes.set(streamFn, runtime);
}
function getStreamLlmRuntime(streamFn) {
	return streamFn ? streamLlmRuntimes.get(streamFn) : void 0;
}
//#endregion
export { getModelCompletionTransport as a, getModelCompletionOwner as i, bindModelLlmRuntime as n, getModelLlmRuntime as o, bindStreamLlmRuntime as r, getStreamLlmRuntime as s, bindModelCompletionOwner as t };

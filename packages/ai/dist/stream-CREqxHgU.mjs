//#region packages/ai/src/api-registry.ts
function wrapStream(api, stream) {
	return (model, context, options) => {
		if (model.api !== api) throw new Error(`Mismatched api: ${model.api} expected ${api}`);
		return stream(model, context, options);
	};
}
function wrapStreamSimple(api, streamSimple) {
	return (model, context, options) => {
		if (model.api !== api) throw new Error(`Mismatched api: ${model.api} expected ${api}`);
		return streamSimple(model, context, options);
	};
}
/** Creates an isolated provider registry for one runtime or tenant. */
function createApiRegistry() {
	const providers = /* @__PURE__ */ new Map();
	function registerApiProvider(provider, sourceId) {
		providers.set(provider.api, {
			provider: {
				api: provider.api,
				stream: wrapStream(provider.api, provider.stream),
				streamSimple: wrapStreamSimple(provider.api, provider.streamSimple)
			},
			sourceId
		});
	}
	function getApiProvider(api) {
		return providers.get(api)?.provider;
	}
	function getApiProviders() {
		return Array.from(providers.values(), (entry) => entry.provider);
	}
	function unregisterApiProviders(sourceId) {
		for (const [api, entry] of providers.entries()) if (entry.sourceId === sourceId) providers.delete(api);
	}
	return {
		registerApiProvider,
		getApiProvider,
		getApiProviders,
		unregisterApiProviders,
		clearApiProviders: () => providers.clear()
	};
}
//#endregion
//#region packages/ai/src/stream.ts
/** Creates an isolated LLM runtime backed by the supplied provider registry. */
function createLlmRuntime(registry = createApiRegistry()) {
	function resolveApiProvider(api) {
		const provider = registry.getApiProvider(api);
		if (!provider) throw new Error(`No API provider registered for api: ${api}`);
		return provider;
	}
	function stream(model, context, options) {
		return resolveApiProvider(model.api).stream(model, context, options);
	}
	async function complete(model, context, options) {
		return stream(model, context, options).result();
	}
	function streamSimple(model, context, options) {
		return resolveApiProvider(model.api).streamSimple(model, context, options);
	}
	async function completeSimple(model, context, options) {
		return streamSimple(model, context, options).result();
	}
	return {
		registry,
		stream,
		complete,
		streamSimple,
		completeSimple
	};
}
//#endregion
export { createApiRegistry as n, createLlmRuntime as t };

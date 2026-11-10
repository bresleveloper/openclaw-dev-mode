import { i as bindAssistantMessageEventStream, o as getEventStreamCompletion } from "./event-stream-X2gmsUWv.mjs";
import { i as getDefaultAiTransportHost, n as createAiTransportHost, o as runWithAiTransportHost, s as supportsScopedAiTransportHosts } from "./host-CWt55nnF.mjs";
import { t as cleanupSessionResources } from "./session-resources-vKvGIE3J.mjs";
//#region packages/ai/src/api-registry.ts
function wrapStream(api, stream) {
	return (model, context, options) => {
		if (model.api !== api) throw new Error(`Mismatched api: ${model.api} expected ${api}`);
		return stream(model, context, options);
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
				streamSimple: wrapStream(provider.api, provider.streamSimple)
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
function retainUnscopedStreamLifetime(stream, runWithHost) {
	let releaseLifetime;
	const lifetime = new Promise((resolve) => {
		releaseLifetime = resolve;
	});
	runWithHost(() => lifetime);
	let released = false;
	let resultSettled = false;
	let bufferSettled = false;
	const releaseIfSettled = () => {
		if (!released && resultSettled && bufferSettled) {
			released = true;
			releaseLifetime();
		}
	};
	const push = stream.push.bind(stream);
	const end = stream.end.bind(stream);
	const result = stream.result.bind(stream);
	const iterate = stream[Symbol.asyncIterator].bind(stream);
	const bufferedEvents = [];
	const bufferWaiters = /* @__PURE__ */ new Set();
	let bufferError;
	let resultPromise;
	const notifyBufferWaiters = () => {
		for (const resolve of bufferWaiters) resolve();
		bufferWaiters.clear();
	};
	const observeResult = () => {
		if (!resultPromise) {
			let providerResult;
			try {
				providerResult = runWithHost(result);
			} catch (error) {
				providerResult = Promise.reject(new Error("Stream result failed", { cause: error }));
			}
			const settleResult = () => {
				resultSettled = true;
				releaseIfSettled();
			};
			providerResult.then(settleResult, settleResult);
			resultPromise = providerResult;
		}
		return resultPromise;
	};
	(async () => {
		try {
			const iterator = runWithHost(iterate);
			while (true) {
				const next = await runWithHost(() => iterator.next());
				if (next.done) return;
				bufferedEvents.push(next.value);
				notifyBufferWaiters();
			}
		} catch (error) {
			bufferError = new Error("Stream iteration failed", { cause: error });
		} finally {
			bufferSettled = true;
			notifyBufferWaiters();
			observeResult().catch(() => {});
			releaseIfSettled();
		}
	})();
	return {
		push: (event) => runWithHost(() => push(event)),
		end: (message) => runWithHost(() => end(message)),
		result: observeResult,
		[Symbol.asyncIterator]() {
			let index = 0;
			let done = false;
			const next = async () => {
				if (done) return {
					done: true,
					value: void 0
				};
				if (index < bufferedEvents.length) {
					const value = bufferedEvents[index];
					if (value === void 0) throw new Error("Buffered stream event is missing");
					index += 1;
					return {
						done: false,
						value
					};
				}
				if (bufferSettled) {
					if (bufferError) throw bufferError;
					done = true;
					return {
						done: true,
						value: void 0
					};
				}
				await new Promise((resolve) => {
					bufferWaiters.add(resolve);
				});
				return next();
			};
			return {
				[Symbol.asyncIterator]() {
					return this;
				},
				next,
				async return(value) {
					done = true;
					notifyBufferWaiters();
					return {
						done: true,
						value
					};
				}
			};
		}
	};
}
function createRuntime(registry, transportHost) {
	const explicitHost = transportHost === void 0 ? void 0 : createAiTransportHost(transportHost);
	const resolveRuntimeHost = () => explicitHost ?? getDefaultAiTransportHost();
	const startStream = (start) => {
		const host = resolveRuntimeHost();
		const runWithStreamHost = (operation) => runWithAiTransportHost(host, operation);
		const started = runWithStreamHost(start);
		const completion = getEventStreamCompletion(started);
		const bound = bindAssistantMessageEventStream(started, runWithStreamHost);
		if (completion) {
			if (!supportsScopedAiTransportHosts()) {
				let producerSettled = false;
				const observedCompletion = completion.finally(() => {
					producerSettled = true;
				});
				runWithStreamHost(() => observedCompletion);
				const result = runWithStreamHost(() => started.result());
				return bindAssistantMessageEventStream(started, (operation) => producerSettled ? operation() : runWithStreamHost(operation), { result: () => result });
			}
			runWithStreamHost(() => completion);
		}
		return !completion && !supportsScopedAiTransportHosts() ? retainUnscopedStreamLifetime(started, runWithStreamHost) : bound;
	};
	function resolveApiProvider(api) {
		const provider = registry.getApiProvider(api);
		if (!provider) throw new Error(`No API provider registered for api: ${api}`);
		return provider;
	}
	function stream(model, context, options) {
		return startStream(() => resolveApiProvider(model.api).stream(model, context, options));
	}
	async function complete(model, context, options) {
		return stream(model, context, options).result();
	}
	function streamSimple(model, context, options) {
		return startStream(() => resolveApiProvider(model.api).streamSimple(model, context, options));
	}
	async function completeSimple(model, context, options) {
		return streamSimple(model, context, options).result();
	}
	function cleanupSessionResources$1(sessionId) {
		if (!supportsScopedAiTransportHosts()) {
			cleanupSessionResources(sessionId);
			return;
		}
		const host = resolveRuntimeHost();
		try {
			runWithAiTransportHost(host, () => cleanupSessionResources(sessionId, host));
		} catch (error) {
			throw new AggregateError([error], "Failed to cleanup runtime session resources", { cause: error });
		}
	}
	return {
		registry,
		stream,
		complete,
		streamSimple,
		completeSimple,
		cleanupSessionResources: cleanupSessionResources$1
	};
}
/** Creates an isolated LLM runtime backed by the supplied provider registry. */
function createLlmRuntime(registry = createApiRegistry()) {
	return createRuntime(registry);
}
/** Creates a Node runtime whose provider work retains an explicit transport host. */
function createNodeLlmRuntime(registry = createApiRegistry(), transportHost = {}) {
	if (!supportsScopedAiTransportHosts()) throw new Error("Explicit AI transport hosts require Node.js async context support");
	return createRuntime(registry, transportHost);
}
//#endregion
export { createNodeLlmRuntime as n, createApiRegistry as r, createLlmRuntime as t };

import { i as bindAssistantMessageEventStream, o as getEventStreamCompletion } from "./event-stream-C5AbCAaZ.mjs";
import { i as getDefaultAiTransportHost, n as createAiTransportHost, o as runWithAiTransportHost, s as supportsScopedAiTransportHosts } from "./host-u3o8XiAp.mjs";
import { i as registerSessionResourceCleanupObserver, t as cleanupSessionResources } from "./session-resources-D1wgDQ8C.mjs";
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
const defaultHostSessionReferences = /* @__PURE__ */ new Set();
const defaultHostSessionFinalizer = new FinalizationRegistry((reference) => defaultHostSessionReferences.delete(reference));
function trackDefaultHostSessions(sessions) {
	const reference = new WeakRef(sessions);
	defaultHostSessionReferences.add(reference);
	defaultHostSessionFinalizer.register(sessions, reference, reference);
}
registerSessionResourceCleanupObserver((sessionId, owner) => {
	for (const reference of defaultHostSessionReferences) {
		const sessions = reference.deref();
		if (!sessions) {
			defaultHostSessionReferences.delete(reference);
			continue;
		}
		const pruneOwners = (owners) => {
			if (owner) owners.delete(owner);
			else owners.clear();
			return owners.size === 0;
		};
		if (sessionId) {
			const owners = sessions.get(sessionId);
			if (owners && pruneOwners(owners)) sessions.delete(sessionId);
			continue;
		}
		for (const [ownedSessionId, owners] of sessions) if (pruneOwners(owners)) sessions.delete(ownedSessionId);
	}
});
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
	const wrapIterationError = (error) => new Error("Stream iteration failed", { cause: error });
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
			providerResult.then(() => {
				resultSettled = true;
				releaseIfSettled();
			}, () => {
				resultSettled = true;
				releaseIfSettled();
			});
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
			bufferError = wrapIterationError(error);
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
	const defaultHostsBySession = /* @__PURE__ */ new Map();
	if (!explicitHost) trackDefaultHostSessions(defaultHostsBySession);
	const resolveRuntimeHost = () => explicitHost ?? getDefaultAiTransportHost();
	const startStream = (start, sessionId) => {
		const host = resolveRuntimeHost();
		if (!explicitHost) {
			const hosts = defaultHostsBySession.get(sessionId) ?? /* @__PURE__ */ new Set();
			hosts.add(host);
			defaultHostsBySession.set(sessionId, hosts);
		}
		const runWithStreamHost = (operation) => runWithAiTransportHost(host, operation);
		const started = runWithStreamHost(start);
		const completion = getEventStreamCompletion(started);
		const bound = bindAssistantMessageEventStream(started, runWithStreamHost);
		if (completion) {
			if (!supportsScopedAiTransportHosts()) {
				let producerSettled = false;
				const observedCompletion = completion.then(() => {
					producerSettled = true;
				}, (error) => {
					producerSettled = true;
					throw error;
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
		return startStream(() => resolveApiProvider(model.api).stream(model, context, options), options?.sessionId);
	}
	async function complete(model, context, options) {
		return stream(model, context, options).result();
	}
	function streamSimple(model, context, options) {
		return startStream(() => resolveApiProvider(model.api).streamSimple(model, context, options), options?.sessionId);
	}
	async function completeSimple(model, context, options) {
		return streamSimple(model, context, options).result();
	}
	function cleanupSessionResources$1(sessionId) {
		if (!supportsScopedAiTransportHosts()) {
			cleanupSessionResources(sessionId);
			return;
		}
		const usedHosts = /* @__PURE__ */ new Set();
		if (!explicitHost) {
			if (sessionId) for (const host of defaultHostsBySession.get(sessionId) ?? []) usedHosts.add(host);
			else for (const owners of defaultHostsBySession.values()) for (const host of owners) usedHosts.add(host);
			usedHosts.add(getDefaultAiTransportHost());
		}
		const hosts = explicitHost ? [explicitHost] : [...usedHosts];
		const errors = [];
		for (const host of hosts) try {
			runWithAiTransportHost(host, () => cleanupSessionResources(sessionId, host));
		} catch (error) {
			errors.push(error);
		}
		if (errors.length > 0) throw new AggregateError(errors, "Failed to cleanup runtime session resources");
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

import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import "./env-api-keys-8q9bEA0v.js";
//#region packages/llm-runtime/src/api-registry.ts
const apiProviderRegistry = /* @__PURE__ */ new Map();
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
/** Registers or replaces the provider implementation for an API id. */
function registerApiProvider(provider, sourceId) {
	apiProviderRegistry.set(provider.api, {
		provider: {
			api: provider.api,
			stream: wrapStream(provider.api, provider.stream),
			streamSimple: wrapStreamSimple(provider.api, provider.streamSimple)
		},
		sourceId
	});
}
/** Looks up a registered API provider by API id. */
function getApiProvider(api) {
	return apiProviderRegistry.get(api)?.provider;
}
/** Lists all currently registered API providers. */
function getApiProviders() {
	return Array.from(apiProviderRegistry.values(), (entry) => entry.provider);
}
/** Removes all providers registered by a plugin/source id. */
function unregisterApiProviders(sourceId) {
	for (const [api, entry] of apiProviderRegistry.entries()) if (entry.sourceId === sourceId) apiProviderRegistry.delete(api);
}
//#endregion
//#region src/llm/providers/register-builtins.ts
/** Source id used for built-in API provider registrations. */
const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
let anthropicProviderModulePromise;
let azureOpenAIResponsesProviderModulePromise;
let googleProviderModulePromise;
let googleVertexProviderModulePromise;
let mistralProviderModulePromise;
let openAICodexResponsesProviderModulePromise;
let openAICompletionsProviderModulePromise;
let openAIResponsesProviderModulePromise;
function forwardStream(target, source) {
	(async () => {
		for await (const event of source) target.push(event);
		target.end();
	})();
}
function createLazyLoadErrorMessage(model, error) {
	return {
		role: "assistant",
		content: [],
		api: model.api,
		provider: model.provider,
		model: model.id,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "error",
		errorMessage: error instanceof Error ? error.message : String(error),
		timestamp: Date.now()
	};
}
function createLazyStream(loadModule) {
	return (model, context, options) => {
		const outer = new AssistantMessageEventStream();
		loadModule().then((module) => {
			forwardStream(outer, module.stream(model, context, options));
		}).catch((error) => {
			const message = createLazyLoadErrorMessage(model, error);
			outer.push({
				type: "error",
				reason: "error",
				error: message
			});
			outer.end(message);
		});
		return outer;
	};
}
function createLazySimpleStream(loadModule) {
	return (model, context, options) => {
		const outer = new AssistantMessageEventStream();
		loadModule().then((module) => {
			forwardStream(outer, module.streamSimple(model, context, options));
		}).catch((error) => {
			const message = createLazyLoadErrorMessage(model, error);
			outer.push({
				type: "error",
				reason: "error",
				error: message
			});
			outer.end(message);
		});
		return outer;
	};
}
function loadAnthropicProviderModule() {
	anthropicProviderModulePromise ||= import("./anthropic-CuJxidWx.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamAnthropic,
			streamSimple: provider.streamSimpleAnthropic
		};
	});
	return anthropicProviderModulePromise;
}
function loadAzureOpenAIResponsesProviderModule() {
	azureOpenAIResponsesProviderModulePromise ||= import("./azure-openai-responses-uOiwbc1U.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamAzureOpenAIResponses,
			streamSimple: provider.streamSimpleAzureOpenAIResponses
		};
	});
	return azureOpenAIResponsesProviderModulePromise;
}
function loadGoogleProviderModule() {
	googleProviderModulePromise ||= import("./google-BcNPk3hw.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamGoogle,
			streamSimple: provider.streamSimpleGoogle
		};
	});
	return googleProviderModulePromise;
}
function loadGoogleVertexProviderModule() {
	googleVertexProviderModulePromise ||= import("./google-vertex-DUyFp1_H.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamGoogleVertex,
			streamSimple: provider.streamSimpleGoogleVertex
		};
	});
	return googleVertexProviderModulePromise;
}
function loadMistralProviderModule() {
	mistralProviderModulePromise ||= import("./mistral-Csjlk4rS.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamMistral,
			streamSimple: provider.streamSimpleMistral
		};
	});
	return mistralProviderModulePromise;
}
function loadOpenAICodexResponsesProviderModule() {
	openAICodexResponsesProviderModulePromise ||= import("./openai-chatgpt-responses-CXhDTwJw.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamOpenAICodexResponses,
			streamSimple: provider.streamSimpleOpenAICodexResponses
		};
	});
	return openAICodexResponsesProviderModulePromise;
}
function loadOpenAICompletionsProviderModule() {
	openAICompletionsProviderModulePromise ||= import("./openai-completions-yW_LZ9L1.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamOpenAICompletions,
			streamSimple: provider.streamSimpleOpenAICompletions
		};
	});
	return openAICompletionsProviderModulePromise;
}
function loadOpenAIResponsesProviderModule() {
	openAIResponsesProviderModulePromise ||= import("./openai-responses-qWmb8pjg.js").then((module) => {
		const provider = module;
		return {
			stream: provider.streamOpenAIResponses,
			streamSimple: provider.streamSimpleOpenAIResponses
		};
	});
	return openAIResponsesProviderModulePromise;
}
const streamAnthropic = createLazyStream(loadAnthropicProviderModule);
const streamSimpleAnthropic = createLazySimpleStream(loadAnthropicProviderModule);
const streamAzureOpenAIResponses = createLazyStream(loadAzureOpenAIResponsesProviderModule);
const streamSimpleAzureOpenAIResponses = createLazySimpleStream(loadAzureOpenAIResponsesProviderModule);
const streamGoogle = createLazyStream(loadGoogleProviderModule);
const streamSimpleGoogle = createLazySimpleStream(loadGoogleProviderModule);
const streamGoogleVertex = createLazyStream(loadGoogleVertexProviderModule);
const streamSimpleGoogleVertex = createLazySimpleStream(loadGoogleVertexProviderModule);
const streamMistral = createLazyStream(loadMistralProviderModule);
const streamSimpleMistral = createLazySimpleStream(loadMistralProviderModule);
const streamOpenAICodexResponses = createLazyStream(loadOpenAICodexResponsesProviderModule);
const streamSimpleOpenAICodexResponses = createLazySimpleStream(loadOpenAICodexResponsesProviderModule);
const streamOpenAICompletions = createLazyStream(loadOpenAICompletionsProviderModule);
const streamSimpleOpenAICompletions = createLazySimpleStream(loadOpenAICompletionsProviderModule);
const streamOpenAIResponses = createLazyStream(loadOpenAIResponsesProviderModule);
const streamSimpleOpenAIResponses = createLazySimpleStream(loadOpenAIResponsesProviderModule);
/** Registers all built-in API providers into the shared runtime registry. */
function registerBuiltInApiProviders() {
	registerApiProvider({
		api: "anthropic-messages",
		stream: streamAnthropic,
		streamSimple: streamSimpleAnthropic
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "openai-completions",
		stream: streamOpenAICompletions,
		streamSimple: streamSimpleOpenAICompletions
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "mistral-conversations",
		stream: streamMistral,
		streamSimple: streamSimpleMistral
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "openai-responses",
		stream: streamOpenAIResponses,
		streamSimple: streamSimpleOpenAIResponses
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "azure-openai-responses",
		stream: streamAzureOpenAIResponses,
		streamSimple: streamSimpleAzureOpenAIResponses
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "openai-chatgpt-responses",
		stream: streamOpenAICodexResponses,
		streamSimple: streamSimpleOpenAICodexResponses
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "google-generative-ai",
		stream: streamGoogle,
		streamSimple: streamSimpleGoogle
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerApiProvider({
		api: "google-vertex",
		stream: streamGoogleVertex,
		streamSimple: streamSimpleGoogleVertex
	}, BUILT_IN_API_PROVIDER_SOURCE_ID);
}
/** Restores the built-in provider registry state for tests. */
function resetApiProviders() {
	unregisterApiProviders(BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerBuiltInApiProviders();
}
//#endregion
//#region packages/llm-runtime/src/stream.ts
function resolveApiProvider(api) {
	const provider = getApiProvider(api);
	if (!provider) throw new Error(`No API provider registered for api: ${api}`);
	return provider;
}
/** Streams a provider turn through the registered implementation for the model API. */
function stream(model, context, options) {
	return resolveApiProvider(model.api).stream(model, context, options);
}
/** Runs a provider turn and resolves the final assistant message result. */
async function complete(model, context, options) {
	return stream(model, context, options).result();
}
/** Streams a simple provider turn through the registered implementation for the model API. */
function streamSimple(model, context, options) {
	return resolveApiProvider(model.api).streamSimple(model, context, options);
}
/** Runs a simple provider turn and resolves the final assistant message result. */
async function completeSimple(model, context, options) {
	return streamSimple(model, context, options).result();
}
//#endregion
//#region src/llm/stream.ts
registerBuiltInApiProviders();
//#endregion
export { resetApiProviders as a, registerApiProvider as c, streamSimple as i, unregisterApiProviders as l, completeSimple as n, getApiProvider as o, stream as r, getApiProviders as s, complete as t };

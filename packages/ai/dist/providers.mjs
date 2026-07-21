import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.mjs";
//#region packages/ai/src/providers/register-builtins.ts
/** Source id used for built-in API provider registrations. */
const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
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
function createLazyStream(load, select) {
	return (model, context, options) => {
		const outer = new AssistantMessageEventStream();
		load().then((streams) => forwardStream(outer, select(streams)(model, context, options))).catch((error) => {
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
function createLazyRegistration(api, importModule, select) {
	let streamsPromise;
	const load = () => streamsPromise ??= importModule().then(select);
	const stream = createLazyStream(load, (streams) => streams.stream);
	const streamSimple = createLazyStream(load, (streams) => streams.streamSimple);
	return (registry) => {
		registry.registerApiProvider({
			api,
			stream,
			streamSimple
		}, BUILT_IN_API_PROVIDER_SOURCE_ID);
	};
}
const registerBuiltIns = [
	createLazyRegistration("anthropic-messages", () => import("./anthropic-B5gZQM5X.mjs").then((n) => n.t), (module) => ({
		stream: module.streamAnthropic,
		streamSimple: module.streamSimpleAnthropic
	})),
	createLazyRegistration("openai-completions", () => import("./openai-completions-B9QLIq2U.mjs").then((n) => n.n), (module) => ({
		stream: module.streamOpenAICompletions,
		streamSimple: module.streamSimpleOpenAICompletions
	})),
	createLazyRegistration("mistral-conversations", () => import("./mistral-CePVNdws.mjs"), (module) => ({
		stream: module.streamMistral,
		streamSimple: module.streamSimpleMistral
	})),
	createLazyRegistration("openai-responses", () => import("./openai-responses-B6LylGxM.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAIResponses,
		streamSimple: module.streamSimpleOpenAIResponses
	})),
	createLazyRegistration("azure-openai-responses", () => import("./azure-openai-responses-DNoSk8Uy.mjs"), (module) => ({
		stream: module.streamAzureOpenAIResponses,
		streamSimple: module.streamSimpleAzureOpenAIResponses
	})),
	createLazyRegistration("openai-chatgpt-responses", () => import("./openai-chatgpt-responses-DVC4Bk_A.mjs"), (module) => ({
		stream: module.streamOpenAICodexResponses,
		streamSimple: module.streamSimpleOpenAICodexResponses
	})),
	createLazyRegistration("google-generative-ai", () => import("./google-D6sIQ1bL.mjs"), (module) => ({
		stream: module.streamGoogle,
		streamSimple: module.streamSimpleGoogle
	})),
	createLazyRegistration("google-vertex", () => import("./google-vertex-rDGwkoZK.mjs"), (module) => ({
		stream: module.streamGoogleVertex,
		streamSimple: module.streamSimpleGoogleVertex
	}))
];
/** Registers every built-in API provider in one runtime registry. */
function registerBuiltInApiProviders(registry) {
	for (const register of registerBuiltIns) register(registry);
}
/** Restores the built-in provider registry state for tests. */
function resetApiProviders(registry) {
	registry.unregisterApiProviders(BUILT_IN_API_PROVIDER_SOURCE_ID);
	registerBuiltInApiProviders(registry);
}
//#endregion
export { BUILT_IN_API_PROVIDER_SOURCE_ID, registerBuiltInApiProviders, resetApiProviders };

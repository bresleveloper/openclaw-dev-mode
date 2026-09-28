import { t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { n as projectProviderError } from "./provider-error-CRhW7lkJ.mjs";
import { n as clampOpenAIPromptCacheKey, t as OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "./openai-prompt-cache-CjV_2IRI.mjs";
//#region packages/ai/src/providers/register-builtins.ts
/** Source id used for built-in API provider registrations. */
const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
async function forwardStream(target, source) {
	for await (const event of source) target.push(event);
	target.end();
}
function createLazyLoadErrorMessage(model, error, signal) {
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
		...projectProviderError(error, signal),
		timestamp: Date.now()
	};
}
function createLazyStream(load, select) {
	return (model, context, options) => {
		const outer = new AssistantMessageEventStream();
		load().then((streams) => forwardStream(outer, select(streams)(model, context, options))).catch((error) => {
			const message = createLazyLoadErrorMessage(model, error, options?.signal);
			outer.push({
				type: "error",
				reason: message.stopReason,
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
	createLazyRegistration("anthropic-messages", () => import("./anthropic-DvT9cX58.mjs").then((n) => n.t), (module) => ({
		stream: module.streamAnthropic,
		streamSimple: module.streamSimpleAnthropic
	})),
	createLazyRegistration("openai-completions", () => import("./openai-completions-Dmj7bJob.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAICompletions,
		streamSimple: module.streamSimpleOpenAICompletions
	})),
	createLazyRegistration("mistral-conversations", () => import("./mistral-6yGXWD_U.mjs"), (module) => ({
		stream: module.streamMistral,
		streamSimple: module.streamSimpleMistral
	})),
	createLazyRegistration("openai-responses", () => import("./openai-responses-dnM5X18f.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAIResponses,
		streamSimple: module.streamSimpleOpenAIResponses
	})),
	createLazyRegistration("azure-openai-responses", () => import("./azure-openai-responses-BDaeKfnP.mjs"), (module) => ({
		stream: module.streamAzureOpenAIResponses,
		streamSimple: module.streamSimpleAzureOpenAIResponses
	})),
	createLazyRegistration("openai-chatgpt-responses", () => import("./openai-chatgpt-responses-CKND8gZ-.mjs"), (module) => ({
		stream: module.streamOpenAICodexResponses,
		streamSimple: module.streamSimpleOpenAICodexResponses
	})),
	createLazyRegistration("google-generative-ai", () => import("./google-DYJefZfv.mjs"), (module) => ({
		stream: module.streamGoogle,
		streamSimple: module.streamSimpleGoogle
	})),
	createLazyRegistration("google-vertex", () => import("./google-vertex-3eVNR2qW.mjs"), (module) => ({
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
export { BUILT_IN_API_PROVIDER_SOURCE_ID, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH, clampOpenAIPromptCacheKey, registerBuiltInApiProviders, resetApiProviders };

import { t as AssistantMessageEventStream } from "./event-stream-X2gmsUWv.mjs";
import { n as projectProviderError } from "./provider-error-qtZD2inE.mjs";
import { n as clampOpenAIPromptCacheKey, t as OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "./openai-prompt-cache-B9AvdoEo.mjs";
import { t as createZeroUsage } from "./usage-CJH5D6Ea.mjs";
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
		usage: createZeroUsage(),
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
	createLazyRegistration("anthropic-messages", () => import("./anthropic-lueA8LUg.mjs").then((n) => n.t), (module) => ({
		stream: module.streamAnthropic,
		streamSimple: module.streamSimpleAnthropic
	})),
	createLazyRegistration("openai-completions", () => import("./openai-completions-BkV7ZlX2.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAICompletions,
		streamSimple: module.streamSimpleOpenAICompletions
	})),
	createLazyRegistration("mistral-conversations", () => import("./mistral-CQ7aoWg2.mjs"), (module) => ({
		stream: module.streamMistral,
		streamSimple: module.streamSimpleMistral
	})),
	createLazyRegistration("openai-responses", () => import("./openai-responses-lmFn34G2.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAIResponses,
		streamSimple: module.streamSimpleOpenAIResponses
	})),
	createLazyRegistration("azure-openai-responses", () => import("./azure-openai-responses-CoVjt1rM.mjs"), (module) => ({
		stream: module.streamAzureOpenAIResponses,
		streamSimple: module.streamSimpleAzureOpenAIResponses
	})),
	createLazyRegistration("openai-chatgpt-responses", () => import("./openai-chatgpt-responses-CF465R7B.mjs"), (module) => ({
		stream: module.streamOpenAICodexResponses,
		streamSimple: module.streamSimpleOpenAICodexResponses
	})),
	createLazyRegistration("google-generative-ai", () => import("./google-Cpi_cLKZ.mjs"), (module) => ({
		stream: module.streamGoogle,
		streamSimple: module.streamSimpleGoogle
	})),
	createLazyRegistration("google-interactions", () => import("./google-interactions-CGINbsjO.mjs"), (module) => ({
		stream: module.streamGoogleInteractions,
		streamSimple: module.streamSimpleGoogleInteractions
	})),
	createLazyRegistration("google-vertex", () => import("./google-vertex-eKoUnW7N.mjs"), (module) => ({
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

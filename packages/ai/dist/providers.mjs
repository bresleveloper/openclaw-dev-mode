import { t as AssistantMessageEventStream } from "./event-stream-Bf6cK7-d.mjs";
import { n as projectProviderError } from "./provider-error-B7aKA_dg.mjs";
import { n as clampOpenAIPromptCacheKey, t as OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "./openai-prompt-cache-yyba8hsU.mjs";
import { t as createZeroUsage } from "./usage-B8ggJtuG.mjs";
// packages/ai/src/providers/register-builtins.ts
/** Source id used for built-in API provider registrations. */
const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
function createLazyStream(load, select) {
	return (model, context, options) => {
		const outer = new AssistantMessageEventStream();
		load().then(async (streams) => {
			for await (const event of select(streams)(model, context, options)) outer.push(event);
			outer.end();
		}).catch((error) => {
			const lazyLoadSignal = options?.signal;
			const message = {
				role: "assistant",
				content: [],
				api: model.api,
				provider: model.provider,
				model: model.id,
				usage: createZeroUsage(),
				...projectProviderError(error, lazyLoadSignal),
				timestamp: Date.now()
			};
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
	createLazyRegistration("anthropic-messages", () => import("./anthropic-pBzNhj6S.mjs").then((n) => n.t), (module) => ({
		stream: module.streamAnthropic,
		streamSimple: module.streamSimpleAnthropic
	})),
	createLazyRegistration("openai-completions", () => import("./openai-completions-B0SMwjOj.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAICompletions,
		streamSimple: module.streamSimpleOpenAICompletions
	})),
	createLazyRegistration("mistral-conversations", () => import("./mistral-CF8d4m1z.mjs").then((n) => n.t), (module) => ({
		stream: module.streamMistral,
		streamSimple: module.streamSimpleMistral
	})),
	createLazyRegistration("openai-responses", () => import("./openai-responses-lo4PILMq.mjs").then((n) => n.t), (module) => ({
		stream: module.streamOpenAIResponses,
		streamSimple: module.streamSimpleOpenAIResponses
	})),
	createLazyRegistration("azure-openai-responses", () => import("./azure-openai-responses-Dahai0RK.mjs"), (module) => ({
		stream: module.streamAzureOpenAIResponses,
		streamSimple: module.streamSimpleAzureOpenAIResponses
	})),
	createLazyRegistration("openai-chatgpt-responses", () => import("./openai-chatgpt-responses-B9KvR9HC.mjs"), (module) => ({
		stream: module.streamOpenAICodexResponses,
		streamSimple: module.streamSimpleOpenAICodexResponses
	})),
	createLazyRegistration("google-generative-ai", () => import("./google-BFQ1Y6_5.mjs"), (module) => ({
		stream: module.streamGoogle,
		streamSimple: module.streamSimpleGoogle
	})),
	createLazyRegistration("google-interactions", () => import("./google-interactions-ff-dj4mm.mjs"), (module) => ({
		stream: module.streamGoogleInteractions,
		streamSimple: module.streamSimpleGoogleInteractions
	})),
	createLazyRegistration("google-vertex", () => import("./google-vertex-CHyDNvy-.mjs"), (module) => ({
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
export { BUILT_IN_API_PROVIDER_SOURCE_ID, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH, clampOpenAIPromptCacheKey, registerBuiltInApiProviders, resetApiProviders };

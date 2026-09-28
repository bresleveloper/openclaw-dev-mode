import { n as getEnvApiKey, r as __exportAll } from "./env-api-keys-DrgeBuva.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { n as clampOpenAIPromptCacheKey, r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-CjV_2IRI.mjs";
import { i as resolveOpenAICompletionsCompat } from "./openai-completions-compat-CUollwl6.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { n as buildBaseOptions } from "./simple-options-np1XPuhm.mjs";
import { g as resolveOpenAISimpleReasoningEffort } from "./openai-transport-params-DZKOTSfH.mjs";
import { n as resolveProviderSimpleCompletionHeaders } from "./provider-transport-turn-state-lrXEFkYr.mjs";
import { a as runResponsesStreamLifecycle, i as createResponsesAssistantOutput, n as applyResponsesServiceTierPricing, r as convertResponsesMessages, t as applyCommonResponsesParams } from "./openai-responses-shared-DvSqtJ6_.mjs";
import { n as hasCopilotVisionInput, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-B37TB3rB.mjs";
import { t as createOpenAIProviderClient } from "./openai-provider-client-BP8J1aeg.mjs";
//#region packages/ai/src/providers/openai-responses.ts
var openai_responses_exports = /* @__PURE__ */ __exportAll({
	streamOpenAIResponses: () => streamOpenAIResponses,
	streamSimpleOpenAIResponses: () => streamSimpleOpenAIResponses
});
const OPENAI_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
function getCompat(model) {
	return {
		...resolveOpenAICompletionsCompat(model),
		sendSessionIdHeader: model.compat?.sendSessionIdHeader ?? true
	};
}
const streamOpenAIResponses = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const output = createResponsesAssistantOutput(model);
	runResponsesStreamLifecycle({
		stream,
		model,
		output,
		options,
		createClient: () => {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const cacheSessionId = resolveCacheRetention(options?.cacheRetention) === "none" ? void 0 : options?.sessionId;
			return createClient(model, context, apiKey, resolveProviderSimpleCompletionHeaders(model, options), cacheSessionId);
		},
		buildParams: (_requestModel, replayMode) => buildParams(model, context, options, replayMode),
		processStreamOptions: {
			serviceTier: options?.serviceTier,
			applyServiceTierPricing: (usage, serviceTier) => applyResponsesServiceTierPricing(usage, serviceTier, model)
		}
	});
	return stream;
};
const streamSimpleOpenAIResponses = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	const replayOptions = options;
	return streamOpenAIResponses(model, context, {
		...base,
		authProfileId: replayOptions?.authProfileId,
		reasoningEffort: resolveOpenAISimpleReasoningEffort(model, options?.reasoning),
		replayResponsesItemIds: replayOptions?.replayResponsesItemIds
	});
};
function createClient(model, context, apiKey, optionsHeaders, sessionId) {
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const compat = getCompat(model);
	const headers = { ...model.headers };
	if (model.provider === "github-copilot") {
		const hasImages = hasCopilotVisionInput(context.messages);
		const copilotHeaders = buildCopilotDynamicHeaders({
			messages: context.messages,
			hasImages
		});
		Object.assign(headers, copilotHeaders);
	}
	if (sessionId) {
		if (compat.sendSessionIdHeader) headers.session_id = sessionId;
		headers["x-client-request-id"] = sessionId;
	}
	return createOpenAIProviderClient(model, apiKey, headers, optionsHeaders);
}
function buildParams(model, context, options, replayMode = "checkpoint") {
	const messages = convertResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, {
		replayResponsesItemIds: options?.replayResponsesItemIds ?? false,
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId,
		replayMode
	});
	const cacheRetention = resolveCacheRetention(options?.cacheRetention);
	const compat = getCompat(model);
	const params = {
		model: model.id,
		input: messages,
		stream: true,
		prompt_cache_key: cacheRetention === "none" || !compat.supportsPromptCacheKey ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
		...resolveOpenAIPromptCacheParams(model, cacheRetention, compat),
		store: false
	};
	if (options?.serviceTier !== void 0) params.service_tier = options.serviceTier;
	applyCommonResponsesParams(params, model, context, options, { setDefaultReasoningOff: model.provider !== "github-copilot" });
	return params;
}
//#endregion
export { streamOpenAIResponses as n, streamSimpleOpenAIResponses as r, openai_responses_exports as t };

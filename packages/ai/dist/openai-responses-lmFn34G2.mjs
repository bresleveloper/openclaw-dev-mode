import { n as __exportAll } from "./rolldown-runtime-B4iAMlE-.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-X2gmsUWv.mjs";
import { n as clampOpenAIPromptCacheKey, r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-B9AvdoEo.mjs";
import { i as resolveOpenAICompletionsCompat } from "./openai-completions-compat-bNQXF1y9.mjs";
import { i as resolveCacheRetention, r as buildCopilotDynamicHeaders } from "./cloudflare-Dttf8jKq.mjs";
import { n as buildBaseOptions } from "./simple-options-xJkqrG_E.mjs";
import { n as getEnvApiKey } from "./env-api-keys-Xd8dm_aV.mjs";
import { t as createAssistantOutput } from "./assistant-output-BnQm3fov.mjs";
import { F as convertProviderResponsesMessages, n as applyResponsesServiceTierPricing, r as runResponsesStreamLifecycle, t as applyCommonResponsesParams, vt as resolveOpenAISimpleReasoningEffort } from "./openai-responses-shared-XoSAyCHj.mjs";
import { i as createOpenAIProviderClient, n as resolveProviderSimpleCompletionHeaders } from "./provider-transport-turn-state-CmtCL4-i.mjs";
import { t as requireApiKey } from "./required-api-key-D088S4Cd.mjs";
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
	const output = createAssistantOutput(model);
	runResponsesStreamLifecycle({
		stream,
		model,
		output,
		options,
		createClient: () => {
			return createClient(model, context, options?.apiKey || getEnvApiKey(model.provider) || "", options, resolveCacheRetention(options?.cacheRetention) === "none" ? void 0 : options?.sessionId);
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
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const base = buildBaseOptions(model, options, apiKey);
	const replayOptions = options;
	return streamOpenAIResponses(model, context, {
		...base,
		authProfileId: replayOptions?.authProfileId,
		reasoningEffort: resolveOpenAISimpleReasoningEffort(model, options?.reasoning),
		replayResponsesItemIds: replayOptions?.replayResponsesItemIds
	});
};
function createClient(model, context, apiKey, options, sessionId) {
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const compat = getCompat(model);
	const headers = { ...model.headers };
	if (model.provider === "github-copilot") Object.assign(headers, buildCopilotDynamicHeaders(context.messages));
	if (sessionId) {
		if (compat.sendSessionIdHeader) headers.session_id = sessionId;
		headers["x-client-request-id"] = sessionId;
	}
	return createOpenAIProviderClient(model, apiKey, headers, resolveProviderSimpleCompletionHeaders(model, options), options?.onResponse);
}
function buildParams(model, context, options, replayMode = "checkpoint") {
	const messages = convertProviderResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, {
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

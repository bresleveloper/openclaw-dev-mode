import { n as __exportAll } from "./rolldown-runtime-DYf_mQCB.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-Bf6cK7-d.mjs";
import { n as clampOpenAIPromptCacheKey, r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-yyba8hsU.mjs";
import { a as resolveOpenAICompletionsCompat } from "./openai-completions-compat-DgAJZBJk.mjs";
import { n as resolveCacheRetention, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-CqLRrd-i.mjs";
import { n as buildBaseOptions } from "./simple-options-Bet1Zroc.mjs";
import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
import { t as createAssistantOutput } from "./assistant-output-DPK9pdyx.mjs";
import { Dt as convertProviderResponsesMessages, dn as resolveOpenAISimpleReasoningEffort, n as applyResponsesServiceTierPricing, r as runResponsesStreamLifecycle, t as applyCommonResponsesParams } from "./openai-responses-shared-CZBZVeqY.mjs";
import { n as resolveProviderSimpleCompletionHeaders } from "./provider-transport-turn-state-CMSrdLfq.mjs";
import { t as requireApiKey } from "./required-api-key-BniLGxy4.mjs";
// packages/ai/src/providers/openai-responses.ts
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
		context,
		options,
		createClient: async () => {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const cacheSessionId = resolveCacheRetention(options?.cacheRetention) === "none" ? void 0 : options?.sessionId;
			if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
			const compat = getCompat(model);
			const headers = { ...model.headers };
			if (model.provider === "github-copilot") Object.assign(headers, buildCopilotDynamicHeaders(context.messages));
			if (cacheSessionId) {
				if (compat.sendSessionIdHeader) headers.session_id = cacheSessionId;
				headers["x-client-request-id"] = cacheSessionId;
			}
			const { createOpenAIProviderClient } = await import("./openai-provider-client-BsOmrexA.mjs");
			return createOpenAIProviderClient(model, apiKey, headers, resolveProviderSimpleCompletionHeaders(model, options), options?.onResponse);
		},
		buildParams: (_requestModel, replayMode) => {
			const messages = convertProviderResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, {
				replayResponsesItemIds: options?.replayResponsesItemIds ?? false,
				sessionId: options?.sessionId,
				mutableInput: Boolean(options?.onPayload),
				replayMode
			});
			const cacheRetention = resolveCacheRetention(options?.cacheRetention);
			const compat = getCompat(model);
			const params = {
				model: model.id,
				input: messages,
				stream: true,
				prompt_cache_key: cacheRetention === "none" || !compat.supportsPromptCacheKey ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
				...resolveOpenAIPromptCacheParams(model, cacheRetention, compat, options?.promptCacheTtl),
				store: false
			};
			if (options?.serviceTier !== void 0) params.service_tier = options.serviceTier;
			applyCommonResponsesParams(params, model, context, options, { setDefaultReasoningOff: model.provider !== "github-copilot" });
			return params;
		},
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
		openclawCodeModeToolSurface: replayOptions?.openclawCodeModeToolSurface,
		openclawCodeModeAllowedHostedToolTypes: replayOptions?.openclawCodeModeAllowedHostedToolTypes,
		reasoningEffort: resolveOpenAISimpleReasoningEffort(model, options?.reasoning),
		replayResponsesItemIds: replayOptions?.replayResponsesItemIds
	});
};
export { streamOpenAIResponses as n, streamSimpleOpenAIResponses as r, openai_responses_exports as t };

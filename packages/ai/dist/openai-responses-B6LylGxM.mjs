import { n as getEnvApiKey, r as __exportAll } from "./env-api-keys-CtMlqaQ4.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.mjs";
import { n as getAiTransportHost } from "./host-4t713IeR.mjs";
import { o as buildBaseOptions } from "./transform-messages-BhGF_fF4.mjs";
import { a as resolveCacheRetention, i as resolveCloudflareBaseUrl, n as hasCopilotVisionInput, r as isCloudflareProvider, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-BsH5cqGj.mjs";
import { a as resolveResponsesReasoningEffort, n as convertResponsesMessages, o as runResponsesStreamLifecycle, r as createResponsesAssistantOutput, t as applyCommonResponsesParams } from "./openai-responses-shared-sj2YUPYc.mjs";
import { a as clampOpenAIPromptCacheKey } from "./openai-tool-projection-BknoV11q.mjs";
import OpenAI from "openai";
//#region packages/ai/src/providers/openai-responses.ts
var openai_responses_exports = /* @__PURE__ */ __exportAll({
	streamOpenAIResponses: () => streamOpenAIResponses,
	streamSimpleOpenAIResponses: () => streamSimpleOpenAIResponses
});
const OPENAI_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
function getCompat(model) {
	return {
		sendSessionIdHeader: model.compat?.sendSessionIdHeader ?? true,
		supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? true
	};
}
function getPromptCacheRetention(compat, cacheRetention) {
	return cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0;
}
function formatOpenAIResponsesError(error) {
	if (error instanceof Error) {
		const status = error.status;
		const statusCode = typeof status === "number" ? status : void 0;
		if (statusCode !== void 0) return `OpenAI API error (${statusCode}): ${error.message}`;
		return error.message;
	}
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}
/**
* Generate function for OpenAI Responses API
*/
const streamOpenAIResponses = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	runResponsesStreamLifecycle({
		stream,
		model,
		output: createResponsesAssistantOutput(model),
		options,
		createClient: () => {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const cacheSessionId = resolveCacheRetention(options?.cacheRetention) === "none" ? void 0 : options?.sessionId;
			return createClient(model, context, apiKey, options?.headers, cacheSessionId);
		},
		buildParams: () => buildParams(model, context, options),
		processStreamOptions: {
			serviceTier: options?.serviceTier,
			applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
		},
		formatError: formatOpenAIResponsesError
	});
	return stream;
};
const streamSimpleOpenAIResponses = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	return streamOpenAIResponses(model, context, {
		...base,
		reasoningEffort: resolveResponsesReasoningEffort(model, options?.reasoning),
		replayResponsesItemIds: options?.replayResponsesItemIds
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
	if (optionsHeaders) Object.assign(headers, optionsHeaders);
	const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
		...headers,
		Authorization: headers.Authorization ?? null,
		"cf-aig-authorization": `Bearer ${apiKey}`
	} : headers;
	return new OpenAI({
		apiKey,
		baseURL: isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl,
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		fetch: getAiTransportHost().buildModelFetch(model)
	});
}
function buildParams(model, context, options) {
	const messages = convertResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, { replayResponsesItemIds: options?.replayResponsesItemIds ?? false });
	const cacheRetention = resolveCacheRetention(options?.cacheRetention);
	const compat = getCompat(model);
	const params = {
		model: model.id,
		input: messages,
		stream: true,
		prompt_cache_key: cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
		prompt_cache_retention: getPromptCacheRetention(compat, cacheRetention),
		store: false
	};
	if (options?.maxTokens) params.max_output_tokens = options?.maxTokens;
	if (options?.temperature !== void 0) params.temperature = options?.temperature;
	if (options?.serviceTier !== void 0) params.service_tier = options.serviceTier;
	applyCommonResponsesParams(params, model, context, options, { setDefaultReasoningOff: model.provider !== "github-copilot" });
	return params;
}
function getServiceTierCostMultiplier(model, serviceTier) {
	switch (serviceTier) {
		case "flex": return .5;
		case "priority": return model.id === "gpt-5.5" ? 2.5 : 2;
		default: return 1;
	}
}
function applyServiceTierPricing(usage, serviceTier, model) {
	const multiplier = getServiceTierCostMultiplier(model, serviceTier);
	if (multiplier === 1) return;
	usage.cost.input *= multiplier;
	usage.cost.output *= multiplier;
	usage.cost.cacheRead *= multiplier;
	usage.cost.cacheWrite *= multiplier;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
//#endregion
export { streamOpenAIResponses as n, streamSimpleOpenAIResponses as r, openai_responses_exports as t };

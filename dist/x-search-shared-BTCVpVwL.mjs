import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as wrapWebContent } from "./external-content-Bkm4w5qo.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./provider-web-search-DUaDxxRi.mjs";
import { a as XAI_DEFAULT_MODEL_ID } from "./model-definitions-BTg9V4Hq.mjs";
import { c as resolveXaiToolDefaultReasoningEffort, i as requestXaiResponsesTool, n as resolvePositiveIntegerToolConfig, o as requireXaiResponseTextCitationsAndInline, s as resolveXaiResponsesEndpoint, t as resolveNormalizedXaiToolModel } from "./tool-config-shared-BH-m0o8C.mjs";
//#region extensions/xai/src/web-search-shared.ts
const XAI_WEB_SEARCH_MAX_CONTENT_CHARS = 2e4;
function buildXaiWebSearchPayload(params) {
	return {
		query: params.query,
		provider: params.provider,
		model: params.model,
		tookMs: params.tookMs,
		externalContent: {
			untrusted: true,
			source: params.source ?? "web_search",
			provider: params.provider,
			wrapped: true
		},
		content: wrapWebContent(params.content, "web_search"),
		citations: params.citations,
		...params.inlineCitations ? { inlineCitations: params.inlineCitations } : {},
		...params.truncated ? { truncated: true } : {}
	};
}
function resolveXaiSearchConfig(searchConfig) {
	return isRecord(searchConfig?.grok) ? searchConfig.grok : {};
}
function resolveXaiWebSearchModel(searchConfig) {
	return resolveNormalizedXaiToolModel({
		config: resolveXaiSearchConfig(searchConfig),
		defaultModel: XAI_DEFAULT_MODEL_ID
	});
}
function resolveXaiWebSearchEndpoint(searchConfig) {
	return resolveXaiResponsesEndpoint(resolveXaiSearchConfig(searchConfig).baseUrl);
}
function resolveXaiInlineCitations(searchConfig) {
	return resolveXaiSearchConfig(searchConfig).inlineCitations === true;
}
function wrapXaiWebSearchError(error, timeoutSeconds) {
	if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError" || error.message === "This operation was aborted")) throw Object.assign(new Error(`xAI web search timed out after ${timeoutSeconds}s. Check xAI authentication or try a simpler request.`, { cause: error }), { code: "ETIMEDOUT" });
	throw error;
}
async function requestXaiWebSearch(params) {
	params.signal?.throwIfAborted();
	return await requestXaiResponsesTool({
		...params,
		inputText: params.query,
		tools: [{ type: "web_search" }],
		reasoningEffort: resolveXaiToolDefaultReasoningEffort(params.model, "low"),
		errorLabel: "xAI web search failed"
	}, (data) => requireXaiResponseTextCitationsAndInline(data, "xAI web search failed", params.inlineCitations, XAI_WEB_SEARCH_MAX_CONTENT_CHARS)).catch((error) => {
		if (params.signal?.aborted && error === params.signal.reason) throw error;
		return wrapXaiWebSearchError(error, params.timeoutSeconds);
	});
}
//#endregion
//#region extensions/xai/src/x-search-shared.ts
const XAI_DEFAULT_X_SEARCH_MODEL = XAI_DEFAULT_MODEL_ID;
const XAI_X_SEARCH_MAX_CONTENT_CHARS = 2e4;
function resolveXaiXSearchModel(config) {
	return resolveNormalizedXaiToolModel({
		config,
		defaultModel: XAI_DEFAULT_X_SEARCH_MODEL
	});
}
function resolveXaiXSearchEndpoint(config) {
	return resolveXaiResponsesEndpoint(asNonArrayRecord(config).baseUrl);
}
function resolveXaiXSearchInlineCitations(config) {
	return asNonArrayRecord(config).inlineCitations === true;
}
function resolveXaiXSearchMaxTurns(config) {
	return resolvePositiveIntegerToolConfig(config, "maxTurns");
}
function buildXSearchTool(options) {
	return {
		type: "x_search",
		...options.allowedXHandles?.length ? { allowed_x_handles: options.allowedXHandles } : {},
		...options.excludedXHandles?.length ? { excluded_x_handles: options.excludedXHandles } : {},
		...options.fromDate ? { from_date: options.fromDate } : {},
		...options.toDate ? { to_date: options.toDate } : {},
		...options.enableImageUnderstanding ? { enable_image_understanding: true } : {},
		...options.enableVideoUnderstanding ? { enable_video_understanding: true } : {}
	};
}
function buildXaiXSearchPayload(params) {
	return {
		...buildXaiWebSearchPayload({
			...params,
			provider: "xai",
			source: "x_search"
		}),
		...params.options?.allowedXHandles?.length ? { allowedXHandles: params.options.allowedXHandles } : {},
		...params.options?.excludedXHandles?.length ? { excludedXHandles: params.options.excludedXHandles } : {},
		...params.options?.fromDate ? { fromDate: params.options.fromDate } : {},
		...params.options?.toDate ? { toDate: params.options.toDate } : {},
		...params.options?.enableImageUnderstanding ? { enableImageUnderstanding: true } : {},
		...params.options?.enableVideoUnderstanding ? { enableVideoUnderstanding: true } : {}
	};
}
async function requestXaiXSearch(params) {
	params.signal?.throwIfAborted();
	return await requestXaiResponsesTool({
		...params,
		inputText: params.options.query,
		tools: [buildXSearchTool(params.options)],
		reasoningEffort: resolveXaiToolDefaultReasoningEffort(params.model, "none"),
		errorLabel: "xAI X search failed"
	}, (data) => requireXaiResponseTextCitationsAndInline(data, "xAI X search failed", params.inlineCitations, XAI_X_SEARCH_MAX_CONTENT_CHARS));
}
//#endregion
export { resolveXaiXSearchInlineCitations as a, buildXaiWebSearchPayload as c, resolveXaiWebSearchEndpoint as d, resolveXaiWebSearchModel as f, resolveXaiXSearchEndpoint as i, requestXaiWebSearch as l, buildXaiXSearchPayload as n, resolveXaiXSearchMaxTurns as o, wrapXaiWebSearchError as p, requestXaiXSearch as r, resolveXaiXSearchModel as s, XAI_DEFAULT_X_SEARCH_MODEL as t, resolveXaiInlineCitations as u };

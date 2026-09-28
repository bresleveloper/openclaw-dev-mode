import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as wrapWebContent } from "./external-content-CLufk6dK.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./provider-web-search-CRDOBhl4.mjs";
import { r as normalizeXaiModelId } from "./model-id-BpefGMul.mjs";
import { a as XAI_DEFAULT_MODEL_ID } from "./model-definitions-DA8Fbxqz.mjs";
import { a as requestXaiResponsesTool, c as resolveXaiResponsesEndpoint, l as resolveXaiToolDefaultReasoningEffort, n as resolveNormalizedXaiToolModel, r as resolvePositiveIntegerToolConfig, s as requireXaiResponseTextCitationsAndInline, t as coerceXaiToolConfig } from "./tool-config-shared-C1JjZS0I.mjs";
//#region extensions/xai/src/web-search-shared.ts
const XAI_DEFAULT_WEB_SEARCH_MODEL = XAI_DEFAULT_MODEL_ID;
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
	return (isRecord(searchConfig?.grok) ? searchConfig.grok : void 0) ?? {};
}
function resolveXaiWebSearchModel(searchConfig) {
	const config = resolveXaiSearchConfig(searchConfig);
	return typeof config.model === "string" && config.model.trim() ? normalizeXaiModelId(config.model.trim()) : XAI_DEFAULT_WEB_SEARCH_MODEL;
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
function resolveXaiXSearchConfig(config) {
	return coerceXaiToolConfig(config);
}
function resolveXaiXSearchModel(config) {
	return resolveNormalizedXaiToolModel({
		config,
		defaultModel: XAI_DEFAULT_X_SEARCH_MODEL
	});
}
function resolveXaiXSearchEndpoint(config) {
	return resolveXaiResponsesEndpoint(resolveXaiXSearchConfig(config).baseUrl);
}
function resolveXaiXSearchInlineCitations(config) {
	return resolveXaiXSearchConfig(config).inlineCitations === true;
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

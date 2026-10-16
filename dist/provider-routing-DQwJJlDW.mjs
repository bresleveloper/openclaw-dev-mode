import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-BTg9V4Hq.mjs";
import { t as isXaiProviderId } from "./provider-id-BvdhW5fW.mjs";
//#region extensions/xai/provider-routing.ts
function resolveHostname(value) {
	return URL.parse(value)?.hostname.toLowerCase();
}
function isXaiNativeEndpoint(baseUrl) {
	return typeof baseUrl === "string" && resolveHostname(baseUrl) === "api.x.ai";
}
function supportsXaiPromptCacheKey(params) {
	const baseUrl = normalizeOptionalString(params.baseUrl) ?? XAI_BASE_URL;
	return (params.api === "openai-responses" || params.api === "openai-completions") && (isXaiNativeEndpoint(baseUrl) || params.api === "openai-responses" && resolveHostname(baseUrl) === "cli-chat-proxy.grok.com");
}
function shouldUseXaiResponsesTransport(params) {
	const hasDefaultXaiRoute = isXaiProviderId(params.provider) && !normalizeOptionalString(params.baseUrl);
	return params.api === "openai-responses" ? hasDefaultXaiRoute : params.api === "openai-completions" && (isXaiNativeEndpoint(params.baseUrl) || hasDefaultXaiRoute);
}
function resolveXaiTransport(params) {
	if (!shouldUseXaiResponsesTransport(params)) return;
	return {
		api: "openai-responses",
		baseUrl: normalizeOptionalString(params.baseUrl) ?? (isXaiProviderId(params.provider) ? XAI_BASE_URL : void 0)
	};
}
//#endregion
export { supportsXaiPromptCacheKey as n, resolveXaiTransport as t };

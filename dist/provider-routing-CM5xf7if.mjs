import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-DA8Fbxqz.mjs";
import { t as isXaiProviderId } from "./provider-id-dn9RuxC0.mjs";
//#region extensions/xai/provider-routing.ts
const XAI_NATIVE_ENDPOINT_HOSTS = /* @__PURE__ */ new Set(["api.x.ai"]);
function resolveHostname(value) {
	try {
		return new URL(value).hostname.toLowerCase();
	} catch {
		return;
	}
}
function isXaiNativeEndpoint(baseUrl) {
	return typeof baseUrl === "string" && XAI_NATIVE_ENDPOINT_HOSTS.has(resolveHostname(baseUrl) ?? "");
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

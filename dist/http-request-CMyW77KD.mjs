import { h as resolveProviderHttpRequestConfig } from "./shared-BMUa_P4s.mjs";
import "./provider-http-BuV15s4V.mjs";
import { s as normalizeGoogleGenerativeAiBaseUrl, t as DEFAULT_GOOGLE_API_BASE_URL } from "./google-api-base-url-BSKc6KBi.mjs";
import "./provider-policy-COnE2-la.mjs";
import { t as parseGeminiAuth } from "./gemini-auth-CUKsnejN.mjs";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-BFmN3ce7.mjs";
//#region extensions/google/http-request.ts
function resolveTrustedGoogleGenerativeAiBaseUrl(baseUrl) {
	const normalized = normalizeGoogleGenerativeAiBaseUrl(baseUrl) ?? "https://generativelanguage.googleapis.com/v1beta";
	const url = URL.parse(normalized);
	if (!url) throw new Error("Google Generative AI baseUrl must be a valid https URL on generativelanguage.googleapis.com");
	if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "generativelanguage.googleapis.com") throw new Error("Google Generative AI baseUrl must use https://generativelanguage.googleapis.com");
	return normalized;
}
function resolveGoogleGenerativeAiHttpRequestConfig(params) {
	const baseUrl = resolveTrustedGoogleGenerativeAiBaseUrl(params.baseUrl);
	return resolveProviderHttpRequestConfig({
		baseUrl,
		defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
		allowPrivateNetwork: params.request?.allowPrivateNetwork,
		headers: params.headers,
		request: params.request,
		defaultHeaders: {
			...parseGeminiAuth(params.apiKey).headers,
			...resolveGoogleApiClientHeaders({
				baseUrl,
				api: "google-generative-ai",
				capability: params.capability,
				transport: params.transport
			})
		},
		provider: "google",
		api: "google-generative-ai",
		capability: params.capability,
		transport: params.transport
	});
}
//#endregion
export { resolveGoogleGenerativeAiHttpRequestConfig as t };

import { p as resolveProviderHttpRequestConfig } from "./shared-Bt45vaP6.js";
import "./provider-http-B13K4lug.js";
import "./thinking-api-ChY9wdi1.js";
import { o as normalizeGoogleGenerativeAiBaseUrl, t as DEFAULT_GOOGLE_API_BASE_URL } from "./provider-policy-8nVd77O2.js";
import "./gemini-cli-provider-BPnj6uQ3.js";
import "./onboard-wFCOoud7.js";
import { t as parseGeminiAuth } from "./gemini-auth-B8cJPZcd.js";
import "./transport-stream-D3k6b2Lk.js";
import "./provider-registration-P6bvd-OM.js";
//#region extensions/google/api.ts
function resolveTrustedGoogleGenerativeAiBaseUrl(baseUrl) {
	const normalized = normalizeGoogleGenerativeAiBaseUrl(baseUrl ?? "https://generativelanguage.googleapis.com/v1beta") ?? "https://generativelanguage.googleapis.com/v1beta";
	let url;
	try {
		url = new URL(normalized);
	} catch {
		throw new Error("Google Generative AI baseUrl must be a valid https URL on generativelanguage.googleapis.com");
	}
	if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "generativelanguage.googleapis.com") throw new Error("Google Generative AI baseUrl must use https://generativelanguage.googleapis.com");
	return normalized;
}
function resolveGoogleGenerativeAiHttpRequestConfig(params) {
	return resolveProviderHttpRequestConfig({
		baseUrl: resolveTrustedGoogleGenerativeAiBaseUrl(params.baseUrl),
		defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
		allowPrivateNetwork: params.request?.allowPrivateNetwork,
		headers: params.headers,
		request: params.request,
		defaultHeaders: parseGeminiAuth(params.apiKey).headers,
		provider: "google",
		api: "google-generative-ai",
		capability: params.capability,
		transport: params.transport
	});
}
//#endregion
export { resolveGoogleGenerativeAiHttpRequestConfig as t };

import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";
import "openclaw/plugin-sdk/provider-thinking-runtime";
import "openclaw/plugin-sdk/model-ref-parse";
//#region extensions/google/src/google-api-base-url.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function isGoogleGenerativeAiUrl(url) {
	return url.protocol === "https:" && url.hostname.toLowerCase() === "generativelanguage.googleapis.com";
}
function normalizeGoogleApiBaseUrl(baseUrl) {
	const raw = trimTrailingSlashes(normalizeOptionalString(baseUrl) || "https://generativelanguage.googleapis.com/v1beta");
	const url = URL.parse(raw);
	if (!url) return raw;
	url.hash = "";
	url.search = "";
	url.username = "";
	url.password = "";
	if (isGoogleGenerativeAiUrl(url)) url.pathname = trimTrailingSlashes(url.pathname || "") || "/v1beta";
	return trimTrailingSlashes(url.toString());
}
function normalizeGoogleGenerativeAiBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl);
	if (!raw) return;
	const normalized = normalizeGoogleApiBaseUrl(raw);
	const url = URL.parse(normalized);
	if (url) {
		if (isGoogleGenerativeAiUrl(url)) {
			url.pathname = trimTrailingSlashes(url.pathname || "").replace(/\/openai$/i, "") || "/v1beta";
			return trimTrailingSlashes(url.toString());
		}
	}
	return normalized;
}
//#endregion
//#region extensions/google/google-api-client-header.ts
function resolveGoogleApiClientHeaders(params) {
	return resolveProviderRequestHeaders({
		provider: "google",
		api: params?.api ?? "google-generative-ai",
		baseUrl: params?.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta",
		capability: params?.capability ?? "other",
		transport: params?.transport ?? "http"
	}) ?? {};
}
//#endregion
export { DEFAULT_GOOGLE_API_BASE_URL as n, normalizeGoogleGenerativeAiBaseUrl as r, resolveGoogleApiClientHeaders as t };

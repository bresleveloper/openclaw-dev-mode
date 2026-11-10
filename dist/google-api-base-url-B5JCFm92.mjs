//#region src/infra/google-api-base-url.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GOOGLE_GENERATIVE_LANGUAGE_HOST = "generativelanguage.googleapis.com";
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function normalizeGoogleApiBaseUrl(baseUrl) {
	const raw = trimTrailingSlashes(baseUrl?.trim() || "https://generativelanguage.googleapis.com/v1beta");
	const url = URL.parse(raw);
	if (!url) return raw;
	url.hash = "";
	url.search = "";
	if (url.hostname.toLowerCase() === GOOGLE_GENERATIVE_LANGUAGE_HOST && trimTrailingSlashes(url.pathname || "") === "") url.pathname = "/v1beta";
	return trimTrailingSlashes(url.toString());
}
//#endregion
export { normalizeGoogleApiBaseUrl as n, DEFAULT_GOOGLE_API_BASE_URL as t };

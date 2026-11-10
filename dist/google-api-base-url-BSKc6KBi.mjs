import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/google/src/google-api-base-url.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function isGoogleGenerativeAiUrl(url) {
	return url.protocol === "https:" && url.hostname.toLowerCase() === "generativelanguage.googleapis.com";
}
/** Exact official AI Studio request root eligible for native provider behavior. */
function isOfficialGoogleAiStudioBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl) ?? "https://generativelanguage.googleapis.com/v1beta";
	const url = URL.parse(raw);
	const href = url ? trimTrailingSlashes(url.href) : void 0;
	return href === "https://generativelanguage.googleapis.com" || href === "https://generativelanguage.googleapis.com/v1beta";
}
const GOOGLE_VERTEX_HOST = "aiplatform.googleapis.com";
const GOOGLE_VERTEX_REGION_HOST_SUFFIX = "-aiplatform.googleapis.com";
const GOOGLE_VERTEX_MULTI_REGION_HOSTS = /* @__PURE__ */ new Set(["aiplatform.eu.rep.googleapis.com", "aiplatform.us.rep.googleapis.com"]);
function isGoogleVertexHostname(hostname) {
	const normalized = hostname.toLowerCase();
	return normalized === GOOGLE_VERTEX_HOST || normalized.endsWith(GOOGLE_VERTEX_REGION_HOST_SUFFIX) || GOOGLE_VERTEX_MULTI_REGION_HOSTS.has(normalized);
}
function isGoogleVertexBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl);
	if (!raw) return false;
	const url = URL.parse(raw);
	return url !== null && isGoogleVertexHostname(url.hostname);
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
function isGoogleGenerativeAiApi(api) {
	return api === "google-generative-ai";
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
/** Keep configured API version paths intact instead of appending the SDK default. */
function resolveGoogleGenerativeAiSdkHttpOptions(baseUrl) {
	const normalized = normalizeGoogleGenerativeAiBaseUrl(baseUrl);
	if (!normalized) return { apiVersion: "v1beta" };
	const path = URL.parse(normalized)?.pathname ?? normalized;
	return {
		baseUrl: normalized,
		apiVersion: /(?:^|\/)v\d+(?:(?:alpha|beta)\d*)?(?:\/|$)/i.test(path) ? "" : "v1beta"
	};
}
//#endregion
export { isOfficialGoogleAiStudioBaseUrl as a, resolveGoogleGenerativeAiSdkHttpOptions as c, isGoogleVertexHostname as i, isGoogleGenerativeAiApi as n, normalizeGoogleApiBaseUrl as o, isGoogleVertexBaseUrl as r, normalizeGoogleGenerativeAiBaseUrl as s, DEFAULT_GOOGLE_API_BASE_URL as t };

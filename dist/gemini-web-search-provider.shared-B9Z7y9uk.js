import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as normalizeGoogleApiBaseUrl } from "./provider-policy-8nVd77O2.js";
//#region extensions/google/src/gemini-web-search-provider.shared.ts
const DEFAULT_GEMINI_WEB_SEARCH_MODEL = "gemini-2.5-flash";
function resolveGeminiConfig(searchConfig) {
	const gemini = searchConfig?.gemini;
	return isRecord(gemini) ? gemini : {};
}
function resolveGeminiModel(gemini) {
	return normalizeOptionalString(gemini?.model) ?? DEFAULT_GEMINI_WEB_SEARCH_MODEL;
}
function resolveGeminiBaseUrl(gemini) {
	return normalizeGoogleApiBaseUrl(normalizeOptionalString(gemini?.baseUrl) ?? normalizeOptionalString(gemini?.providerBaseUrl));
}
//#endregion
export { resolveGeminiConfig as n, resolveGeminiModel as r, resolveGeminiBaseUrl as t };

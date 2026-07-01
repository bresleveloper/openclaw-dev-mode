import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
//#region extensions/openai/base-url.ts
const OPENAI_CODEX_RESPONSES_BASE_URL = "https://chatgpt.com/backend-api/codex";
const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
function resolveOpenAIDefaultBaseUrl(env = process.env) {
	return normalizeOptionalString(env.OPENAI_BASE_URL) ?? "https://api.openai.com/v1";
}
function isOpenAIApiBaseUrl(baseUrl) {
	const trimmed = normalizeOptionalString(baseUrl);
	if (!trimmed) return false;
	return /^https?:\/\/api\.openai\.com(?:\/v1)?\/?$/i.test(trimmed);
}
function isOpenAICodexBaseUrl(baseUrl) {
	const trimmed = normalizeOptionalString(baseUrl);
	if (!trimmed) return false;
	return /^https?:\/\/chatgpt\.com\/backend-api(?:\/codex)?(?:\/v1)?\/?$/i.test(trimmed);
}
function canonicalizeCodexResponsesBaseUrl(baseUrl) {
	return isOpenAICodexBaseUrl(baseUrl) ? OPENAI_CODEX_RESPONSES_BASE_URL : baseUrl;
}
//#endregion
export { isOpenAICodexBaseUrl as a, isOpenAIApiBaseUrl as i, OPENAI_CODEX_RESPONSES_BASE_URL as n, resolveOpenAIDefaultBaseUrl as o, canonicalizeCodexResponsesBaseUrl as r, OPENAI_API_BASE_URL as t };

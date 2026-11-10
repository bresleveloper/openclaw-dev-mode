import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/openai/base-url.ts
const OPENAI_CODEX_RESPONSES_BASE_URL = "https://chatgpt.com/backend-api/codex";
const OPENAI_CODEX_CLIENT_VERSION = "0.164.0";
/**
* ChatGPT model-list URL. The backend gates models on the client version, so
* discovery reports the Codex binary this process's turns run.
*/
async function resolveOpenAICodexModelsEndpoint(context = {}) {
	const { resolveCodexClientVersion } = await import("./plugin-sdk/codex-client-version-runtime.js");
	const clientVersion = await resolveCodexClientVersion({
		config: context.config,
		env: context.env,
		agentDir: context.agentDir
	}) ?? OPENAI_CODEX_CLIENT_VERSION;
	return `${OPENAI_CODEX_RESPONSES_BASE_URL}/models?client_version=${encodeURIComponent(clientVersion)}`;
}
const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
const OPENAI_PLATFORM_PATHS = /* @__PURE__ */ new Set([
	"/",
	"/v1",
	"/v1/"
]);
const OPENAI_CHATGPT_PATHS = /* @__PURE__ */ new Set([
	"/backend-api",
	"/backend-api/",
	"/backend-api/v1",
	"/backend-api/v1/",
	"/backend-api/codex",
	"/backend-api/codex/",
	"/backend-api/codex/v1",
	"/backend-api/codex/v1/",
	"/backend-api/codex/responses",
	"/backend-api/codex/responses/"
]);
/** Classifies exact native endpoints, valid custom URLs, and unsafe/invalid input. */
function classifyOpenAIBaseUrl(baseUrl) {
	if (baseUrl === void 0 || baseUrl === null || baseUrl === "") return "unresolved";
	if (typeof baseUrl !== "string") return "invalid";
	const trimmed = baseUrl.trim();
	if (!trimmed) return "unresolved";
	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:" || !url.hostname || url.username || url.password) return "invalid";
		const rawHost = url.hostname.toLowerCase();
		const host = rawHost.endsWith(".") ? rawHost.slice(0, -1) : rawHost;
		if (host === "api.openai.com" || host === "chatgpt.com") {
			if (url.protocol !== "https:" || url.port || url.search || url.hash) return "invalid";
			if (host === "api.openai.com" && OPENAI_PLATFORM_PATHS.has(url.pathname)) return "platform";
			if (host === "chatgpt.com" && OPENAI_CHATGPT_PATHS.has(url.pathname)) return "chatgpt";
			return "invalid";
		}
		return "custom";
	} catch {
		return "invalid";
	}
}
function resolveOpenAIDefaultBaseUrl(env = process.env) {
	return normalizeOptionalString(env.OPENAI_BASE_URL) ?? "https://api.openai.com/v1";
}
function isOpenAIApiBaseUrl(baseUrl) {
	return classifyOpenAIBaseUrl(baseUrl) === "platform";
}
function isOpenAICodexBaseUrl(baseUrl) {
	return classifyOpenAIBaseUrl(baseUrl) === "chatgpt";
}
function canonicalizeCodexResponsesBaseUrl(baseUrl) {
	return isOpenAICodexBaseUrl(baseUrl) ? OPENAI_CODEX_RESPONSES_BASE_URL : baseUrl;
}
//#endregion
export { isOpenAIApiBaseUrl as a, resolveOpenAIDefaultBaseUrl as c, classifyOpenAIBaseUrl as i, OPENAI_CODEX_RESPONSES_BASE_URL as n, isOpenAICodexBaseUrl as o, canonicalizeCodexResponsesBaseUrl as r, resolveOpenAICodexModelsEndpoint as s, OPENAI_API_BASE_URL as t };

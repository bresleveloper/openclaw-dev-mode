import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
//#region src/agents/openai-routing.ts
/**
* OpenAI provider routing decisions shared by model selection, auth profiles, and runtime setup.
*
* Custom OpenAI-compatible base URLs intentionally bypass Codex-runtime defaults.
*/
/** Canonical provider id for OpenAI-hosted model routes. */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = OPENAI_PROVIDER_ID;
function isOfficialOpenAIBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string" || !baseUrl.trim()) return true;
	try {
		const url = new URL(baseUrl.trim());
		return url.protocol === "https:" && url.hostname.toLowerCase() === "api.openai.com" && (url.pathname === "" || url.pathname === "/" || url.pathname === "/v1" || url.pathname === "/v1/");
	} catch {
		return false;
	}
}
function resolveOpenAIProviderConfig(config) {
	const providers = config?.models?.providers;
	if (!providers) return;
	const direct = providers.openai;
	if (direct) return direct;
	for (const [providerId, providerConfig] of Object.entries(providers)) if (normalizeProviderId(providerId) === "openai") return providerConfig;
}
function openAIProviderUsesCustomBaseUrl(config) {
	return !isOfficialOpenAIBaseUrl(resolveOpenAIProviderConfig(config)?.baseUrl);
}
/** Returns true for provider ids that normalize to OpenAI. */
function isOpenAIProvider(provider) {
	return normalizeProviderId(provider ?? "") === OPENAI_PROVIDER_ID;
}
/** Returns whether OpenAI should use the Codex runtime default for this config. */
function openAIProviderUsesCodexRuntimeByDefault(params) {
	return isOpenAIProvider(params.provider) && !openAIProviderUsesCustomBaseUrl(params.config);
}
/** Parses the provider portion from a provider/model ref. */
function parseModelRefProvider(value) {
	if (typeof value !== "string") return;
	const slashIndex = value.trim().indexOf("/");
	if (slashIndex <= 0) return;
	return normalizeProviderId(value.trim().slice(0, slashIndex));
}
/** Returns true when selected model config should ensure the Codex plugin exists. */
function modelSelectionShouldEnsureCodexPlugin(params) {
	return parseModelRefProvider(params.model) === "openai" && !openAIProviderUsesCustomBaseUrl(params.config);
}
/** Lists auth-profile providers for an OpenAI runtime route. */
function listOpenAIAuthProfileProvidersForAgentRuntime(params) {
	if (!isOpenAIProvider(params.provider)) return [params.provider];
	return [OPENAI_PROVIDER_ID];
}
/** Resolves the provider id passed to OpenAI runtime auth/execution paths. */
function resolveOpenAIRuntimeProvider(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
/** Resolves the selected provider id displayed for OpenAI runtime routes. */
function resolveSelectedOpenAIRuntimeProvider(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
/** Resolves the config provider used for context-window lookup. */
function resolveContextConfigProviderForRuntime(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
//#endregion
export { modelSelectionShouldEnsureCodexPlugin as a, resolveContextConfigProviderForRuntime as c, listOpenAIAuthProfileProvidersForAgentRuntime as i, resolveOpenAIRuntimeProvider as l, OPENAI_PROVIDER_ID as n, openAIProviderUsesCodexRuntimeByDefault as o, isOpenAIProvider as r, parseModelRefProvider as s, OPENAI_CODEX_PROVIDER_ID as t, resolveSelectedOpenAIRuntimeProvider as u };

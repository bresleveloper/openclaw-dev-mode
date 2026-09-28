import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { n as resolveCodexNativeWebSearchConfig } from "./codex-native-web-search.shared-ZWu7Abre.mjs";
import { t as resolveWebSearchToolPolicy } from "./web-search-tool-policy-DZicCkvV.mjs";
//#region src/agents/codex-native-web-search-core.ts
function isOpenAIAuthProviderId(provider) {
	return provider === "openai";
}
/** Returns whether a model API can accept the native Codex web_search tool. */
function isCodexNativeSearchEligibleModel(params) {
	return params.modelApi === "openai-chatgpt-responses";
}
function hasCodexNativeWebSearchTool(tools) {
	if (!Array.isArray(tools)) return false;
	return tools.some((tool) => isRecord(tool) && typeof tool.type === "string" && tool.type === "web_search");
}
/** Checks whether OpenAI/Codex auth is available for native web search. */
function hasAvailableCodexAuth(params) {
	if (params.authStore) return listProfilesForProvider(params.authStore, "openai").length > 0;
	if (Object.values(params.config?.auth?.profiles ?? {}).some((profile) => isRecord(profile) && isOpenAIAuthProviderId(profile.provider) && (profile.mode === "oauth" || profile.mode === "token"))) return true;
	if (params.agentDir) try {
		const store = ensureAuthProfileStore(params.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.config,
			provider: "openai"
		}) });
		if (listProfilesForProvider(store, "openai").length > 0) return true;
	} catch {}
	return false;
}
/** Resolves whether native search is active or why managed search should remain. */
function resolveCodexNativeSearchActivation(params) {
	const globalWebSearchEnabled = params.webSearchEnabled !== false && params.config?.tools?.web?.search?.enabled !== false;
	const codexConfig = resolveCodexNativeWebSearchConfig(params.config);
	const nativeEligible = isCodexNativeSearchEligibleModel(params);
	const hasRequiredAuth = params.modelApi !== "openai-chatgpt-responses" || !isOpenAIAuthProviderId(params.modelProvider) || hasAvailableCodexAuth(params);
	const searchProvider = params.config?.tools?.web?.search?.provider?.trim().toLowerCase();
	const managedProviderSelected = Boolean(searchProvider && searchProvider !== "auto" && searchProvider !== "openai");
	const inactiveReason = !globalWebSearchEnabled ? "globally_disabled" : !codexConfig.enabled ? "codex_not_enabled" : managedProviderSelected ? "managed_provider_selected" : !nativeEligible ? "model_not_eligible" : !hasRequiredAuth ? "codex_auth_missing" : !isNativeWebSearchAllowedByToolPolicy(params) ? "tool_policy_denied" : void 0;
	return {
		globalWebSearchEnabled,
		codexNativeEnabled: codexConfig.enabled,
		codexMode: codexConfig.mode,
		nativeEligible,
		hasRequiredAuth,
		state: inactiveReason ? "managed_only" : "native_active",
		...inactiveReason ? { inactiveReason } : {}
	};
}
function isNativeWebSearchAllowedByToolPolicy(params) {
	return resolveWebSearchToolPolicy(params).allowed;
}
/** Builds the OpenAI Responses `web_search` tool payload from config. */
function buildCodexNativeWebSearchTool(config) {
	const nativeConfig = resolveCodexNativeWebSearchConfig(config);
	const tool = {
		type: "web_search",
		external_web_access: nativeConfig.mode === "live"
	};
	if (nativeConfig.allowedDomains) tool.filters = { allowed_domains: nativeConfig.allowedDomains };
	if (nativeConfig.contextSize) tool.search_context_size = nativeConfig.contextSize;
	if (nativeConfig.userLocation) tool.user_location = {
		type: "approximate",
		...nativeConfig.userLocation
	};
	return tool;
}
/** Injects a native Codex web-search tool into a mutable provider payload. */
function patchCodexNativeWebSearchPayload(params) {
	if (!isRecord(params.payload)) return { status: "payload_not_object" };
	const payload = params.payload;
	if (hasCodexNativeWebSearchTool(payload.tools)) return { status: "native_tool_already_present" };
	const tools = Array.isArray(payload.tools) ? [...payload.tools] : [];
	tools.push(buildCodexNativeWebSearchTool(params.config));
	payload.tools = tools;
	return { status: "injected" };
}
//#endregion
export { resolveCodexNativeSearchActivation as a, patchCodexNativeWebSearchPayload as i, isCodexNativeSearchEligibleModel as n, isNativeWebSearchAllowedByToolPolicy as r, hasAvailableCodexAuth as t };

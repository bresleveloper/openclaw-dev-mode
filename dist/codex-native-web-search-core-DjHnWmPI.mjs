import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { f as listProfilesForProvider } from "./order-CElLtwMu.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { n as resolveCodexNativeWebSearchConfig } from "./codex-native-web-search.shared-CVD6u15D.mjs";
import { t as resolveWebSearchToolPolicy } from "./web-search-tool-policy-D7w0ZhRo.mjs";
//#region src/agents/codex-native-web-search-core.ts
/** Returns whether a model API can accept the native Codex web_search tool. */
function isCodexNativeSearchEligibleModel(params) {
	return params.modelApi === "openai-chatgpt-responses";
}
function hasCodexNativeWebSearchTool(tools) {
	if (!Array.isArray(tools)) return false;
	return tools.some((tool) => isRecord(tool) && tool.type === "web_search");
}
/** Checks whether OpenAI/Codex auth is available for native web search. */
async function hasAvailableCodexAuth(params) {
	if (params.authStore) return listProfilesForProvider(params.authStore, "openai").length > 0;
	if (Object.values(params.config?.auth?.profiles ?? {}).some((profile) => isRecord(profile) && profile.provider === "openai" && (profile.mode === "oauth" || profile.mode === "token"))) return true;
	if (params.agentDir) try {
		const store = await ensureAuthProfileStoreAsync(params.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
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
	const searchProvider = params.config?.tools?.web?.search?.provider?.trim().toLowerCase();
	const managedProviderSelected = Boolean(searchProvider && searchProvider !== "auto" && searchProvider !== "openai");
	const inactiveReason = !globalWebSearchEnabled ? "globally_disabled" : !codexConfig.enabled ? "codex_not_enabled" : managedProviderSelected ? "managed_provider_selected" : !nativeEligible ? "model_not_eligible" : !isNativeWebSearchAllowedByToolPolicy(params) ? "tool_policy_denied" : void 0;
	return {
		globalWebSearchEnabled,
		codexNativeEnabled: codexConfig.enabled,
		codexMode: codexConfig.mode,
		nativeEligible,
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

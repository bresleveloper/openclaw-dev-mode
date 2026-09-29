import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { t as resolveWebSearchToolPolicy } from "./web-search-tool-policy-BzVITC2P.mjs";
import { a as resolveCodexNativeSearchActivation } from "./codex-native-web-search-core-mYQiABCi.mjs";
//#region src/agents/native-web-search.ts
/** Resolves embedded hosted search before tools enter discovery or Code Mode. */
function resolveNativeWebSearchRoute(params) {
	if (params.webSearchEnabled === false || params.config?.tools?.web?.search?.enabled === false) return {
		kind: "disabled",
		reason: "globally_disabled"
	};
	if (!resolveWebSearchToolPolicy(params).allowed) return {
		kind: "disabled",
		reason: "tool_policy_denied"
	};
	const provider = params.modelProvider;
	if (provider && params.modelApi && resolveProviderPolicySurface(provider, {
		config: params.config,
		manifestRegistry: params.pluginMetadataSnapshot?.manifestRegistry
	})?.resolveNativeWebSearch?.({
		config: params.config,
		provider,
		modelId: params.modelId,
		api: params.modelApi,
		baseUrl: params.modelBaseUrl ?? params.config?.models?.providers?.[provider]?.baseUrl
	})) return {
		kind: "native",
		provider,
		transport: params.modelApi
	};
	if (resolveCodexNativeSearchActivation(params).state === "native_active") return {
		kind: "native",
		provider: "openai",
		transport: "openai-chatgpt-responses"
	};
	return { kind: "managed" };
}
//#endregion
export { resolveNativeWebSearchRoute as t };

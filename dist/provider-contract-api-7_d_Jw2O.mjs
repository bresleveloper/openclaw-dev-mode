import { i as resolveMinimaxThinkingProfile } from "./thinking-Dg9lPaiN.mjs";
//#region extensions/minimax/provider-contract-api.ts
const noopAuth = async () => ({ profiles: [] });
function minimaxAuthMethodMetadata(region, kind) {
	const isCn = region === "cn";
	const isApiKey = kind === "api_key";
	const label = `MiniMax ${isApiKey ? "API key" : "OAuth"} (${isCn ? "CN" : "Global"})`;
	const hint = isCn ? "CN endpoint - api.minimaxi.com" : "Global endpoint - api.minimax.io";
	return {
		id: isApiKey ? isCn ? "api-cn" : "api-global" : isCn ? "oauth-cn" : "oauth",
		kind,
		label,
		hint,
		wizard: {
			choiceId: `minimax-${isCn ? "cn" : "global"}-${isApiKey ? "api" : "oauth"}`,
			choiceLabel: label,
			choiceHint: hint,
			groupId: "minimax",
			groupLabel: "MiniMax",
			groupHint: "M3 (recommended)"
		}
	};
}
function createMinimaxProviderContract(portal) {
	return {
		id: portal ? "minimax-portal" : "minimax",
		label: "MiniMax",
		hookAliases: [portal ? "minimax-portal-cn" : "minimax-cn"],
		docsPath: "/providers/minimax",
		envVars: portal ? ["MINIMAX_OAUTH_TOKEN", "MINIMAX_API_KEY"] : ["MINIMAX_API_KEY"],
		resolveThinkingProfile: ({ modelId }) => resolveMinimaxThinkingProfile(modelId),
		auth: ["global", "cn"].map((region) => Object.assign(minimaxAuthMethodMetadata(region, portal ? "device_code" : "api_key"), { run: noopAuth }))
	};
}
function createMinimaxProvider() {
	return createMinimaxProviderContract(false);
}
function createMinimaxPortalProvider() {
	return createMinimaxProviderContract(true);
}
//#endregion
export { createMinimaxProvider as n, minimaxAuthMethodMetadata as r, createMinimaxPortalProvider as t };

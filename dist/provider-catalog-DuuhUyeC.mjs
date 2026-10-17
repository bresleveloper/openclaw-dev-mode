import { i as MINIMAX_TEXT_MODEL_ORDER } from "./provider-models-BanLFxIV.mjs";
import { l as buildMinimaxApiModelDefinition, n as MINIMAX_API_BASE_URL } from "./model-definitions-CvDgIK-w.mjs";
//#region extensions/minimax/provider-catalog.ts
function buildMinimaxModelDiscovery({ baseUrl, api }, authMode = "api_key") {
	const usesOpenAI = api === "openai-completions";
	const basePath = new URL(baseUrl).pathname.replace(/\/+$/, "");
	return {
		endpointPath: usesOpenAI || basePath.endsWith("/v1") ? "models" : "v1/models",
		buildRequestHeaders: ({ apiKey, discoveryApiKey }) => {
			const requestApiKey = discoveryApiKey ?? apiKey;
			if (!requestApiKey) return {};
			return usesOpenAI || authMode === "oauth" ? { Authorization: `Bearer ${requestApiKey}` } : { "X-Api-Key": requestApiKey };
		}
	};
}
function resolveMinimaxCatalogBaseUrl(env = process.env) {
	const url = URL.parse(env.MINIMAX_API_HOST?.trim() ?? "");
	if (!url) return MINIMAX_API_BASE_URL;
	const basePath = url.pathname.replace(/\/+$/, "");
	if (basePath.endsWith("/anthropic")) return `${url.origin}${basePath}`;
	return `${url.origin}/anthropic`;
}
function buildMinimaxProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: MINIMAX_TEXT_MODEL_ORDER.map(buildMinimaxApiModelDefinition)
	};
}
function buildMinimaxPortalProvider(env) {
	return buildMinimaxProvider(env);
}
//#endregion
export { resolveMinimaxCatalogBaseUrl as i, buildMinimaxPortalProvider as n, buildMinimaxProvider as r, buildMinimaxModelDiscovery as t };

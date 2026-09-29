import { i as MINIMAX_TEXT_MODEL_ORDER } from "./provider-models-Dbq8DYQ2.mjs";
import { l as buildMinimaxApiModelDefinition, n as MINIMAX_API_BASE_URL } from "./model-definitions-Byr02IeI.mjs";
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
	const rawHost = env.MINIMAX_API_HOST?.trim();
	if (!rawHost) return MINIMAX_API_BASE_URL;
	try {
		const url = new URL(rawHost);
		const basePath = url.pathname.replace(/\/+$/, "");
		if (basePath.endsWith("/anthropic")) return `${url.origin}${basePath}`;
		return `${url.origin}/anthropic`;
	} catch {
		return MINIMAX_API_BASE_URL;
	}
}
function buildMinimaxCatalog() {
	return MINIMAX_TEXT_MODEL_ORDER.map(buildMinimaxApiModelDefinition);
}
function buildMinimaxProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
function buildMinimaxPortalProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
//#endregion
export { resolveMinimaxCatalogBaseUrl as i, buildMinimaxPortalProvider as n, buildMinimaxProvider as r, buildMinimaxModelDiscovery as t };

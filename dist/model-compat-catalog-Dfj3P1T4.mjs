import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/agents/model-compat-catalog.ts
function isVllmQwenThinkingCompat(providerId, compat) {
	return providerId === "vllm" && (compat?.thinkingFormat === "qwen" || compat?.thinkingFormat === "qwen-chat-template");
}
function normalizeModelTransportBaseUrl(api, baseUrl) {
	return api === "anthropic-messages" ? baseUrl.replace(/\/v1\/?$/, "") : baseUrl;
}
function normalizeCatalogRouteBaseUrl(value) {
	if (!value) return;
	try {
		const url = new URL(value);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return value.replace(/\/+$/u, "");
	}
}
function normalizeBaseUrl(value, api) {
	return typeof value === "string" ? normalizeCatalogRouteBaseUrl(normalizeModelTransportBaseUrl(api, value.trim())) ?? "" : "";
}
function modelTransportRoutesMatch(catalogRoute, configuredRoute) {
	const catalogApi = normalizeLowercaseStringOrEmpty(catalogRoute.api);
	const configuredApi = normalizeLowercaseStringOrEmpty(configuredRoute.api) || catalogApi;
	const catalogBaseUrl = normalizeBaseUrl(catalogRoute.baseUrl, catalogApi);
	return configuredApi === catalogApi && (normalizeBaseUrl(configuredRoute.baseUrl, configuredApi) || catalogBaseUrl) === catalogBaseUrl;
}
/** Returns one unambiguous physical catalog route for destructive config cleanup. */
function resolveUniqueCatalogModelRoute(catalogRoutes, configuredRoute) {
	let match;
	for (const route of catalogRoutes ?? []) {
		if (!modelTransportRoutesMatch(route, configuredRoute)) continue;
		if (match) return;
		match = route;
	}
	return match;
}
/** Capabilities belong to the catalog route; config owns them only for a different/custom route. */
function resolveCatalogOwnedModelCompat(params) {
	if (!params.catalogRoute) return params.configuredCompat;
	return modelTransportRoutesMatch(params.catalogRoute, params.configuredRoute ?? {}) ? params.catalogCompat : params.configuredCompat;
}
//#endregion
export { resolveCatalogOwnedModelCompat as a, normalizeModelTransportBaseUrl as i, modelTransportRoutesMatch as n, resolveUniqueCatalogModelRoute as o, normalizeCatalogRouteBaseUrl as r, isVllmQwenThinkingCompat as t };

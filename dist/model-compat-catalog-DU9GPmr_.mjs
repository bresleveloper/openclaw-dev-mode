import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/agents/model-compat-catalog.ts
function normalizeBaseUrl(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	if (!trimmed) return "";
	try {
		const url = new URL(trimmed);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return trimmed.replace(/\/+$/u, "");
	}
}
function modelTransportRoutesMatch(catalogRoute, configuredRoute) {
	const catalogApi = normalizeLowercaseStringOrEmpty(catalogRoute.api);
	const catalogBaseUrl = normalizeBaseUrl(catalogRoute.baseUrl);
	return (normalizeLowercaseStringOrEmpty(configuredRoute.api) || catalogApi) === catalogApi && (normalizeBaseUrl(configuredRoute.baseUrl) || catalogBaseUrl) === catalogBaseUrl;
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
export { resolveCatalogOwnedModelCompat as n, resolveUniqueCatalogModelRoute as r, modelTransportRoutesMatch as t };

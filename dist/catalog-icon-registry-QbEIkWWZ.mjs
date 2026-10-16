import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
//#region src/plugins/catalog-icon-registry.ts
const catalogIconUrls = new LruCache(1024);
function normalizeCatalogIconUrl(value) {
	if (!value || value.length > 2048) return;
	const url = URL.parse(value);
	return url?.protocol === "https:" && url.hostname && !url.username && !url.password && !url.hash ? url.href : void 0;
}
function registerClawHubCatalogIconUrls(values) {
	for (const value of values) {
		if (!value) continue;
		const normalized = normalizeCatalogIconUrl(value);
		if (!normalized) continue;
		catalogIconUrls.set(normalized, normalized);
	}
}
function resolveClawHubCatalogIconUrl(value) {
	const normalized = normalizeCatalogIconUrl(value);
	return normalized ? catalogIconUrls.peek(normalized) : void 0;
}
//#endregion
export { registerClawHubCatalogIconUrls as n, resolveClawHubCatalogIconUrl as r, normalizeCatalogIconUrl as t };

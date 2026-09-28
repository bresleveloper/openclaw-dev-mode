//#region src/plugins/catalog-icon-registry.ts
const MAX_CATALOG_ICON_URLS = 1024;
const catalogIconUrls = /* @__PURE__ */ new Set();
function normalizeCatalogIconUrl(value) {
	if (!value || value.length > 2048) return;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.hostname && !url.username && !url.password && !url.hash ? url.href : void 0;
	} catch {
		return;
	}
}
function registerClawHubCatalogIconUrls(values) {
	for (const value of values) {
		if (!value) continue;
		const normalized = normalizeCatalogIconUrl(value);
		if (!normalized) continue;
		catalogIconUrls.delete(normalized);
		catalogIconUrls.add(normalized);
		if (catalogIconUrls.size > MAX_CATALOG_ICON_URLS) {
			const oldest = catalogIconUrls.values().next().value;
			if (oldest) catalogIconUrls.delete(oldest);
		}
	}
}
function resolveClawHubCatalogIconUrl(value) {
	const normalized = normalizeCatalogIconUrl(value);
	return normalized && catalogIconUrls.has(normalized) ? normalized : void 0;
}
//#endregion
export { resolveClawHubCatalogIconUrl as n, registerClawHubCatalogIconUrls as t };

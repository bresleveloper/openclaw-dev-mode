import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
//#region src/gateway/server-model-catalog.ts
const loadModelCatalogModule = async () => await import("./model-catalog-B5-rgcvG.js");
function createGatewayModelCatalogCache() {
	return {
		lastSuccessfulCatalog: null,
		inFlightRefresh: null,
		staleGeneration: 0,
		appliedGeneration: 0
	};
}
const readOnlyModelCatalogCache = createGatewayModelCatalogCache();
const fullModelCatalogCache = createGatewayModelCatalogCache();
function resolveGatewayModelCatalogCache(params) {
	return params?.readOnly === false ? fullModelCatalogCache : readOnlyModelCatalogCache;
}
function resetGatewayModelCatalogState() {
	for (const cache of [readOnlyModelCatalogCache, fullModelCatalogCache]) {
		cache.lastSuccessfulCatalog = null;
		cache.inFlightRefresh = null;
		cache.staleGeneration = 0;
		cache.appliedGeneration = 0;
	}
}
function isGatewayModelCatalogStale(cache) {
	return cache.appliedGeneration < cache.staleGeneration;
}
async function resolveLoadModelCatalog(params) {
	if (params?.loadModelCatalog) return params.loadModelCatalog;
	const { loadModelCatalog } = await loadModelCatalogModule();
	return loadModelCatalog;
}
function startGatewayModelCatalogRefresh(params) {
	const cache = resolveGatewayModelCatalogCache(params);
	const config = (params?.getConfig ?? getRuntimeConfig)();
	const readOnly = params?.readOnly !== false;
	const refreshGeneration = cache.staleGeneration;
	const refresh = resolveLoadModelCatalog(params).then((loadModelCatalog) => loadModelCatalog({
		config,
		readOnly
	})).then((catalog) => {
		if ((readOnly || catalog.length > 0) && refreshGeneration === cache.staleGeneration) {
			cache.lastSuccessfulCatalog = catalog;
			cache.appliedGeneration = cache.staleGeneration;
		}
		return catalog;
	}).finally(() => {
		if (cache.inFlightRefresh === refresh) cache.inFlightRefresh = null;
	});
	cache.inFlightRefresh = refresh;
	return refresh;
}
/** Mark cached model catalogs stale after config/plugin reload changes. */
function markGatewayModelCatalogStaleForReload() {
	readOnlyModelCatalogCache.staleGeneration += 1;
	fullModelCatalogCache.staleGeneration += 1;
}
async function resetModelCatalogCacheForTest() {
	resetGatewayModelCatalogState();
	const { resetModelCatalogCacheForTest: resetModelCatalogCacheForTestLocal } = await loadModelCatalogModule();
	resetModelCatalogCacheForTestLocal();
}
/** Load the Gateway model catalog, returning cached data while stale refreshes run. */
async function loadGatewayModelCatalog(params) {
	const cache = resolveGatewayModelCatalogCache(params);
	const isStale = isGatewayModelCatalogStale(cache);
	if (!isStale && cache.lastSuccessfulCatalog !== null) return cache.lastSuccessfulCatalog;
	if (isStale && cache.lastSuccessfulCatalog !== null) {
		if (!cache.inFlightRefresh) startGatewayModelCatalogRefresh(params).catch(() => void 0);
		return cache.lastSuccessfulCatalog;
	}
	if (cache.inFlightRefresh) return await cache.inFlightRefresh;
	return await startGatewayModelCatalogRefresh(params);
}
//#endregion
export { markGatewayModelCatalogStaleForReload as n, resetModelCatalogCacheForTest as r, loadGatewayModelCatalog as t };

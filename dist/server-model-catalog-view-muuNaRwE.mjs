//#region src/gateway/server-model-catalog-view.ts
const metadataByCatalog = /* @__PURE__ */ new WeakMap();
function createPreparedGatewayModelCatalog(params) {
	const catalog = {
		entries: params.entries,
		routeVariants: params.routeVariants,
		pluginRegistry: params.pluginRegistry
	};
	if (params.metadataSnapshot) metadataByCatalog.set(catalog, params.metadataSnapshot);
	return catalog;
}
function readPreparedGatewayModelCatalogMetadata(catalog) {
	return catalog ? metadataByCatalog.get(catalog) : void 0;
}
//#endregion
export { readPreparedGatewayModelCatalogMetadata as n, createPreparedGatewayModelCatalog as t };

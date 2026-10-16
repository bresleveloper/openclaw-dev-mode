//#region src/gateway/server-model-catalog-auth.ts
const privateAccessByLoader = /* @__PURE__ */ new WeakMap();
/** Keeps prepared auth, metadata, and registry ownership behind the Gateway loader boundary. */
function registerGatewayModelCatalogPrivateAccess(loader, access) {
	privateAccessByLoader.set(loader, access);
}
function requirePrivateAccess(context) {
	const access = privateAccessByLoader.get(context.loadGatewayModelCatalogSnapshot);
	if (!access) throw new Error("Gateway model catalog loader omitted prepared owner access");
	return access;
}
async function loadDeferredCatalog(context, agentId, options) {
	return await requirePrivateAccess(context).loadDeferred({
		agentId,
		...options
	});
}
async function readPreparedCatalog(context, agentId) {
	return await requirePrivateAccess(context).readPrepared({ agentId });
}
//#endregion
export { readPreparedCatalog as n, registerGatewayModelCatalogPrivateAccess as r, loadDeferredCatalog as t };

//#region src/gateway/server-methods/optional-model-catalog.ts
/** Reads already-published startup facts without starting provider discovery on an RPC hot path. */
async function readPreparedServerMethodModelCatalog(context, options) {
	try {
		return context.readPreparedGatewayModelCatalog ? await context.readPreparedGatewayModelCatalog(options) : void 0;
	} catch {
		return;
	}
}
async function readPreparedServerMethodModelCatalogs(context, agentIds) {
	const catalogs = /* @__PURE__ */ new Map();
	if (!context.readPreparedGatewayModelCatalogBatch) {
		for (const agentId of agentIds) catalogs.set(agentId, await readPreparedServerMethodModelCatalog(context, { agentId }));
		return catalogs;
	}
	try {
		const results = await context.readPreparedGatewayModelCatalogBatch(agentIds);
		agentIds.forEach((agentId, index) => {
			const result = results[index];
			catalogs.set(agentId, result?.status === "fulfilled" ? result.value : void 0);
		});
	} catch {
		for (const agentId of agentIds) catalogs.set(agentId, void 0);
	}
	return catalogs;
}
//#endregion
export { readPreparedServerMethodModelCatalogs as n, readPreparedServerMethodModelCatalog as t };

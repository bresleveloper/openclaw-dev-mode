//#region src/gateway/server-methods/optional-model-catalog.ts
/**
* Optional model-catalog loader for methods where metadata improves the result
* but should never block the primary session response path.
*/
const DEFAULT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS = 750;
const loggedSlowCatalogKeys = /* @__PURE__ */ new Set();
function normalizeOptionalModelCatalog(value) {
	return Array.isArray(value) ? value : void 0;
}
function startOptionalServerMethodModelCatalogLoad(context) {
	let catalogPromise;
	try {
		catalogPromise = context.loadGatewayModelCatalog();
	} catch {
		catalogPromise = Promise.resolve(void 0);
	}
	return { promise: catalogPromise.then((value) => {
		return normalizeOptionalModelCatalog(value);
	}, () => {}) };
}
/** Loads the gateway model catalog with a short timeout and one-time slow logs. */
async function loadOptionalServerMethodModelCatalog(context, surface, options) {
	let timeout;
	const timedOut = Symbol("server-method-model-catalog-timeout");
	const timeoutMs = options?.timeoutMs ?? DEFAULT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS;
	const catalogLoad = options?.startedLoad ?? startOptionalServerMethodModelCatalogLoad(context);
	const timeoutPromise = new Promise((resolve) => {
		timeout = setTimeout(() => resolve(timedOut), timeoutMs);
		timeout.unref?.();
	});
	try {
		const result = await Promise.race([catalogLoad.promise, timeoutPromise]);
		if (result === timedOut) {
			const logOnceKey = options?.logOnceKey ?? "session-metadata";
			if (!loggedSlowCatalogKeys.has(logOnceKey)) {
				loggedSlowCatalogKeys.add(logOnceKey);
				context.logGateway.debug(`${surface} continuing without model catalog after ${timeoutMs}ms`);
			}
			return;
		}
		return normalizeOptionalModelCatalog(result);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
//#endregion
export { startOptionalServerMethodModelCatalogLoad as n, loadOptionalServerMethodModelCatalog as t };

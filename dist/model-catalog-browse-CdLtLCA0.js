import { f as clampTimerTimeoutMs, j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { p as parseConfiguredModelVisibilityEntries } from "./model-selection-shared-CKMggJal.js";
//#region src/agents/model-catalog-browse.ts
/**
* Loads model catalog views for browse/search UI surfaces.
*/
/**
* Loads the model catalog shape used by browse/list commands without letting optional
* provider discovery stall the CLI path.
*/
const DEFAULT_MODEL_CATALOG_BROWSE_TIMEOUT_MS = 750;
/** True when a browse view cannot be answered from read-only cached catalog entries. */
function modelCatalogBrowseRequiresFullDiscovery(params) {
	const view = params.view ?? "default";
	return view === "all" || view === "configured" && parseConfiguredModelVisibilityEntries({ cfg: params.cfg }).providerWildcards.size > 0;
}
function resolveModelCatalogBrowseTimeoutMs(value) {
	return clampTimerTimeoutMs(value, 1) ?? resolveTimerTimeoutMs(DEFAULT_MODEL_CATALOG_BROWSE_TIMEOUT_MS, 1);
}
/** Loads catalog entries for browse views, using read-only discovery unless full catalog is required. */
async function loadModelCatalogForBrowse(params) {
	const view = params.view ?? "default";
	if (modelCatalogBrowseRequiresFullDiscovery({
		cfg: params.cfg,
		view
	})) return await params.loadCatalog({ readOnly: false });
	let timeout;
	const timeoutMs = resolveModelCatalogBrowseTimeoutMs(params.timeoutMs);
	const timedOut = Symbol("model-catalog-browse-timeout");
	const catalogPromise = params.loadCatalog({ readOnly: true });
	const timeoutPromise = new Promise((resolve) => {
		timeout = globalThis.setTimeout(() => resolve(timedOut), timeoutMs);
		timeout.unref?.();
	});
	try {
		const result = await Promise.race([catalogPromise, timeoutPromise]);
		if (result === timedOut) {
			catalogPromise.catch(() => void 0);
			params.onTimeout?.(timeoutMs);
			return [];
		}
		return result;
	} finally {
		if (timeout) globalThis.clearTimeout(timeout);
	}
}
//#endregion
export { modelCatalogBrowseRequiresFullDiscovery as n, loadModelCatalogForBrowse as t };

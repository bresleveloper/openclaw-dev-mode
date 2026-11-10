import { i as getRemoteModelCatalogProviderOverlay } from "./remote-overlay-ClWDV070.mjs";
import { n as planManifestModelCatalogRows } from "./manifest-planner-sZi1SDO4.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-xL-mNZoa.mjs";
//#region src/model-catalog/index.ts
function planEffectiveModelCatalogRows(params) {
	return planManifestModelCatalogRows({
		registry: params.registry,
		includeProvider: (provider, plugin) => isProviderCatalogSourceAllowed({
			provider,
			plugin,
			config: params.config
		}),
		...params.providerFilter ? { providerFilter: params.providerFilter } : {},
		...params.providerFilters ? { providerFilters: params.providerFilters } : {},
		...params.mergeKeyFilter ? { mergeKeyFilter: params.mergeKeyFilter } : {},
		resolveRemoteProvider: (provider) => getRemoteModelCatalogProviderOverlay(params.config, provider),
		...params.selection ? { selection: params.selection } : {}
	});
}
//#endregion
export { planEffectiveModelCatalogRows as t };

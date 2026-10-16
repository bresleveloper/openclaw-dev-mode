import { n as planManifestModelCatalogRows } from "./manifest-planner-C-nOh69Z.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-2NQ6j_Jm.mjs";
import { a as getRemoteModelCatalogProviderOverlay } from "./remote-overlay-C3A-3o4_.mjs";
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

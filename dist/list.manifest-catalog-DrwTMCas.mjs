import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { o as resolvePluginContributionOwners } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-Ag5B94I6.mjs";
//#region src/commands/models/list.manifest-catalog.ts
/** Static manifest rows for setup flows before a runtime owner exists. */
/** Loads authoritative static rows without importing provider runtimes. */
function loadStaticManifestCatalogRowsForList(params) {
	const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : void 0;
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env ?? process.env
	});
	const rowsForPluginIds = (pluginIds) => {
		if (pluginIds?.length === 0) return [];
		const pluginIdSet = pluginIds ? new Set(pluginIds) : void 0;
		const registry = snapshot.manifestRegistry;
		return planEffectiveModelCatalogRows({
			registry: pluginIdSet ? {
				...registry,
				plugins: registry.plugins.filter((plugin) => pluginIdSet.has(plugin.id))
			} : registry,
			config: params.cfg,
			...providerFilter ? { providerFilter } : {},
			selection: "static"
		}).rows;
	};
	if (!providerFilter) return rowsForPluginIds();
	const conventionRows = rowsForPluginIds(isInstalledPluginEnabled(snapshot.index, providerFilter, params.cfg, params.env) ? [providerFilter] : []);
	if (conventionRows.length > 0) return conventionRows;
	return rowsForPluginIds(resolvePluginContributionOwners({
		lookUpTable: snapshot,
		config: params.cfg,
		env: params.env,
		contribution: "modelCatalogProviders",
		matches: providerFilter
	}));
}
//#endregion
export { loadStaticManifestCatalogRowsForList as t };

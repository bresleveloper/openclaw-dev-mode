import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Zl-RSskC.mjs";
import { o as resolvePluginContributionOwners } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-ChjLpeN0.mjs";
//#region src/commands/models/list.manifest-catalog.ts
/** Static manifest rows for setup flows before a runtime owner exists. */
function planManifestCatalogRowsForPluginIds(params) {
	if (params.pluginIds && params.pluginIds.length === 0) return [];
	const pluginIdSet = params.pluginIds ? new Set(params.pluginIds) : void 0;
	const registry = pluginIdSet ? {
		...params.registry,
		plugins: params.registry.plugins.filter((plugin) => pluginIdSet.has(plugin.id))
	} : params.registry;
	return planEffectiveModelCatalogRows({
		registry,
		config: params.cfg,
		...params.providerFilter ? { providerFilter: params.providerFilter } : {},
		selection: "static"
	}).rows;
}
/** Loads authoritative static rows without importing provider runtimes. */
function loadStaticManifestCatalogRowsForList(params) {
	const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : void 0;
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env ?? process.env
	});
	if (!providerFilter) return planManifestCatalogRowsForPluginIds({
		cfg: params.cfg,
		registry: snapshot.manifestRegistry
	});
	const conventionRows = planManifestCatalogRowsForPluginIds({
		cfg: params.cfg,
		registry: snapshot.manifestRegistry,
		pluginIds: isInstalledPluginEnabled(snapshot.index, providerFilter, params.cfg, params.env) ? [providerFilter] : [],
		providerFilter
	});
	if (conventionRows.length > 0) return conventionRows;
	return planManifestCatalogRowsForPluginIds({
		cfg: params.cfg,
		registry: snapshot.manifestRegistry,
		pluginIds: resolvePluginContributionOwners({
			lookUpTable: snapshot,
			config: params.cfg,
			env: params.env,
			contribution: "modelCatalogProviders",
			matches: providerFilter
		}),
		providerFilter
	});
}
//#endregion
export { loadStaticManifestCatalogRowsForList as t };

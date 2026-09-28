import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { n as normalizePluginsConfigWithResolverCore } from "./config-normalization-shared-B7M6gfm-.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import { r as loadPluginManifestRegistryForInstalledIndex } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { g as listPluginManifestContributionIds, h as createPluginRegistryIdNormalizer, s as loadPluginMetadataSnapshotForRegistry, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
//#region src/plugins/plugin-registry-contributions.ts
/** Loads manifest and installed-index contributions used to build plugin registry snapshots. */
function normalizeContributionId(value) {
	return value.trim();
}
function listManifestContractValues(plugin, contract) {
	return plugin.contracts?.[contract] ?? [];
}
function loadManifestContractRecords(params) {
	let records = params.manifestRecords;
	if (!records) {
		if (params.index !== void 0 || params.preferPersisted === false || params.allowCurrent === false || params.stateDir !== void 0 || params.filePath !== void 0 || params.pluginIndexFilePath !== void 0 || params.installRecords !== void 0 || params.candidates !== void 0 || params.diagnostics !== void 0 || params.discovery !== void 0 || params.now !== void 0) return loadPluginManifestRegistryForPluginRegistry({
			...params,
			pluginIds: params.onlyPluginIds,
			includeDisabled: true
		}).plugins;
		records = resolvePluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			allowWorkspaceScopedCurrent: params.workspaceDir === void 0
		}).plugins;
	}
	if (params.onlyPluginIds === void 0) return records;
	const pluginIds = new Set(params.onlyPluginIds);
	return records.filter((record) => pluginIds.has(record.id));
}
function createContributionPluginFilter(params, index) {
	if (params.includeDisabled) {
		const installedPluginIds = new Set(index.plugins.map((plugin) => plugin.pluginId));
		return (pluginId) => installedPluginIds.has(pluginId);
	}
	return createInstalledPluginEnabledPredicate(index.plugins, params.config, params.env);
}
function listContributionManifestPlugins(params) {
	const lookUpTable = params.lookUpTable;
	if (lookUpTable) {
		const includePlugin = createContributionPluginFilter(params, lookUpTable.index);
		return lookUpTable.plugins.filter((plugin) => includePlugin(plugin.id));
	}
	const { snapshot: index, manifestRegistry } = loadContributionRegistrySnapshot(params);
	const pluginIds = index.plugins.map((plugin) => plugin.pluginId);
	return loadPluginManifestRegistryForInstalledIndex({
		index,
		manifestRegistry,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: params.includeDisabled ? pluginIds : pluginIds.filter(createContributionPluginFilter(params, index)),
		includeDisabled: true
	}).plugins;
}
function loadContributionRegistrySnapshot(params) {
	const metadata = params.bundledChannelConfigCollector ? void 0 : loadPluginMetadataSnapshotForRegistry(params);
	return metadata ? {
		snapshot: metadata.index,
		manifestRegistry: metadata.manifestRegistry
	} : loadPluginRegistrySnapshotWithMetadata(params);
}
function loadPluginManifestRegistryForPluginRegistry(params = {}) {
	const { snapshot: index, manifestRegistry } = loadContributionRegistrySnapshot(params);
	return loadPluginManifestRegistryForInstalledIndex({
		index,
		...manifestRegistry ? { manifestRegistry } : {},
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: params.pluginIds,
		includeDisabled: params.includeDisabled,
		...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
	});
}
function normalizePluginsConfigWithRegistry(config, index, options = {}) {
	return normalizePluginsConfigWithResolverCore(config, createPluginRegistryIdNormalizer(index, options));
}
function listPluginContributionIds(params) {
	const plugins = listContributionManifestPlugins(params);
	return normalizeSortedUniqueStringEntries(plugins.flatMap((plugin) => listPluginManifestContributionIds(plugin, params.contribution)));
}
function resolvePluginContributionOwners(params) {
	if (params.lookUpTable && typeof params.matches === "string") {
		const index = params.lookUpTable.index;
		const owners = params.lookUpTable.owners[params.contribution].get(params.matches);
		if (!owners) return [];
		return normalizeSortedUniqueStringEntries(owners.filter(createContributionPluginFilter(params, index)));
	}
	const matcher = typeof params.matches === "string" ? (contributionId) => contributionId === params.matches : params.matches;
	const plugins = listContributionManifestPlugins(params);
	return normalizeSortedUniqueStringEntries(plugins.flatMap((plugin) => listPluginManifestContributionIds(plugin, params.contribution).some(matcher) ? [plugin.id] : []));
}
function resolveManifestContractPluginIds(params) {
	return loadManifestContractRecords(params).filter((plugin) => (!params.origin || plugin.origin === params.origin) && listManifestContractValues(plugin, params.contract).length > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function resolveManifestContractOwnerPluginId(params) {
	const normalizedValue = normalizeContributionId(params.value ?? "").toLowerCase();
	if (!normalizedValue) return;
	return loadManifestContractRecords(params).find((plugin) => (!params.origin || plugin.origin === params.origin) && listManifestContractValues(plugin, params.contract).some((candidate) => normalizeContributionId(candidate).toLowerCase() === normalizedValue))?.id;
}
//#endregion
export { resolveManifestContractPluginIds as a, resolveManifestContractOwnerPluginId as i, loadPluginManifestRegistryForPluginRegistry as n, resolvePluginContributionOwners as o, normalizePluginsConfigWithRegistry as r, listPluginContributionIds as t };

import { n as withBundledPluginVitestCompat, t as withBundledPluginEnablementCompat } from "./bundled-compat-BkqWLooJ.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-CaDgql0z.js";
import { t as ensureStandaloneRuntimePluginRegistryLoaded } from "./standalone-runtime-registry-loader-itHDtSe1.js";
import { t as resolveManifestContractRuntimePluginResolution } from "./manifest-contract-runtime-B5piqY5b.js";
//#region src/plugins/migration-provider-runtime.ts
function findMigrationProviderById(entries, providerId) {
	return entries.find((entry) => entry.provider.id === providerId)?.provider;
}
function resolveMigrationProviderConfig(params) {
	return withBundledPluginVitestCompat({
		config: withBundledPluginEnablementCompat({
			config: params.cfg,
			pluginIds: [...params.bundledCompatPluginIds]
		}),
		pluginIds: [...params.bundledCompatPluginIds],
		env: process.env
	});
}
function resolveMigrationProviderRegistry(params) {
	return getLoadedRuntimePluginRegistry({ requiredPluginIds: params.pluginIds });
}
function mergeMigrationProviders(left, right) {
	const merged = /* @__PURE__ */ new Map();
	for (const entry of [...left, ...right]) if (!merged.has(entry.provider.id)) merged.set(entry.provider.id, entry.provider);
	return [...merged.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
function ensureStandaloneMigrationProviderRegistryLoaded(params = {}) {
	const resolution = resolveManifestContractRuntimePluginResolution({
		cfg: params.cfg,
		contract: "migrationProviders"
	});
	if (resolution.pluginIds.length === 0) return;
	const compatConfig = resolveMigrationProviderConfig({
		cfg: params.cfg,
		bundledCompatPluginIds: resolution.bundledCompatPluginIds
	});
	ensureStandaloneRuntimePluginRegistryLoaded({
		surface: "active",
		requiredPluginIds: resolution.pluginIds,
		loadOptions: {
			...compatConfig === void 0 ? {} : { config: compatConfig },
			onlyPluginIds: resolution.pluginIds,
			activate: false
		}
	});
}
function resolvePluginMigrationProvider(params) {
	const activeProvider = findMigrationProviderById(getLoadedRuntimePluginRegistry()?.migrationProviders ?? [], params.providerId);
	if (activeProvider) return activeProvider;
	const pluginIds = resolveManifestContractRuntimePluginResolution({
		cfg: params.cfg,
		contract: "migrationProviders",
		value: params.providerId
	}).pluginIds;
	if (pluginIds.length === 0) return;
	return findMigrationProviderById(resolveMigrationProviderRegistry({ pluginIds })?.migrationProviders ?? [], params.providerId);
}
function resolvePluginMigrationProviders(params = {}) {
	const activeProviders = getLoadedRuntimePluginRegistry()?.migrationProviders ?? [];
	const pluginIds = resolveManifestContractRuntimePluginResolution({
		cfg: params.cfg,
		contract: "migrationProviders"
	}).pluginIds;
	if (pluginIds.length === 0) return mergeMigrationProviders(activeProviders, []);
	return mergeMigrationProviders(activeProviders, resolveMigrationProviderRegistry({ pluginIds })?.migrationProviders ?? []);
}
//#endregion
export { resolvePluginMigrationProvider as n, resolvePluginMigrationProviders as r, ensureStandaloneMigrationProviderRegistryLoaded as t };

import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { f as isBundledProviderCompatContract, m as withBundledPluginEnablementCompat } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as MissingPublicSurfaceError } from "./facade-loader-BWw5NpKt.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync, r as loadPluginPublicArtifactModuleSync } from "./public-surface-loader-CNXp9Fm5.mjs";
import { r as isManifestPluginOwnerAllowedByControlPlanePolicy } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { n as listBundledPluginMetadata } from "./bundled-plugin-metadata-DiURDLnU.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-DitY2Htf.mjs";
import { r as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-k2s7FqfS.mjs";
import "./loader-CidXT38G.mjs";
import { t as resolveManifestContractRuntimePluginResolution } from "./manifest-contract-runtime-DoBXVmPZ.mjs";
//#region src/plugins/migration-provider-public-artifacts.ts
const MIGRATION_PROVIDER_ARTIFACT = "migration-provider-api.js";
function resolveMigrationProviderPublicArtifacts(params) {
	const providers = [];
	for (const plugin of params.plugins) {
		const declared = plugin.contracts?.migrationProviders ?? [];
		if (declared.length === 0 || !declared.includes(params.providerId)) continue;
		let artifact;
		try {
			artifact = plugin.origin === "bundled" ? loadBundledPluginPublicArtifactModuleSync({
				dirName: plugin.dirName,
				artifactBasename: MIGRATION_PROVIDER_ARTIFACT
			}) : loadPluginPublicArtifactModuleSync({
				pluginRoot: plugin.rootDir,
				artifactBasename: MIGRATION_PROVIDER_ARTIFACT,
				origin: plugin.origin
			});
		} catch (error) {
			if (error instanceof MissingPublicSurfaceError) continue;
			throw error;
		}
		if (typeof artifact.buildMigrationProvider !== "function") throw new Error(`Plugin "${plugin.id}" has an invalid ${MIGRATION_PROVIDER_ARTIFACT}: buildMigrationProvider is required.`);
		const provider = artifact.buildMigrationProvider();
		if (provider.id !== params.providerId || typeof provider.plan !== "function" || typeof provider.apply !== "function") throw new Error(`Plugin "${plugin.id}" returned an invalid migration provider from ${MIGRATION_PROVIDER_ARTIFACT}.`);
		const existing = providers.find((entry) => entry.provider.id === provider.id);
		if (existing) throw new Error(`Multiple plugins declare migration provider "${provider.id}": ${existing.pluginId}, ${plugin.id}.`);
		providers.push({
			pluginId: plugin.id,
			provider
		});
	}
	return providers;
}
//#endregion
//#region src/plugins/migration-provider-runtime.ts
function resolveMigrationProviderPluginResolution(params) {
	const resolution = resolveManifestContractRuntimePluginResolution({
		cfg: params.cfg,
		contract: "migrationProviders",
		...params.providerId ? { value: params.providerId } : {}
	});
	const pluginIds = new Set(resolution.pluginIds);
	const bundledCompatPluginIds = new Set(resolution.bundledCompatPluginIds);
	const publicPlugins = resolution.plugins.flatMap((plugin) => plugin.origin === "global" && pluginIds.has(plugin.id) ? [{
		id: plugin.id,
		origin: "global",
		rootDir: plugin.rootDir,
		contracts: plugin.contracts
	}] : []);
	const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
	for (const plugin of listBundledPluginMetadata({ includeChannelConfigs: false })) {
		const providerIds = plugin.manifest.contracts?.migrationProviders ?? [];
		if (providerIds.length === 0 || params.providerId && !providerIds.includes(params.providerId) || publicPlugins.some((owner) => owner.id === plugin.manifest.id) || !isManifestPluginOwnerAllowedByControlPlanePolicy({
			plugin: {
				id: plugin.manifest.id,
				origin: "bundled",
				channels: plugin.manifest.channels
			},
			config: params.cfg,
			normalizedConfig,
			allowBundledProviderCompat: isBundledProviderCompatContract("migrationProviders")
		})) continue;
		pluginIds.add(plugin.manifest.id);
		bundledCompatPluginIds.add(plugin.manifest.id);
		publicPlugins.push({
			id: plugin.manifest.id,
			origin: "bundled",
			dirName: plugin.dirName,
			contracts: { migrationProviders: providerIds }
		});
	}
	return {
		pluginIds: [...pluginIds].toSorted((left, right) => left.localeCompare(right)),
		bundledCompatPluginIds: [...bundledCompatPluginIds].toSorted((left, right) => left.localeCompare(right)),
		publicPlugins
	};
}
function mergeMigrationProviders(...registries) {
	const merged = /* @__PURE__ */ new Map();
	for (const registry of registries) for (const { pluginId, provider } of registry?.migrationProviders ?? []) if (!merged.has(provider.id)) {
		const record = registry?.plugins?.find((entry) => entry.id === pluginId);
		const instance = record && getPluginInstance(record);
		merged.set(provider.id, instance?.wrap(provider) ?? provider);
	}
	return [...merged.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
/** Keep provider callbacks and opaque plans inside the operation that owns their registration. */
async function withPluginMigrationProviders(params, run) {
	const activeRegistry = getLoadedRuntimePluginRegistry();
	const activeProviders = activeRegistry?.migrationProviders ?? [];
	if (params.providerId && activeProviders.some(({ provider }) => provider.id === params.providerId)) return await run(mergeMigrationProviders(activeRegistry));
	const resolution = resolveMigrationProviderPluginResolution(params);
	if (params.providerId) {
		const providers = resolveMigrationProviderPublicArtifacts({
			plugins: resolution.publicPlugins,
			providerId: params.providerId
		});
		if (providers.length > 0) return await run(mergeMigrationProviders(activeRegistry, { migrationProviders: providers }));
	}
	if (resolution.pluginIds.length === 0 || getLoadedRuntimePluginRegistry({ requiredPluginIds: resolution.pluginIds })) return await run(mergeMigrationProviders(activeRegistry));
	const compatConfig = withBundledPluginEnablementCompat({
		config: params.cfg,
		pluginIds: resolution.bundledCompatPluginIds
	});
	const acquisition = await acquirePluginRegistryForInspection({
		...compatConfig === void 0 ? {} : { config: compatConfig },
		onlyPluginIds: resolution.pluginIds
	});
	let result;
	try {
		result = await run(mergeMigrationProviders(activeRegistry, acquisition.registry));
	} catch (error) {
		const failures = [error];
		try {
			await acquisition.release();
		} catch (disposalError) {
			failures.push(disposalError);
		}
		if (failures.length > 1) throw new AggregateError(failures, "Migration failed and its plugin resources could not be disposed", { cause: error });
		throw error;
	}
	try {
		await acquisition.release();
	} catch (error) {
		if (!params.onCleanupError) throw error;
		await params.onCleanupError(error);
	}
	return result;
}
//#endregion
export { withPluginMigrationProviders as t };

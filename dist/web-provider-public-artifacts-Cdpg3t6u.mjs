import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { i as readBundledDiscoveryModeMemoized } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import { i as getCurrentPluginMetadataSnapshot, p as normalizePluginIdScope, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { t as resolveBundledCompatActivationInputs } from "./activation-context-CNegFLwh.mjs";
import { t as resolveEnabledBundledManifestContractPlugins } from "./bundled-manifest-contract-plugins-DP4uyfAX.mjs";
import { t as sortPluginEntriesById } from "./plugin-entry-order-DxrT0ucv.mjs";
import { n as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, r as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts, t as resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts.explicit-BBXzSv64.mjs";
//#region src/plugins/web-provider-resolution-shared.ts
function pluginManifestDeclaresProviderConfig(record, configKey, contract) {
	if ((record.contracts?.[contract]?.length ?? 0) > 0) return true;
	if (Object.keys(record.configUiHints ?? {}).some((key) => key === configKey || key.startsWith(`${configKey}.`))) return true;
	const properties = record.configSchema?.properties;
	return typeof properties === "object" && properties !== null && configKey in properties;
}
function loadInstalledWebProviderManifestRecords(params) {
	const records = params.manifestRecords ?? loadManifestMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env
	}).plugins;
	const pluginIdSet = createPluginIdScopeSet(params.pluginIds);
	return pluginIdSet ? records.filter((plugin) => pluginIdSet.has(plugin.id)) : records;
}
/** Returns only plugin ids for manifest-declared web provider candidates. */
function resolveManifestDeclaredWebProviderCandidatePluginIds(params) {
	return resolveManifestDeclaredWebProviderCandidates(params).pluginIds;
}
/** Resolves manifest-declared web provider candidates without importing plugin runtime code. */
function resolveManifestDeclaredWebProviderCandidates(params) {
	const scopedPluginIds = normalizePluginIdScope(params.onlyPluginIds);
	if (scopedPluginIds?.length === 0) return { pluginIds: [] };
	const onlyPluginIdSet = createPluginIdScopeSet(scopedPluginIds);
	const manifestRecords = params.manifestRecords ?? loadInstalledWebProviderManifestRecords({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: scopedPluginIds
	});
	const ids = manifestRecords.filter((plugin) => (!params.origin || plugin.origin === params.origin) && (!params.sandboxed || plugin.origin === "bundled" || plugin.trustedOfficialInstall === true) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && pluginManifestDeclaresProviderConfig(plugin, params.configKey, params.contract)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	if (ids.length > 0) return {
		pluginIds: ids,
		manifestRecords
	};
	if (params.origin || params.sandboxed || scopedPluginIds !== void 0) return {
		pluginIds: [],
		manifestRecords
	};
	return {
		pluginIds: void 0,
		manifestRecords
	};
}
function resolveBundledWebProviderCompatPluginIds(params) {
	return loadInstalledWebProviderManifestRecords(params).filter((plugin) => plugin.origin === "bundled" && (plugin.contracts?.[params.contract]?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Builds bundled-plugin activation config for provider families with legacy enablement defaults. */
function resolveBundledWebProviderResolutionConfig(params) {
	const currentSnapshot = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowWorkspaceScopedSnapshot: true
	});
	let manifestRecords = params.manifestRecords ?? currentSnapshot?.plugins;
	const activation = resolveBundledCompatActivationInputs({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		applyAutoEnable: true,
		...manifestRecords ? { manifestRegistry: {
			plugins: [...manifestRecords],
			diagnostics: []
		} } : {},
		...currentSnapshot?.discovery ? { discovery: currentSnapshot.discovery } : {},
		resolveBundledPluginIds: (compatParams) => {
			manifestRecords ??= loadInstalledWebProviderManifestRecords({
				config: params.config,
				workspaceDir: params.workspaceDir,
				env: params.env
			});
			return resolveBundledWebProviderCompatPluginIds({
				contract: params.contract,
				...compatParams,
				manifestRecords
			});
		}
	});
	return {
		config: activation.config,
		activationSourceConfig: activation.activationSourceConfig,
		autoEnabledReasons: activation.autoEnabledReasons,
		manifestRecords
	};
}
/** Adds plugin ids to registry provider records, applies an optional plugin scope, then sorts. */
function mapRegistryProviders(params) {
	const onlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(params.onlyPluginIds));
	return sortPluginEntriesById(params.entries.filter((entry) => !onlyPluginIdSet || onlyPluginIdSet.has(entry.pluginId)).map(({ pluginId, provider }) => {
		const record = params.registry.plugins.find((entry) => entry.id === pluginId);
		const instance = record && getPluginInstance(record);
		return Object.assign({}, instance?.wrap(provider) ?? provider, { pluginId });
	}));
}
//#endregion
//#region src/plugins/web-provider-public-artifacts.ts
function filterAllowlistedBundledPluginIds(config, pluginIds, env) {
	if (readBundledDiscoveryModeMemoized(env) === "compat") return [...pluginIds];
	const allow = config?.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0) return [...pluginIds];
	const allowedPluginIds = new Set(normalizeUniqueStringEntries(allow.map((pluginId) => normalizePluginId(pluginId))));
	return pluginIds.filter((pluginId) => allowedPluginIds.has(pluginId));
}
function resolveBundledCandidatePluginIds(params) {
	if (params.onlyPluginIds !== void 0) return {
		pluginIds: filterAllowlistedBundledPluginIds(params.config, [...new Set(params.onlyPluginIds)], params.env).toSorted((left, right) => left.localeCompare(right)),
		...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
	};
	const resolvedConfig = resolveBundledWebProviderResolutionConfig(params).config;
	const candidates = resolveManifestDeclaredWebProviderCandidates({
		contract: params.contract,
		configKey: params.configKey,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		origin: "bundled",
		manifestRecords: params.manifestRecords
	});
	return {
		pluginIds: filterAllowlistedBundledPluginIds(resolvedConfig, candidates.pluginIds ?? [], params.env),
		...candidates.manifestRecords ? { manifestRecords: candidates.manifestRecords } : {}
	};
}
function resolveBundledRuntimeCandidates(params) {
	const search = params.contract === "webSearchProviders";
	const resolvedConfig = resolveBundledWebProviderResolutionConfig(params).config;
	const candidates = resolveManifestDeclaredWebProviderCandidates({
		contract: params.contract,
		configKey: search ? "webSearch" : "webFetch",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		manifestRecords: params.manifestRecords
	});
	const pluginIds = filterAllowlistedBundledPluginIds(resolvedConfig, candidates.pluginIds ?? [], params.env);
	const recordsByPluginId = new Map((candidates.manifestRecords ?? []).filter((record) => pluginIds.includes(record.id)).map((record) => [record.id, record]));
	if (pluginIds.some((pluginId) => recordsByPluginId.get(pluginId)?.origin !== "bundled")) return null;
	const enabledPluginIds = new Set(resolveEnabledBundledManifestContractPlugins({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: pluginIds,
		contract: params.contract,
		manifestRecords: candidates.manifestRecords
	}).map((plugin) => plugin.id));
	return {
		onlyPluginIds: pluginIds.filter((pluginId) => enabledPluginIds.has(pluginId)),
		env: params.env,
		manifestRecords: candidates.manifestRecords
	};
}
function resolveBundledWebProvidersFromPublicArtifacts(params) {
	const candidates = resolveBundledCandidatePluginIds({
		contract: params.contract,
		configKey: params.configKey,
		config: params.resolution.config,
		workspaceDir: params.resolution.workspaceDir,
		env: params.resolution.env,
		onlyPluginIds: params.resolution.onlyPluginIds,
		manifestRecords: params.resolution.manifestRecords
	});
	if (candidates.pluginIds.length === 0) return [];
	const manifestRecords = candidates.manifestRecords ?? params.resolution.manifestRecords;
	const explicit = {
		onlyPluginIds: candidates.pluginIds,
		env: params.resolution.env,
		manifestRecords
	};
	const explicitProviders = params.loadExplicit(explicit);
	if (explicitProviders || manifestRecords) return explicitProviders;
	return params.loadExplicit({
		...explicit,
		manifestRecords: loadManifestMetadataSnapshot({
			config: params.resolution.config,
			workspaceDir: params.resolution.workspaceDir,
			env: params.resolution.env
		}).plugins
	});
}
function resolveBundledWebSearchProvidersFromPublicArtifacts(params) {
	return resolveBundledWebProvidersFromPublicArtifacts({
		contract: "webSearchProviders",
		configKey: "webSearch",
		resolution: params,
		loadExplicit: resolveBundledExplicitWebSearchProvidersFromPublicArtifacts
	});
}
function resolveBundledWebFetchProvidersFromPublicArtifacts(params) {
	return resolveBundledWebProvidersFromPublicArtifacts({
		contract: "webFetchProviders",
		configKey: "webFetch",
		resolution: params,
		loadExplicit: resolveBundledExplicitWebFetchProvidersFromPublicArtifacts
	});
}
function resolveEnabledBundledWebSearchProvidersFromPublicArtifacts(params) {
	const candidates = resolveBundledRuntimeCandidates({
		...params,
		contract: "webSearchProviders"
	});
	return candidates ? resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(candidates) : null;
}
function resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts(params) {
	const candidates = resolveBundledRuntimeCandidates({
		...params,
		contract: "webFetchProviders"
	});
	return candidates ? resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts(candidates) : null;
}
//#endregion
export { mapRegistryProviders as a, resolveEnabledBundledWebSearchProvidersFromPublicArtifacts as i, resolveBundledWebFetchProvidersFromPublicArtifacts as n, resolveBundledWebProviderResolutionConfig as o, resolveBundledWebSearchProvidersFromPublicArtifacts as r, resolveManifestDeclaredWebProviderCandidatePluginIds as s, resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts as t };

import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as readBundledDiscoveryModeMemoized } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { f as isBundledProviderCompatContract, r as isInstalledPluginEnabled, t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { a as resolveManifestOwnerBasePolicyBlock } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { r as resolveChannelConfigRecord, t as hasMeaningfulChannelConfigShallow } from "./channel-configured-shared-Cojxg7l6.mjs";
//#region src/plugins/manifest-contract-eligibility.ts
/** Enforces owner-specific policy while preserving bundled speech/global compatibility. */
function isManifestPluginOwnerAllowedByControlPlanePolicy(params) {
	if (!params.config?.plugins) return true;
	const config = params.config;
	const normalized = params.normalizedConfig ?? normalizePluginsConfig(config.plugins);
	const normalizedConfig = normalized.enabled ? normalized : {
		...normalized,
		enabled: true
	};
	const block = resolveManifestOwnerBasePolicyBlock({
		plugin: params.plugin,
		normalizedConfig,
		allowRestrictiveAllowlistBypass: params.plugin.origin === "bundled" && params.allowRestrictiveAllowlistBypass === true
	});
	if (block !== "not-in-allowlist") return block === null;
	if (params.plugin.origin !== "bundled") return false;
	if ((params.plugin.channels ?? [params.plugin.id]).some((channelId) => {
		const channelConfig = resolveChannelConfigRecord(config, channelId);
		return channelConfig?.enabled !== false && hasMeaningfulChannelConfigShallow(channelConfig);
	})) return true;
	return params.allowBundledProviderCompat === true && readBundledDiscoveryModeMemoized(params.env) === "compat";
}
function isManifestPluginAvailableForControlPlane(params) {
	if (!isManifestPluginOwnerAllowedByControlPlanePolicy(params)) return false;
	if (params.plugin.origin === "bundled") return true;
	if (params.isInstalledPluginEnabled) return params.isInstalledPluginEnabled(params.plugin.id);
	return isInstalledPluginEnabled(params.snapshot.index, params.plugin.id, params.config, params.env);
}
function hasManifestContractValue(params) {
	const values = params.plugin.contracts?.[params.contract] ?? [];
	return values.length > 0 && (!params.value || values.includes(params.value));
}
function listAvailableManifestContractPlugins(params) {
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	const isEnabled = createInstalledPluginEnabledPredicate(params.snapshot.index.plugins, params.config, params.env);
	return params.snapshot.plugins.filter((plugin) => hasManifestContractValue({
		plugin,
		contract: params.contract,
		value: params.value
	}) && isManifestPluginAvailableForControlPlane({
		snapshot: params.snapshot,
		plugin,
		config: params.config,
		normalizedConfig,
		isInstalledPluginEnabled: isEnabled,
		env: params.env,
		allowBundledProviderCompat: isBundledProviderCompatContract(params.contract)
	}));
}
function listAvailableManifestContractValues(params) {
	const values = /* @__PURE__ */ new Set();
	for (const plugin of listAvailableManifestContractPlugins(params)) for (const value of plugin.contracts?.[params.contract] ?? []) values.add(value);
	return sortUniqueStrings(values);
}
function loadManifestContractSnapshot(params) {
	const snapshot = loadManifestMetadataSnapshot(params);
	return {
		index: snapshot.index,
		plugins: snapshot.plugins,
		byPluginId: snapshot.byPluginId
	};
}
function loadManifestMetadataRegistry(params) {
	const snapshot = loadManifestMetadataSnapshot(params);
	return {
		index: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	};
}
function loadManifestMetadataSnapshot(params) {
	return resolvePluginMetadataSnapshot({
		config: params.config,
		env: params.env ?? process.env,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0
	});
}
//#endregion
export { listAvailableManifestContractValues as a, loadManifestMetadataSnapshot as c, listAvailableManifestContractPlugins as i, isManifestPluginAvailableForControlPlane as n, loadManifestContractSnapshot as o, isManifestPluginOwnerAllowedByControlPlanePolicy as r, loadManifestMetadataRegistry as s, hasManifestContractValue as t };
